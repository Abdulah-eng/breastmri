export interface Patient {
  id: string;
  name: string;
  department: string; // This will be the department name for display
  
  notes?: string;
  scanTime?: string;
  checkedInAt: string;
  status: 'waiting' | 'called' | 'in-progress' | 'completed';
  station?: number;
  completedAt?: string;
}

// Interface for adding new patients (accepts department ID)
export interface NewPatient {
  name: string;
  department: string; // This will be the department ID from the form
  notes?: string;
  scanTime?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface Station {
  id: number;
  name: string;
  departmentId?: string;
  isActive?: boolean;
}