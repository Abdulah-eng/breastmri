import React from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { Patient } from '../types';

interface WaitlistProps {
  patients: Patient[];
}

const Waitlist: React.FC<WaitlistProps> = ({ patients }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Waitlist</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{patients.length} waiting</span>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="min-h-[200px] flex items-center justify-center">
          {patients.length === 0 ? (
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No patients waiting</p>
            </div>
          ) : (
            <div className="w-full space-y-3">
              {patients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.department}</p>
                    {patient.scanTime && (
                      <p className="text-sm text-blue-600">Scheduled: {patient.scanTime}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(patient.checkedInAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waitlist;