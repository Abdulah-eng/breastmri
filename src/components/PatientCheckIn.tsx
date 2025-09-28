import React, { useState } from 'react';
import { UserPlus, Clock } from 'lucide-react';
import { Patient, Department } from '../types';

interface PatientCheckInProps {
  departments: Department[];
  onAddPatient: (patient: Omit<Patient, 'id' | 'checkedInAt' | 'status'>) => void;
}

const PatientCheckIn: React.FC<PatientCheckInProps> = ({ departments, onAddPatient }) => {
  const [patientName, setPatientName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [scanTime, setScanTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientName.trim() && selectedDepartment) {
      onAddPatient({
        name: patientName.trim(),
        department: selectedDepartment,
        scanTime: scanTime || undefined
      });
      setPatientName('');
      setSelectedDepartment('');
      setScanTime('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Patient Check-In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scanTime" className="block text-sm font-medium text-gray-700 mb-2">
              Scan Time (Optional)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                id="scanTime"
                value={scanTime}
                onChange={(e) => setScanTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
          >
            Check In Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientCheckIn;