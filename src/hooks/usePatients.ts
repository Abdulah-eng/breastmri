import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Patient, Department, NewPatient } from '../types';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to fetch departments');
    }
  }, []);

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          departments (name)
        `)
        .order('checked_in_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our Patient interface
      const transformedPatients: Patient[] = (data || []).map(patient => ({
        id: patient.id,
        name: patient.name,
        department: patient.departments?.name || 'Unknown Department',
        notes: patient.notes || undefined,
        scanTime: patient.scan_time || undefined,
        checkedInAt: patient.checked_in_at,
        status: patient.status,
        station: patient.station_id || undefined,
        completedAt: patient.completed_at || undefined,
      }));

      setPatients(transformedPatients);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to fetch patients');
    }
  }, []);

  // Add patient
  const addPatient = useCallback(async (patientData: NewPatient) => {
    try {
      // Ensure departments are loaded first
      if (departments.length === 0) {
        await fetchDepartments();
      }
      
      // Handle both department ID and name
      const department = departments.find(d => d.id === patientData.department || d.name === patientData.department);
      
      if (!department) {
        throw new Error(`Department "${patientData.department}" not found. Please select a valid department.`);
      }
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: patientData.name,
          department_id: department.id,
          notes: patientData.notes || null,
          scan_time: patientData.scanTime || null,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Patient added successfully:', data);
      
      // Refresh patients list
      await fetchPatients();
      return data;
    } catch (err) {
      console.error('Error adding patient:', err);
      setError(`Failed to add patient: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [departments, fetchPatients, fetchDepartments]);

  // Update patient status
  const updatePatientStatus = useCallback(async (patientId: string, status: Patient['status']) => {
    try {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.station_id = null; // free station upon completion
      }

      const { error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', patientId);

      if (error) throw error;

      // If patient is being called, add to recent calls
      if (status === 'called') {
        await supabase
          .from('recent_calls')
          .insert({
            patient_id: patientId,
            called_by: 'System',
          });
      }

      // Refresh patients list
      await fetchPatients();
    } catch (err) {
      console.error('Error updating patient status:', err);
      setError('Failed to update patient status');
      throw err;
    }
  }, [fetchPatients]);

  // Remove patient
  const removePatient = useCallback(async (patientId: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      // Refresh patients list
      await fetchPatients();
    } catch (err) {
      console.error('Error removing patient:', err);
      setError('Failed to remove patient');
      throw err;
    }
  }, [fetchPatients]);

  // Assign patient to station
  const assignPatientToStation = useCallback(async (patientId: string, stationId: number) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ 
          station_id: stationId,
          status: 'called'  // Changed from 'in-progress' to 'called' so they appear in department view
        })
        .eq('id', patientId);

      if (error) throw error;

      // Add to recent calls when assigned to station
      await supabase
        .from('recent_calls')
        .insert({
          patient_id: patientId,
          called_by: 'System',
        });

      // Refresh patients list
      await fetchPatients();
    } catch (err) {
      console.error('Error assigning patient to station:', err);
      setError('Failed to assign patient to station');
      throw err;
    }
  }, [fetchPatients]);

  // Mark station complete (free station without changing patient status)
  const markStationComplete = useCallback(async (patientId: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ 
          station_id: null
        })
        .eq('id', patientId);

      if (error) throw error;

      await fetchPatients();
    } catch (err) {
      console.error('Error freeing station for patient:', err);
      setError('Failed to free station for patient');
      throw err;
    }
  }, [fetchPatients]);

  // Complete multiple patients
  const completeAllPatients = useCallback(async (patientIds: string[]) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          station_id: null // free stations in bulk
        })
        .in('id', patientIds);

      if (error) throw error;

      // Refresh patients list
      await fetchPatients();
    } catch (err) {
      console.error('Error completing patients:', err);
      setError('Failed to complete patients');
      throw err;
    }
  }, [fetchPatients]);

  // Transfer patients to another department
  const transferPatients = useCallback(async (patientIds: string[], targetDepartmentName: string) => {
    try {
      // Find the target department
      const targetDepartment = departments.find(d => d.name === targetDepartmentName);
      
      if (!targetDepartment) {
        throw new Error(`Department "${targetDepartmentName}" not found`);
      }

      const { error } = await supabase
        .from('patients')
        .update({ 
          department_id: targetDepartment.id
        })
        .in('id', patientIds);

      if (error) throw error;

      // Refresh patients list
      await fetchPatients();
    } catch (err) {
      console.error('Error transferring patients:', err);
      setError('Failed to transfer patients');
      throw err;
    }
  }, [departments, fetchPatients]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchDepartments(), fetchPatients()]);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDepartments, fetchPatients]);

  return {
    patients,
    departments,
    loading,
    error,
    addPatient,
    updatePatientStatus,
    removePatient,
    assignPatientToStation,
    markStationComplete,
    completeAllPatients,
    transferPatients,
    refreshPatients: fetchPatients,
    refreshDepartments: fetchDepartments,
  };
};
