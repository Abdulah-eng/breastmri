import React from 'react';
import { ArrowRight, Monitor } from 'lucide-react';
import { Patient, Department } from '../types';

interface StationAssignmentProps {
  patients: Patient[];
  departments: Department[];
  onViewDepartment: (departmentId: string) => void;
}

const StationAssignment: React.FC<StationAssignmentProps> = ({ 
  patients, 
  departments, 
  onViewDepartment 
}) => {
  const stations = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    patient: patients.find(p => p.station === i + 1)
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ArrowRight className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Station Assignment</h2>
          </div>
          <span className="text-sm text-gray-600">0 in queue</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {stations.map((station) => (
            <div key={station.id} className="text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-2">
                <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                {station.patient ? (
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-900">{station.patient.name}</p>
                    <p className="text-xs text-gray-600">{station.patient.department}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Available</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Station</p>
                <p className="font-semibold text-gray-900">{station.id}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500">
          <Monitor className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No patients in queue</p>
        </div>

        {/* Quick Department Access */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-3">Quick Department Access:</p>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => onViewDepartment(dept.id)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationAssignment;