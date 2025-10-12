import React, { useState, useEffect } from 'react';
import { Monitor, Users, Building2, Settings, Wifi, WifiOff, Clock, RefreshCw, Eye, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import LobbyDisplay from './components/LobbyDisplay';
import DepartmentView from './components/DepartmentView';
import { Patient, Department, NewPatient } from './types';
import { usePatients } from './hooks/usePatients';
import { useRecentCalls } from './hooks/useRecentCalls';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'lobby' | 'department'>('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  
  // Use database hooks
  const { 
    patients, 
    departments, 
    loading: patientsLoading, 
    error: patientsError,
    addPatient,
    updatePatientStatus,
    removePatient,
    assignPatientToStation,
    markStationComplete,
    markPatientCompleted,
    completeAllPatients,
    transferPatients
  } = usePatients();
  
  const { 
    recentCalls, 
    loading: callsLoading, 
    error: callsError,
    addRecentCall
  } = useRecentCalls();

  // Enhanced update patient status with recent calls tracking
  const handleUpdatePatientStatus = async (patientId: string, status: Patient['status']) => {
    try {
      await updatePatientStatus(patientId, status);
      
      // Add to recent calls if patient is being called
      if (status === 'called') {
        await addRecentCall(patientId);
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'lobby':
        return (
          <LobbyDisplay 
            patients={patients}
            onBack={() => setCurrentView('dashboard')}
            onUpdatePatient={handleUpdatePatientStatus}
            onFreeStation={async (patientId) => {
              try {
                await markStationComplete(patientId);
              } catch (e) {
                console.error(e);
              }
            }}
            onMarkCompleted={async (patientId) => {
              try {
                await markPatientCompleted(patientId);
              } catch (e) {
                console.error(e);
              }
            }}
          />
        );
      case 'department':
        return (
          <DepartmentView
            departmentId={selectedDepartment}
            departmentName={departments.find(d => d.id === selectedDepartment)?.name || ''}
            patients={patients.filter(p => {
              const department = departments.find(d => d.id === selectedDepartment);
              return department && p.department === department.name && (p.status === 'called' || p.status === 'in-progress');
            })}
            departments={departments}
            onBack={() => setCurrentView('dashboard')}
            onUpdatePatient={handleUpdatePatientStatus}
            onRemovePatient={removePatient}
            onCompleteAllPatients={completeAllPatients}
            onTransferPatients={transferPatients}
          />
        );
      default:
        return (
          <MainDashboard
            patients={patients}
            recentCalls={recentCalls}
            departments={departments}
            onAddPatient={addPatient}
            onUpdatePatient={handleUpdatePatientStatus}
            onAssignPatientToStation={assignPatientToStation}
            onFreeStation={async (patientId) => {
              try {
                await markStationComplete(patientId);
              } catch (e) {
                console.error(e);
              }
            }}
            onMarkCompleted={async (patientId) => {
              try {
                await markPatientCompleted(patientId);
              } catch (e) {
                console.error(e);
              }
            }}
            onViewDepartment={(deptId) => {
              setSelectedDepartment(deptId);
              setCurrentView('department');
            }}
          />
        );
    }
  };

  // Show loading state
  if (patientsLoading || callsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-brand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (patientsError || callsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-brand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">
            {patientsError || callsError}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-brand-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        isOnline={isOnline}
        departments={departments}
        onDepartmentSelect={(deptId) => {
          setSelectedDepartment(deptId);
          setCurrentView('department');
        }}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;