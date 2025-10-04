import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Department } from '../types';

interface TransferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (targetDepartment: string) => void;
  departments: Department[];
  currentDepartment: string;
  patientCount: number;
}

const TransferPopup: React.FC<TransferPopupProps> = ({
  isOpen,
  onClose,
  onTransfer,
  departments,
  currentDepartment,
  patientCount
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');

  if (!isOpen) return null;

  const handleTransfer = () => {
    if (selectedDepartment) {
      onTransfer(selectedDepartment);
      setSelectedDepartment('');
      onClose();
    }
  };

  const availableDepartments = departments.filter(d => d.name !== currentDepartment);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transfer Patients</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Transfer <strong>{patientCount} patients</strong> from <strong>{currentDepartment}</strong> to:
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Target Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Choose department...</option>
            {availableDepartments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTransfer}
            disabled={!selectedDepartment}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Transfer Patients</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferPopup;
