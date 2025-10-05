import React, { useMemo, useRef, useState } from 'react';
import { Patient, Department, NewPatient } from '../types';
import Waitlist from './Waitlist';
import StationAssignment from './StationAssignment';
import AssignStationPopup from './AssignStationPopup';
import RecentCalls from './RecentCalls';
import { Plus, Users, Clock, Activity, UserSearch, Filter } from 'lucide-react';
import ActivePatients from './ActivePatients';
import CompletedPatients from './CompletedPatients';
import AddPatientModal from './AddPatientModal';

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
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | Patient['status']>('all');
const [showAddPatientModal, setShowAddPatientModal] = useState(false);
const [assignPatientId, setAssignPatientId] = useState<string | null>(null);

	const waitingCount = useMemo(() => patients.filter(p => p.status === 'waiting').length, [patients]);
	const inProgressCount = useMemo(() => patients.filter(p => p.status === 'in-progress' || p.status === 'called').length, [patients]);
	const completedCount = useMemo(() => patients.filter(p => p.status === 'completed').length, [patients]);

	const avgWaitMins = useMemo(() => {
		const waiting = patients.filter(p => p.status === 'waiting');
		if (waiting.length === 0) return 0;
		const now = Date.now();
		const totalMs = waiting.reduce((acc, p) => acc + (now - new Date(p.checkedInAt).getTime()), 0);
		return Math.round(totalMs / waiting.length / 60000);
	}, [patients]);

	const filteredWaiting = useMemo(() => {
		return patients
			.filter(p => p.status === 'waiting')
			.filter(p => (statusFilter === 'all' ? true : p.status === statusFilter))
			.filter(p => {
				const q = search.toLowerCase();
				return p.name.toLowerCase().includes(q);
			});
	}, [patients, search, statusFilter]);

	const filteredActive = useMemo(() => {
		return patients
			.filter(p => p.status === 'in-progress' || p.status === 'called')
			.filter(p => (statusFilter === 'all' ? true : p.status === statusFilter))
			.filter(p => {
				const q = search.toLowerCase();
				return p.name.toLowerCase().includes(q);
			});
	}, [patients, search, statusFilter]);

	const filteredCompleted = useMemo(() => {
		return patients
			.filter(p => p.status === 'completed')
			.filter(p => (statusFilter === 'all' ? true : p.status === statusFilter))
			.filter(p => {
				const q = search.toLowerCase();
				return p.name.toLowerCase().includes(q);
			});
	}, [patients, search, statusFilter]);

	return (
		<div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
			{/* Stats */}
			<div className="flex items-center justify-between">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 flex-1">
					<div className="card p-3 sm:p-4">
						<p className="text-xs text-gray-500">Total Patients</p>
						<p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-700">{patients.length}</p>
					</div>
					<div className="card p-3 sm:p-4">
						<p className="text-xs text-gray-500">Waiting</p>
						<p className="text-lg sm:text-xl md:text-2xl font-bold">{waitingCount}</p>
					</div>
					<div className="card p-3 sm:p-4">
						<p className="text-xs text-gray-500">In Progress</p>
						<p className="text-lg sm:text-xl md:text-2xl font-bold">{inProgressCount}</p>
					</div>
					<div className="card p-3 sm:p-4">
						<p className="text-xs text-gray-500">Avg Wait Time</p>
						<p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-600">{avgWaitMins}min</p>
					</div>
				</div>
			</div>

			{/* Add Patient Button Row */}
			<div className="flex justify-start">
				<button
					className="btn-primary text-sm sm:text-base"
					onClick={() => setShowAddPatientModal(true)}
				>
					<Plus className="w-4 h-4" />
					<span className="hidden xs:inline">Register New Patient</span>
					<span className="xs:hidden">Add Patient</span>
				</button>
			</div>

			{/* Toolbar */}
			<div className="card p-3 sm:p-4">
				<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
					<div className="relative flex-1">
						<UserSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by patient name..."
							className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm sm:text-base"
						/>
					</div>
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
						<div className="relative">
							<Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value as any)}
								className="w-full sm:w-auto pl-9 pr-8 py-2 rounded-md border border-gray-300 bg-white text-sm sm:text-base"
							>
								<option value="all">All Status</option>
								<option value="waiting">Waiting</option>
								<option value="in-progress">In Progress</option>
								<option value="completed">Completed</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - full width stacked sections */}
			<div className="space-y-6">
				<Waitlist 
					patients={filteredWaiting}
					onUpdatePatient={onUpdatePatient}
					onAssignStation={(pid) => setAssignPatientId(pid)}
				/>
				<ActivePatients 
					patients={filteredActive}
					onUpdatePatient={onUpdatePatient}
					query={search}
				/>
				<CompletedPatients 
					patients={filteredCompleted}
					query={search}
				/>
				{/* Station Assignment visible */}
				<StationAssignment patients={patients} departments={departments} onViewDepartment={onViewDepartment} />

				{/* Recent calls moved to end */}
				<RecentCalls 
					recentCalls={recentCalls} 
					allPatients={patients}
					onUpdatePatient={onUpdatePatient}
				/>
			</div>

			{/* Add Patient Modal */}
			<AddPatientModal
				isOpen={showAddPatientModal}
				onClose={() => setShowAddPatientModal(false)}
				departments={departments}
				onAddPatient={onAddPatient}
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