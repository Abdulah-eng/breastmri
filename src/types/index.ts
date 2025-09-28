export interface Patient {
  id: string;
  name: string;
  department: string;
  scanTime?: string;
  checkedInAt: string;
  status: 'waiting' | 'called' | 'in-progress' | 'completed';
  station?: number;
  completedAt?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Station {
  id: number;
  patientId?: string;
}