import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      stations: {
        Row: {
          id: number;
          name: string;
          department_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          department_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          department_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          department_id: string | null;
          appointment_type: string | null;
          priority: 'Regular' | 'Priority' | 'Emergency';
          notes: string | null;
          scan_time: string | null;
          checked_in_at: string;
          status: 'waiting' | 'called' | 'in-progress' | 'completed';
          station_id: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          department_id?: string | null;
          appointment_type?: string | null;
          priority?: 'Regular' | 'Priority' | 'Emergency';
          notes?: string | null;
          scan_time?: string | null;
          checked_in_at?: string;
          status?: 'waiting' | 'called' | 'in-progress' | 'completed';
          station_id?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          department_id?: string | null;
          appointment_type?: string | null;
          priority?: 'Regular' | 'Priority' | 'Emergency';
          notes?: string | null;
          scan_time?: string | null;
          checked_in_at?: string;
          status?: 'waiting' | 'called' | 'in-progress' | 'completed';
          station_id?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recent_calls: {
        Row: {
          id: string;
          patient_id: string;
          called_at: string;
          called_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          called_at?: string;
          called_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          called_at?: string;
          called_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      patient_queue: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          appointment_type: string | null;
          priority: 'Regular' | 'Priority' | 'Emergency';
          notes: string | null;
          scan_time: string | null;
          checked_in_at: string;
          status: 'waiting' | 'called' | 'in-progress' | 'completed';
          station_id: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          department_name: string | null;
          station_name: string | null;
        };
      };
    };
  };
}
