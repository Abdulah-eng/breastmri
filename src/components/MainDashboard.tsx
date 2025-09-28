import React, { useState } from 'react';
import { Patient, Department } from '../types';
import PatientCheckIn from './PatientCheckIn';
import Waitlist from './Waitlist';
import RecentCalls from './RecentCalls';
import StationAssignment from './StationAssignment';

interface MainDashboardProps {
  patients: Patient[];
  recentCalls: Patient[];
  departments: Department[];
  onAddPatient: (patient: Omit<Patient, 'id' | 'checkedInAt' | 'status'>) => void;
  onUpdatePatient: (patientId: string, status: Patient['status']) => void;
  onViewDepartment: (departmentId: string) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  patients,
  recentCalls,
  departments,
  onAddPatient,
  onUpdatePatient,
  onViewDepartment
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Clinic Queue Management System v2</h1>
        <p className="text-gray-600">Real-time patient queue management system</p>
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Patient Check-In */}
        <div className="space-y-6">
          <PatientCheckIn departments={departments} onAddPatient={onAddPatient} />
        </div>

        {/* Right Column - Waitlist */}
        <div className="space-y-6">
          <Waitlist patients={patients.filter(p => p.status === 'waiting')} />
        </div>
      </div>

      {/* Recent Calls */}
      <RecentCalls 
        recentCalls={recentCalls} 
        onUpdatePatient={onUpdatePatient}
      />

      {/* Station Assignment */}
      <StationAssignment 
        patients={patients.filter(p => p.status === 'in-progress')}
        departments={departments}
        onViewDepartment={onViewDepartment}
      />
    </div>
  );
};

export default MainDashboard;