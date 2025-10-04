import React from 'react';
import { Activity, CheckCircle } from 'lucide-react';
import { Patient } from '../types';

interface ActivePatientsProps {
  patients: Patient[];
  onUpdatePatient: (patientId: string, status: Patient['status']) => void;
  query?: string;
}

const ActivePatients: React.FC<ActivePatientsProps> = ({ patients, onUpdatePatient, query = '' }) => {
  const filtered = patients
    .filter(p => p.status === 'in-progress' || p.status === 'called')
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold">Active Patients</h2>
          </div>
          <span className="text-sm text-gray-600">{filtered.length} active</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No active patients</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((patient, index) => (
              <div key={patient.id} className="p-4 rounded-lg bg-white/70 border border-gray-200 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.department}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-brand-50 text-brand-700">{patient.status === 'called' ? 'Called' : 'In Progress'}</span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => onUpdatePatient(patient.id, 'completed')}
                    className="w-full btn-primary"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePatients;


