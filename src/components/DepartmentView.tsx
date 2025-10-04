import React, { useState } from 'react';
import { ArrowLeft, Monitor, CheckCircle, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { Patient, Department } from '../types';
import TransferPopup from './TransferPopup';

interface DepartmentViewProps {
	departmentId: string;
	departmentName: string;
	patients: Patient[];
	departments: Department[];
	onBack: () => void;
	onUpdatePatient: (patientId: string, status: Patient['status']) => void;
	onRemovePatient: (patientId: string) => void;
	onCompleteAllPatients?: (patientIds: string[]) => void;
	onTransferPatients?: (patientIds: string[], targetDepartment: string) => void;
}

const DepartmentView: React.FC<DepartmentViewProps> = ({ 
	departmentId,
	departmentName, 
	patients,
	departments,
	onBack,
	onUpdatePatient,
	onRemovePatient,
	onCompleteAllPatients,
	onTransferPatients
}) => {
	const [showTransferPopup, setShowTransferPopup] = useState(false);
	const getCurrentTime = () => {
		return new Date().toLocaleString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
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

	// Handle completing all patients in this department
	const handleCompleteAll = () => {
		if (patients.length === 0) return;
		
		const patientIds = patients.map(p => p.id);
		if (onCompleteAllPatients) {
			onCompleteAllPatients(patientIds);
		} else {
			// Fallback: complete each patient individually
			patientIds.forEach(patientId => {
				onUpdatePatient(patientId, 'completed');
			});
		}
	};

	// Handle transferring all patients to another department
	const handleTransfer = () => {
		if (patients.length === 0) return;
		setShowTransferPopup(true);
	};

	const handleTransferConfirm = (targetDepartment: string) => {
		if (onTransferPatients) {
			const patientIds = patients.map(p => p.id);
			onTransferPatients(patientIds, targetDepartment);
		}
	};

	// Handle removing all patients from this department
	const handleRemoveAll = () => {
		if (patients.length === 0) return;
		
		const confirmRemove = window.confirm(`Are you sure you want to remove all ${patients.length} patients from ${departmentName}? This action cannot be undone.`);
		
		if (confirmRemove) {
			patients.forEach(patient => {
				onRemovePatient(patient.id);
			});
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-white to-brand-50">
			{/* Toolbar */}
			<div className="border-b border-gray-200 bg-white/90 backdrop-blur">
				<div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 sm:gap-3">
							<button onClick={onBack} className="btn-secondary text-sm">
								<ArrowLeft className="w-4 h-4" />
								<span className="hidden xs:inline">Back</span>
							</button>
							<div className="flex items-center gap-2 text-gray-700">
								<Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500" />
								<h1 className="font-semibold text-sm sm:text-base">{departmentName}</h1>
							</div>
						</div>
						<div className="text-xs sm:text-sm text-gray-600 font-mono">{currentTime}</div>
					</div>
				</div>
			</div>


			{/* Hero */}
			<div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
				<div className="card overflow-hidden text-center">
					<div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 sm:p-6 md:p-8">
						<h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Active Patients - {departmentName}</h2>
						<p className="mt-2 text-xs sm:text-sm">{patients.length} currently being served • Live</p>
					</div>

					{/* Patient Display Area */}
					<div className="p-4 sm:p-6 md:p-8 lg:p-12 text-left">
						{patients.length === 0 ? (
							<div className="text-center py-12 sm:py-16 text-gray-500">
								<Monitor className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 opacity-30" />
								<h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">No active patients in {departmentName}</h3>
								<p className="text-sm sm:text-base">Patients will appear here when they are called or assigned to this department</p>
							</div>
						) : (
							<div className="grid gap-3 sm:gap-4">
								{patients.map((patient, index) => (
									<div key={patient.id} className="card p-4 sm:p-6 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
											<div className="flex-1">
												<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{patient.name}</h3>
												<p className="text-sm text-gray-600">{patient.department}</p>
												<p className="text-xs text-gray-500">Checked in at {new Date(patient.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
											</div>
											<div className="flex flex-col sm:items-end gap-2 sm:gap-3">
												<span className={`px-3 py-1 rounded-full text-xs font-medium ${
													patient.status === 'waiting' 
														? 'bg-yellow-100 text-yellow-800' 
														: patient.status === 'in-progress' || patient.status === 'called'
														? 'bg-brand-100 text-brand-800'
														: 'bg-emerald-100 text-emerald-800'
												}`}> 
													{patient.status === 'waiting' ? 'Waiting' : 
													patient.status === 'in-progress' || patient.status === 'called' ? 'In Progress' : 'Completed'}
												</span>
												{(patient.status === 'called' || patient.status === 'in-progress') && (
													<button
														onClick={() => onUpdatePatient(patient.id, 'completed')}
														className="btn-primary text-xs sm:text-sm w-full sm:w-auto"
													>
														<CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
														<span>Mark as Completed</span>
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Department Actions */}
				<div className="mt-6 sm:mt-8 card">
					<div className="p-4 sm:p-6">
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Department Actions</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
							<button 
								onClick={handleCompleteAll}
								disabled={patients.length === 0}
								className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
							>
								<CheckCircle className="w-4 h-4" />
								<span className="hidden xs:inline">Complete {departmentName}</span>
								<span className="xs:hidden">Complete All</span>
							</button>
							<button 
								onClick={handleTransfer}
								disabled={patients.length === 0}
								className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
							>
								<ArrowRight className="w-4 h-4" />
								<span>Transfer</span>
							</button>
							<button 
								onClick={handleRemoveAll}
								disabled={patients.length === 0}
								className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:col-span-2 lg:col-span-1"
							>
								<X className="w-4 h-4" />
								<span className="hidden xs:inline">Done & Remove</span>
								<span className="xs:hidden">Remove All</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Transfer Popup */}
			<TransferPopup
				isOpen={showTransferPopup}
				onClose={() => setShowTransferPopup(false)}
				onTransfer={handleTransferConfirm}
				departments={departments}
				currentDepartment={departmentName}
				patientCount={patients.length}
			/>
		</div>
	);
};

export default DepartmentView;