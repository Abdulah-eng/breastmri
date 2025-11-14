import React, { useState } from 'react';
import { PhoneCall, Eye, EyeOff, Edit2, Check, X } from 'lucide-react';
import { Patient } from '../types';

interface RecentCallsProps {
	recentCalls: Patient[];
	allPatients: Patient[];
	onUpdatePatient: (patientId: string, status: Patient['status']) => void;
	onFreeStation?: (patientId: string) => void;
	onMarkCompleted?: (patientId: string) => void;
	onUpdatePatientName?: (patientId: string, newName: string) => void;
}

const RecentCalls: React.FC<RecentCallsProps> = ({ recentCalls, allPatients, onUpdatePatient, onFreeStation, onMarkCompleted, onUpdatePatientName }) => {
	const [showCompleted, setShowCompleted] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');

	// Get patients with stations (active patients)
	const patientsWithStations = allPatients.filter(p => p.station != null && (p.status === 'called' || p.status === 'in-progress'));

	// Combine recent calls and patients with stations, removing duplicates
	const combinedCalls = [...recentCalls, ...patientsWithStations];
	const uniqueCalls = combinedCalls.reduce((acc, current) => {
		const existingIndex = acc.findIndex(item => item.id === current.id);
		if (existingIndex === -1) {
			acc.push(current);
		} else {
			// Keep the one with station if available
			if (current.station != null) {
				acc[existingIndex] = current;
			}
		}
		return acc;
	}, [] as Patient[]);

	// Sort by most recent (patients with stations first, then by checked in time)
	uniqueCalls.sort((a, b) => {
		if (a.station != null && b.station == null) return -1;
		if (a.station == null && b.station != null) return 1;
		return new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime();
	});

	// Calculate stats from all patients (more accurate)
	const activeCalls = allPatients.filter(p => p.status === 'called' || p.status === 'in-progress').length;
	const completedToday = allPatients.filter(p => p.status === 'completed').length;

	return (
		<div className="card">
			<div className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
					<div className="flex items-center gap-2 sm:gap-3">
						<PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
						<h2 className="text-base sm:text-lg font-semibold">Recent Calls</h2>
					</div>
					<div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
						<span>{activeCalls} active</span>
						<span>{completedToday} completed today</span>
						<button
							onClick={() => setShowCompleted(!showCompleted)}
							className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs sm:text-sm"
						>
							{showCompleted ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
							<span className="hidden xs:inline">Show Completed</span>
							<span className="xs:hidden">Completed</span>
						</button>
					</div>
				</div>

				<div className="min-h-[120px] sm:min-h-[150px] flex items-center justify-center">
					{uniqueCalls.length === 0 ? (
						<div className="text-center text-gray-500">
							<PhoneCall className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
							<p className="text-sm sm:text-lg font-medium">No patients called yet</p>
						</div>
					) : (
						<div className="w-full space-y-2">
							{uniqueCalls
								.filter(call => showCompleted || call.status !== 'completed')
								.slice(0, 10)
								.map((call, index) => {
									const isEditing = editingId === call.id;
									
									const handleEdit = () => {
										setEditingId(call.id);
										setEditName(call.name);
									};

									const handleSave = async () => {
										if (onUpdatePatientName && editName.trim()) {
											try {
												await onUpdatePatientName(call.id, editName.trim());
												setEditingId(null);
												setEditName('');
											} catch (error) {
												console.error('Error updating patient name:', error);
											}
										}
									};

									const handleCancel = () => {
										setEditingId(null);
										setEditName('');
									};

									return (
										<div key={call.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/70 border border-gray-200 animate-fade-in-up gap-2 sm:gap-3" style={{ animationDelay: `${index * 40}ms` }}>
											<div className="flex-1 flex items-center gap-2">
												{isEditing ? (
													<div className="flex-1 flex items-center gap-2">
														<input
															type="text"
															value={editName}
															onChange={(e) => setEditName(e.target.value)}
															onKeyDown={(e) => {
																if (e.key === 'Enter') handleSave();
																if (e.key === 'Escape') handleCancel();
															}}
															className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
															autoFocus
														/>
														<button
															onClick={handleSave}
															className="p-1 text-green-600 hover:bg-green-50 rounded"
															title="Save"
														>
															<Check className="w-4 h-4" />
														</button>
														<button
															onClick={handleCancel}
															className="p-1 text-red-600 hover:bg-red-50 rounded"
															title="Cancel"
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												) : (
													<>
														<p className="font-medium text-sm sm:text-base">{call.name}</p>
														{onUpdatePatientName && (
															<button
																onClick={handleEdit}
																className="p-1 text-gray-400 hover:text-brand-600 hover:bg-gray-100 rounded"
																title="Edit name"
															>
																<Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
															</button>
														)}
													</>
												)}
											</div>
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
												<p className="text-xs sm:text-sm text-gray-600">Station {call.station || 'N/A'}</p>
												<div className="flex items-center gap-2 sm:gap-3">
													<span className={`px-2 py-1 rounded-full text-xs ${
														call.status === 'completed' 
															? 'bg-green-100 text-green-800' 
															: 'bg-brand-100 text-brand-800'
													}` }>
														{call.status === 'completed' ? 'Completed' : 'In Progress'}
													</span>
													{call.status !== 'completed' && (
														<div className="flex gap-1">
															{onFreeStation && (
																<button
																	onClick={() => onFreeStation(call.id)}
																	className="btn-secondary text-xs px-2 py-1"
																>
																	Registered
																</button>
															)}
															{onMarkCompleted && (
																<button
																	onClick={() => onMarkCompleted(call.id)}
																	className="btn-primary text-xs px-2 py-1"
																>
																	Mark Completed
																</button>
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</div>

				<div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
					<div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
						<span><strong>Lobby Display:</strong> Shows only active patients (not completed)</span>
						<span><strong>Recent Calls:</strong> Keeps daily history of all patients</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecentCalls;