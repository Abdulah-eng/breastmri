-- Patient Queue System Database Schema
-- Run this in your Supabase SQL editor

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    appointment_type VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'Regular' CHECK (priority IN ('Regular', 'Priority', 'Emergency')),
    notes TEXT,
    scan_time TIME,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in-progress', 'completed')),
    station_id INTEGER REFERENCES stations(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recent_calls table for tracking patient call history
CREATE TABLE IF NOT EXISTS recent_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    called_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_department ON patients(department_id);
CREATE INDEX IF NOT EXISTS idx_patients_checked_in ON patients(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_patients_priority ON patients(priority);
CREATE INDEX IF NOT EXISTS idx_recent_calls_patient ON recent_calls(patient_id);
CREATE INDEX IF NOT EXISTS idx_recent_calls_called_at ON recent_calls(called_at);

-- Insert default departments
INSERT INTO departments (id, name, description) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Velocity 1', 'High-speed MRI imaging'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Velocity 2', 'Secondary high-speed MRI'),
    ('550e8400-e29b-41d4-a716-446655440003', 'TBI', 'Traumatic Brain Injury imaging'),
    ('550e8400-e29b-41d4-a716-446655440004', 'CT', 'Computed Tomography'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Ultrasound', 'Ultrasound imaging'),
    ('550e8400-e29b-41d4-a716-446655440006', 'X-Ray', 'X-Ray imaging'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Mammo', 'Mammography')
ON CONFLICT (id) DO NOTHING;

-- Insert default stations
INSERT INTO stations (id, name, department_id) VALUES 
    (1, 'Station 1', '550e8400-e29b-41d4-a716-446655440001'),
    (2, 'Station 2', '550e8400-e29b-41d4-a716-446655440001'),
    (3, 'Station 3', '550e8400-e29b-41d4-a716-446655440002'),
    (4, 'Station 4', '550e8400-e29b-41d4-a716-446655440002'),
    (5, 'Station 5', '550e8400-e29b-41d4-a716-446655440003'),
    (6, 'Station 6', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: Row Level Security is disabled for public access
-- If you need security later, you can enable RLS and create appropriate policies

-- Create a view for patient queue with department and station info
CREATE OR REPLACE VIEW patient_queue AS
SELECT 
    p.id,
    p.name,
    p.phone,
    p.appointment_type,
    p.priority,
    p.notes,
    p.scan_time,
    p.checked_in_at,
    p.status,
    p.station_id,
    p.completed_at,
    p.created_at,
    p.updated_at,
    d.name as department_name,
    s.name as station_name
FROM patients p
LEFT JOIN departments d ON p.department_id = d.id
LEFT JOIN stations s ON p.station_id = s.id
ORDER BY 
    CASE p.priority 
        WHEN 'Emergency' THEN 1 
        WHEN 'Priority' THEN 2 
        ELSE 3 
    END,
    p.checked_in_at ASC;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
