import React, { useState } from 'react';
import { PhoneCall, Eye, EyeOff } from 'lucide-react';
import { Patient } from '../types';

interface RecentCallsProps {
  recentCalls: Patient[];
  onUpdatePatient: (patientId: string, status: Patient['status']) => void;
}

const RecentCalls: React.FC<RecentCallsProps> = ({ recentCalls, onUpdatePatient }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const activeCalls = recentCalls.filter(p => p.status !== 'completed').length;
  const completedToday = recentCalls.filter(p => p.status === 'completed').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <PhoneCall className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{activeCalls} active</span>
            <span className="text-sm text-gray-600">{completedToday} completed today</span>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
            >
              {showCompleted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Show Completed</span>
            </button>
          </div>
        </div>

        <div className="min-h-[150px] flex items-center justify-center">
          {recentCalls.length === 0 ? (
            <div className="text-center text-gray-500">
              <PhoneCall className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No patients called yet</p>
            </div>
          ) : (
            <div className="w-full space-y-2">
              {recentCalls
                .filter(call => showCompleted || call.status !== 'completed')
                .slice(0, 5)
                .map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{call.name}</p>
                      <p className="text-sm text-gray-600">{call.department}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {call.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span><strong>Lobby Display:</strong> Shows only active patients (not completed)</span>
            <span><strong>Recent Calls:</strong> Keeps daily history of all patients</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentCalls;