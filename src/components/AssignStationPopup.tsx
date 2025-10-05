import React, { useMemo, useState } from 'react';
import { X, Monitor, Check } from 'lucide-react';
import { Patient } from '../types';

interface AssignStationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (stationId: number) => void;
  patients: Patient[];
  totalStations?: number; // defaults to 6
}

const AssignStationPopup: React.FC<AssignStationPopupProps> = ({
  isOpen,
  onClose,
  onAssign,
  patients,
  totalStations = 6,
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const occupied = useMemo(() => new Set(patients.filter(p => p.station).map(p => Number(p.station))), [patients]);
  const stations = useMemo(() => Array.from({ length: totalStations }, (_, i) => i + 1), [totalStations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Assign Station</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">Select an available station below. Occupied stations are disabled.</p>

          <div className="grid grid-cols-3 gap-3">
            {stations.map((id) => {
              const isOccupied = occupied.has(id);
              const isSelected = selected === id;
              return (
                <button
                  key={id}
                  disabled={isOccupied}
                  onClick={() => setSelected(id)}
                  className={`rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-colors ${
                    isOccupied
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className={`w-6 h-6 ${isOccupied ? 'text-gray-300' : isSelected ? 'text-brand-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{id}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => selected && onAssign(selected)}
              disabled={!selected}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              Assign
            </button>
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStationPopup;


