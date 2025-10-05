import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Patient } from '../types';

export const useRecentCalls = () => {
  const [recentCalls, setRecentCalls] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent calls
  const fetchRecentCalls = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('recent_calls')
        .select(`
          *,
          patients (
            id,
            name,
            phone,
            department_id,
            appointment_type,
            priority,
            notes,
            scan_time,
            checked_in_at,
            status,
            station_id,
            completed_at,
            departments (name)
          )
        `)
        .order('called_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Transform data to match our Patient interface and remove duplicates
      const transformedCalls: Patient[] = (data || [])
        .filter(call => call.patients) // Filter out any calls without patient data
        .map(call => ({
          id: call.patients.id,
          name: call.patients.name,
          department: call.patients.departments?.name || 'Unknown',
          notes: call.patients.notes || undefined,
          scanTime: call.patients.scan_time || undefined,
          checkedInAt: call.patients.checked_in_at,
          status: call.patients.status,
          station: call.patients.station_id || undefined,
          completedAt: call.patients.completed_at || undefined,
        }))
        .reduce((acc, current) => {
          // Remove duplicates by patient ID, keeping the most recent call
          const existingIndex = acc.findIndex(item => item.id === current.id);
          if (existingIndex === -1) {
            acc.push(current);
          }
          return acc;
        }, [] as Patient[])
        .slice(0, 10); // Limit to 10 most recent unique patients

      setRecentCalls(transformedCalls);
    } catch (err) {
      console.error('Error fetching recent calls:', err);
      setError('Failed to fetch recent calls');
    }
  }, []);

  // Add recent call
  const addRecentCall = useCallback(async (patientId: string, calledBy: string = 'System') => {
    try {
      const { error } = await supabase
        .from('recent_calls')
        .insert({
          patient_id: patientId,
          called_by: calledBy,
        });

      if (error) throw error;

      // Refresh recent calls
      await fetchRecentCalls();
    } catch (err) {
      console.error('Error adding recent call:', err);
      setError('Failed to add recent call');
      throw err;
    }
  }, [fetchRecentCalls]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchRecentCalls();
      } catch (err) {
        console.error('Error loading recent calls:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchRecentCalls]);

  return {
    recentCalls,
    loading,
    error,
    addRecentCall,
    refreshRecentCalls: fetchRecentCalls,
  };
};
