import React, { useState } from 'react';
import { Users, RefreshCw, Clock, Monitor, Edit2, Check, X } from 'lucide-react';
import { Patient } from '../types';

interface WaitlistProps {
	patients: Patient[];
	onUpdatePatient?: (patientId: string, status: Patient['status']) => void;
	onAssignStation?: (patientId: string) => void;
	onUpdatePatientName?: (patientId: string, newName: string) => void;
}

const Waitlist: React.FC<WaitlistProps> = ({ patients, onUpdatePatient, onAssignStation, onUpdatePatientName }) => {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
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
							{patients.map((patient, index) => {
								const isEditing = editingId === patient.id;
								
								const handleEdit = () => {
									setEditingId(patient.id);
									setEditName(patient.name);
								};

								const handleSave = async () => {
									if (onUpdatePatientName && editName.trim()) {
										try {
											await onUpdatePatientName(patient.id, editName.trim());
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
									<div key={patient.id} className="p-4 rounded-lg bg-white/70 border border-gray-200 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1">
												{isEditing ? (
													<div className="flex items-center gap-2">
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
													<div className="flex items-center gap-2">
														<p className="font-semibold text-gray-900">{patient.name}</p>
														{onUpdatePatientName && (
															<button
																onClick={handleEdit}
																className="p-1 text-gray-400 hover:text-brand-600 hover:bg-gray-100 rounded"
																title="Edit name"
															>
																<Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
															</button>
														)}
													</div>
												)}
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
												onClick={() => onAssignStation && onAssignStation(patient.id)}
												className="w-full btn-secondary"
											>
												<Monitor className="w-4 h-4" />
												<span>Assign Station</span>
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Waitlist;