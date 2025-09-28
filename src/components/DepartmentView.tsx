import React from 'react';
import { ArrowLeft, Monitor, Users, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Patient } from '../types';

interface DepartmentViewProps {
  departmentId: string;
  departmentName: string;
  patients: Patient[];
  onBack: () => void;
  onUpdatePatient: (patientId: string, status: Patient['status']) => void;
  onRemovePatient: (patientId: string) => void;
}

const DepartmentView: React.FC<DepartmentViewProps> = ({ 
  departmentId,
  departmentName, 
  patients, 
  onBack,
  onUpdatePatient,
  onRemovePatient
}) => {
  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const [currentTime, setCurrentTime] = React.useState(getCurrentTime());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-3">
                <Monitor className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">{departmentName} Display</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{currentTime}</div>
                <div className="text-sm text-gray-600">{getDate()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-8 mb-4">
            {/* Northgate Open MRI Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/image1.png" 
                alt="Northgate Open MRI" 
                className="w-16 h-16 object-contain"
              />
              <div className="text-left">
                <div className="text-lg font-bold text-gray-800">NORTHGATE</div>
                <div className="text-sm text-gray-600">OPEN MRI</div>
              </div>
            </div>
            
            <div className="text-4xl text-gray-300">&</div>
            
            {/* McAllen Breast Imaging Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/image2.png" 
                alt="McAllen Breast Imaging" 
                className="w-16 h-16 object-contain"
              />
              <div className="text-left">
                <div className="text-lg font-bold text-gray-800">McAllen</div>
                <div className="text-sm text-gray-600">Breast Imaging</div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {departmentName} Department
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Department Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Current Patients</h1>
            <div className="flex items-center justify-center space-x-6">
              <span className="text-lg">{patients.length} patients • Live Updates</span>
            </div>
          </div>

          {/* Patient Display Area */}
          <div className="p-12">
            {patients.length === 0 ? (
              <div className="text-center py-16">
                <Monitor className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  No patients in {departmentName}
                </h3>
                <p className="text-gray-500 text-lg">
                  Updates automatically in real-time
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {patients.map((patient) => (
                  <div key={patient.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>
                        <p className="text-lg text-gray-600">{patient.department}</p>
                        <p className="text-sm text-gray-500">
                          Checked in at {new Date(patient.checkedInAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          patient.status === 'waiting' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : patient.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.status === 'waiting' ? 'Waiting' : 
                           patient.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Department Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Actions:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
              <CheckCircle className="w-5 h-5" />
              <span>Complete {departmentName} - marks patient as finished in this department</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span>Transfer - moves patient to different department</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">
              <X className="w-5 h-5" />
              <span>Done & Remove - completely removes patient from system</span>
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <strong>Live Updates:</strong> All changes appear instantly across all devices • Actions refresh data automatically
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;