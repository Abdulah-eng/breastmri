import React from 'react';
import { Users, RefreshCw, PhoneCall, Clock } from 'lucide-react';
import { Patient } from '../types';

interface WaitlistProps {
	patients: Patient[];
	onUpdatePatient?: (patientId: string, status: Patient['status']) => void;
}

const Waitlist: React.FC<WaitlistProps> = ({ patients, onUpdatePatient }) => {
	return (
		<div className="card">
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<Users className="w-5 h-5 text-brand-600" />
						<h2 className="text-lg font-semibold">Waitlist</h2>
					</div>
					<div className="flex items-center gap-3 text-sm text-gray-600">
						<span>{patients.length} waiting</span>
						<RefreshCw className="w-4 h-4 text-gray-400" />
					</div>
				</div>

				<div className="min-h-[200px]">
					{patients.length === 0 ? (
						<div className="text-center text-gray-500">
							<Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p className="text-lg font-medium">No patients waiting</p>
							<p className="text-sm">Newly checked-in patients will appear here</p>
						</div>
					) : (
						<div className="grid sm:grid-cols-2 gap-4">
							{patients.map((patient, index) => (
								<div key={patient.id} className="p-4 rounded-lg bg-white/70 border border-gray-200 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="font-semibold text-gray-900">{patient.name}</p>
											<p className="text-sm text-gray-600">{patient.department}</p>
											{patient.scanTime && (
												<p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {patient.scanTime}</p>
											)}
										</div>
										<div className="text-right text-sm text-gray-500">
											{new Date(patient.checkedInAt).toLocaleTimeString([], { 
												hour: '2-digit', 
												minute: '2-digit' 
											})}
										</div>
									</div>
									<div className="mt-3">
										<button
											onClick={() => onUpdatePatient && onUpdatePatient(patient.id, 'called')}
											className="w-full btn-primary"
										>
											<PhoneCall className="w-4 h-4" />
											<span>Mark as Called</span>
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Waitlist;