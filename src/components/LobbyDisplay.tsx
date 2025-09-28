import React from 'react';
import { ArrowLeft, Monitor, RefreshCw, Wifi, Clock } from 'lucide-react';
import { Patient } from '../types';

interface LobbyDisplayProps {
  patients: Patient[];
  onBack: () => void;
}

const LobbyDisplay: React.FC<LobbyDisplayProps> = ({ patients, onBack }) => {
  const activePatients = patients.filter(p => p.status === 'in-progress' || p.status === 'called');
  const completedPatients = patients.filter(p => p.status === 'completed');

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
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
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <Monitor className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Lobby Display</h1>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Live</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{currentTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{currentTime}</div>
                <div className="text-sm text-gray-600">{getDate()}</div>
              </div>
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Refresh</span>
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
            Welcome to Northgate Open MRI / McAllen Breast Imaging
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Now Serving Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Now Serving</h1>
            <div className="flex items-center justify-center space-x-6">
              <span className="text-lg">No Current Patients</span>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-500 rounded-full text-sm">
                  {activePatients.length} Active
                </span>
                <span className="px-3 py-1 bg-green-500 rounded-full text-sm">
                  {completedPatients.length} Completed
                </span>
              </div>
            </div>
          </div>

          {/* Patient Display Area */}
          <div className="p-12">
            {activePatients.length === 0 ? (
              <div className="text-center py-16">
                <Monitor className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  No patients currently being served
                </h3>
                <p className="text-gray-500 text-lg">
                  Patients will appear here when called to stations
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {activePatients.map((patient) => (
                  <div key={patient.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>
                        <p className="text-lg text-gray-600">{patient.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          Station {patient.station || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Called at {new Date(patient.checkedInAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Live Updates</span>
            <span className="text-gray-400">•</span>
            <span>Real-time Display</span>
            <span className="text-gray-400">•</span>
            <span>Stable Connection</span>
            <span className="text-gray-400">•</span>
            <span>No Refresh Glitches</span>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-amber-800 font-medium">
              Live Patient Display System • Ultra-Stable Updates • Up to 4 Active Patients
            </span>
          </div>
          <div className="text-center text-sm text-amber-700 mt-2">
            Shows patients currently being served • Updates smoothly via real-time connection • Zero refresh glitches
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Primary Patient</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Secondary Patient</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Third Patient</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Fourth Patient</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-2 text-sm">
            <span>🟢 Stable Display Mode Active</span>
            <span>🔄 Hash: □</span>
            <span>📋 Patients: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyDisplay;