import React from 'react';
import { ArrowLeft, Monitor, RefreshCw, Wifi, PhoneCall } from 'lucide-react';
import { Patient } from '../types';

interface LobbyDisplayProps {
	patients: Patient[];
	onBack: () => void;
	onUpdatePatient?: (patientId: string, status: Patient['status']) => void;
}

const LobbyDisplay: React.FC<LobbyDisplayProps> = ({ patients, onBack, onUpdatePatient }) => {
	const waitingPatients = patients.filter(p => p.status === 'waiting');
	const activePatients = patients.filter(p => p.status === 'in-progress' || p.status === 'called');
	const completedPatients = patients.filter(p => p.status === 'completed');

	const getCurrentTime = () => {
		return new Date().toLocaleString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			second: '2-digit',
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
								<h1 className="font-semibold text-sm sm:text-base">Lobby</h1>
							</div>
						</div>
						<div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
							<Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
							<span className="hidden xs:inline">Live</span>
							<span className="opacity-50 hidden xs:inline">•</span>
							<span className="font-mono text-xs sm:text-sm">{currentTime}</span>
							<RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 opacity-60" />
						</div>
					</div>
				</div>
			</div>


			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
				<div className="card overflow-hidden text-center">
					<div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 sm:p-6 md:p-8">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Patient Queue</h1>
						<div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
							<span className="px-2 sm:px-3 py-1 rounded-full bg-white/20">{waitingPatients.length} Waiting</span>
							<span className="px-2 sm:px-3 py-1 rounded-full bg-white/20">{activePatients.length} Active</span>
							<span className="px-2 sm:px-3 py-1 rounded-full bg-white/20">{completedPatients.length} Completed</span>
						</div>
					</div>

					<div className="p-4 sm:p-6 md:p-8 lg:p-12">
						{/* Waiting Patients Section */}
						{waitingPatients.length > 0 && (
							<div className="mb-6 sm:mb-8">
								<h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Waiting Patients</h2>
								<div className="grid gap-3 sm:gap-4 text-left">
									{waitingPatients.map((patient, index) => (
										<div key={patient.id} className="card p-4 sm:p-6 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
												<div className="flex-1">
													<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{patient.name}</h3>
													<p className="text-sm text-gray-600">{patient.department}</p>
													<p className="text-xs text-gray-500">Checked in at {new Date(patient.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
												</div>
												<div className="flex flex-col sm:items-end gap-2 sm:gap-3">
													<div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium">
														Waiting
													</div>
													{onUpdatePatient && (
														<button
															onClick={() => onUpdatePatient(patient.id, 'called')}
															className="btn-primary text-xs sm:text-sm w-full sm:w-auto"
														>
															<PhoneCall className="w-3 h-3 sm:w-4 sm:h-4" />
															<span>Mark as Called</span>
														</button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Active Patients Section */}
						{activePatients.length > 0 && (
							<div className="mb-6 sm:mb-8">
								<h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Currently Being Served</h2>
								<div className="grid gap-3 sm:gap-4 text-left">
									{activePatients.map((patient, index) => (
										<div key={patient.id} className="card p-4 sm:p-6 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
												<div className="flex-1">
													<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{patient.name}</h3>
													<p className="text-sm text-gray-600">{patient.department}</p>
													<p className="text-xs text-gray-500">
														Called at {new Date(patient.checkedInAt).toLocaleTimeString([], { 
															hour: '2-digit', 
															minute: '2-digit' 
														})}
													</p>
												</div>
												<div className="flex flex-col sm:items-end gap-2 sm:gap-3">
													<div className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs sm:text-sm font-medium">
														In Progress
													</div>
													<div className="text-sm sm:text-base font-semibold text-brand-600">
														Station {patient.station || 'N/A'}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* No Patients Message */}
						{waitingPatients.length === 0 && activePatients.length === 0 && (
							<div className="text-center py-16 text-gray-500">
								<Monitor className="w-24 h-24 mx-auto mb-6 opacity-30" />
								<h3 className="text-2xl font-semibold mb-4">No patients in queue</h3>
								<p>Patients will appear here when they check in</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LobbyDisplay;