-- Fix existing patients with null department_id
-- Run this in your Supabase SQL editor to fix "Unknown Department" issue

-- First, let's see what patients have null department_id
SELECT id, name, department_id FROM patients WHERE department_id IS NULL;

-- Assign all patients with null department_id to 'Velocity 1' department
UPDATE patients 
SET department_id = '550e8400-e29b-41d4-a716-446655440001'  -- Velocity 1
WHERE department_id IS NULL;

-- Verify the fix
SELECT p.id, p.name, p.department_id, d.name as department_name 
FROM patients p 
LEFT JOIN departments d ON p.department_id = d.id 
WHERE p.department_id = '550e8400-e29b-41d4-a716-446655440001';
