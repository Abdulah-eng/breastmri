import React, { useMemo, useRef, useState } from 'react';
import { Patient, Department, NewPatient } from '../types';
import Waitlist from './Waitlist';
import StationAssignment from './StationAssignment';
import AssignStationPopup from './AssignStationPopup';
import PatientCheckIn from './PatientCheckIn';
import RecentCalls from './RecentCalls';

interface MainDashboardProps {
	patients: Patient[];
	recentCalls: Patient[];
	departments: Department[];
	onAddPatient: (patient: NewPatient) => void;
	onUpdatePatient: (patientId: string, status: Patient['status']) => void;
	onViewDepartment: (departmentId: string) => void;
    onAssignPatientToStation?: (patientId: string, stationId: number) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
	patients,
	recentCalls,
	departments,
	onAddPatient,
	onUpdatePatient,
	onViewDepartment,
	onAssignPatientToStation
}) => {
	const [assignPatientId, setAssignPatientId] = useState<string | null>(null);

	const waitingPatients = useMemo(() => patients.filter(p => p.status === 'waiting'), [patients]);

	return (
		<div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
			{/* Top Row: Patient Check-In and Waitlist side by side */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				{/* Patient Check-In Form */}
				<div className="card">
					<PatientCheckIn 
						departments={departments} 
						onAddPatient={onAddPatient}
					/>
				</div>

				{/* Waitlist */}
				<Waitlist 
					patients={waitingPatients}
					onUpdatePatient={onUpdatePatient}
					onAssignStation={(pid) => setAssignPatientId(pid)}
				/>
			</div>

			{/* Station Assignment - Full Width */}
			<StationAssignment 
				patients={patients} 
				departments={departments} 
				onViewDepartment={onViewDepartment} 
			/>

			{/* Recent Calls */}
			<RecentCalls 
				recentCalls={recentCalls} 
				allPatients={patients}
				onUpdatePatient={onUpdatePatient}
			/>

			{/* Assign Station Modal */}
			<AssignStationPopup
				isOpen={!!assignPatientId}
				onClose={() => setAssignPatientId(null)}
				onAssign={(stationId) => {
					if (assignPatientId && onAssignPatientToStation) {
						onAssignPatientToStation(assignPatientId, stationId);
						setAssignPatientId(null);
					}
				}}
				patients={patients}
			/>
		</div>
	);
};

export default MainDashboard;