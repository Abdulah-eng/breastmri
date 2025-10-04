import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Patient } from '../types';

interface CompletedPatientsProps {
  patients: Patient[];
  query?: string;
}

const CompletedPatients: React.FC<CompletedPatientsProps> = ({ patients, query = '' }) => {
  const filtered = patients
    .filter(p => p.status === 'completed')
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Completed Patients</h2>
          </div>
          <span className="text-sm text-gray-600">{filtered.length} completed</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No completed patients</p>
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
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedPatients;


