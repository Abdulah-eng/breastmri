import React, { useState } from 'react';
import { PhoneCall, Eye, EyeOff } from 'lucide-react';
import { Patient } from '../types';

interface RecentCallsProps {
	recentCalls: Patient[];
	allPatients: Patient[];
	onUpdatePatient: (patientId: string, status: Patient['status']) => void;
}

const RecentCalls: React.FC<RecentCallsProps> = ({ recentCalls, allPatients, onUpdatePatient }) => {
	const [showCompleted, setShowCompleted] = useState(false);

	// Remove duplicates and get unique patients from recent calls
	const uniqueCalls = recentCalls.reduce((acc, current) => {
		const existingIndex = acc.findIndex(item => item.id === current.id);
		if (existingIndex === -1) {
			acc.push(current);
		}
		return acc;
	}, [] as Patient[]);

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
								.slice(0, 5)
								.map((call, index) => (
                                    <div key={call.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/70 border border-gray-200 animate-fade-in-up gap-2 sm:gap-3" style={{ animationDelay: `${index * 40}ms` }}>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm sm:text-base">{call.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">Station {call.station || 'N/A'}</p>
                                        </div>
										<div className="flex items-center gap-2 sm:gap-3">
											<span className={`px-2 py-1 rounded-full text-xs ${
												call.status === 'completed' 
													? 'bg-green-100 text-green-800' 
                                                    : 'bg-brand-100 text-brand-800'
											}` }>
                                                {call.status === 'completed' ? 'Completed' : 'In Progress'}
											</span>
										</div>
									</div>
								))}
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