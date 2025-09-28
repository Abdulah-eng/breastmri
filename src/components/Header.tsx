import React, { useState } from 'react';
import { Monitor, Users, Building2, Settings, Wifi, WifiOff, Clock, RefreshCw, ChevronDown } from 'lucide-react';
import { Department } from '../types';

interface HeaderProps {
  currentView: 'dashboard' | 'lobby' | 'department';
  onViewChange: (view: 'dashboard' | 'lobby' | 'department') => void;
  isOnline: boolean;
  departments: Department[];
  onDepartmentSelect: (deptId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  isOnline, 
  departments,
  onDepartmentSelect 
}) => {
  const [showDepartments, setShowDepartments] = useState(false);
  
  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
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
    <>
      {/* Main Header with Logo and Title */}
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <img 
              src="/image1.png" 
              alt="Northgate Open MRI" 
              className="w-32 h-32 object-contain"
            />
            
            {/* Title Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Northgate Open MRI Intake</h1>
              <p className="text-gray-600 mt-1">Live queue management system • Updates automatically</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {/* Navigation */}
              <div className="flex items-center space-x-1">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Monitor className="w-4 h-4 inline mr-2" />
                Main Dashboard
              </button>
              
              <button
                onClick={() => onViewChange('lobby')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'lobby' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Lobby Display
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowDepartments(!showDepartments)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    currentView === 'department' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Departments
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {showDepartments && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      {departments.map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() => {
                            onDepartmentSelect(dept.id);
                            setShowDepartments(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {dept.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Live System</span>
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">Auto-Updates</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600">Offline</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-mono">{currentTime}</span>
            </div>
            
            <div className={`px-2 py-1 rounded-full text-xs ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;