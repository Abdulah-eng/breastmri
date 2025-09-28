import React, { useState, useEffect } from 'react';
import { Monitor, Users, Building2, Settings, Wifi, WifiOff, Clock, RefreshCw, Eye, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import LobbyDisplay from './components/LobbyDisplay';
import DepartmentView from './components/DepartmentView';
import { Patient, Department } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'lobby' | 'department'>('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentCalls, setRecentCalls] = useState<Patient[]>([]);
  
  const departments: Department[] = [
    { id: 'velocity1', name: 'Velocity 1' },
    { id: 'velocity2', name: 'Velocity 2' },
    { id: 'tbi', name: 'TBI' },
    { id: 'ct', name: 'CT' },
    { id: 'ultrasound', name: 'Ultrasound' },
    { id: 'xray', name: 'X-Ray' },
    { id: 'mammo', name: 'Mammo' }
  ];

  const addPatient = (patientData: Omit<Patient, 'id' | 'checkedInAt' | 'status'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      checkedInAt: new Date().toISOString(),
      status: 'waiting'
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatientStatus = (patientId: string, status: Patient['status']) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined }
          : patient
      )
    );

    if (status === 'called') {
      const calledPatient = patients.find(p => p.id === patientId);
      if (calledPatient) {
        setRecentCalls(prev => [{ ...calledPatient, status }, ...prev].slice(0, 10));
      }
    }
  };

  const removePatient = (patientId: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'lobby':
        return (
          <LobbyDisplay 
            patients={patients}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'department':
        return (
          <DepartmentView
            departmentId={selectedDepartment}
            departmentName={departments.find(d => d.id === selectedDepartment)?.name || ''}
            patients={patients.filter(p => p.department === selectedDepartment)}
            onBack={() => setCurrentView('dashboard')}
            onUpdatePatient={updatePatientStatus}
            onRemovePatient={removePatient}
          />
        );
      default:
        return (
          <MainDashboard
            patients={patients}
            recentCalls={recentCalls}
            departments={departments}
            onAddPatient={addPatient}
            onUpdatePatient={updatePatientStatus}
            onViewDepartment={(deptId) => {
              setSelectedDepartment(deptId);
              setCurrentView('department');
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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