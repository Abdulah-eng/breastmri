import React from 'react';
import { X } from 'lucide-react';
import { Department, NewPatient } from '../types';
import PatientCheckIn from './PatientCheckIn';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onAddPatient: (patient: NewPatient) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  departments,
  onAddPatient
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Register New Patient</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <PatientCheckIn 
            departments={departments} 
            onAddPatient={(patient) => {
              onAddPatient(patient);
              onClose();
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
