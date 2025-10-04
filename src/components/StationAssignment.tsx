import React from 'react';
import { ArrowRight, Monitor } from 'lucide-react';
import { Patient, Department } from '../types';

interface StationAssignmentProps {
	patients: Patient[];
	departments: Department[];
	onViewDepartment: (departmentId: string) => void;
}

const StationAssignment: React.FC<StationAssignmentProps> = ({ 
	patients, 
	departments, 
	onViewDepartment 
}) => {
	const stations = Array.from({ length: 6 }, (_, i) => ({
		id: i + 1,
		patient: patients.find(p => p.station === i + 1)
	}));

	return (
		<div className="card">
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<ArrowRight className="w-5 h-5 text-brand-600" />
						<h2 className="text-lg font-semibold">Station Assignment</h2>
					</div>
					<span className="text-sm text-gray-600">0 in queue</span>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
					{stations.map((station, index) => (
						<div key={station.id} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
							<div className="rounded-lg p-6 mb-2 bg-white/70 border border-gray-200">
								<Monitor className="w-8 h-8 mx-auto mb-2 text-gray-400" />
								{station.patient ? (
									<div className="space-y-1">
										<p className="font-medium text-sm">{station.patient.name}</p>
										<p className="text-xs text-gray-600">{station.patient.department}</p>
									</div>
								) : (
									<p className="text-xs text-gray-500">Available</p>
								)}
							</div>
							<div className="space-y-1">
								<p className="text-xs text-gray-600">Station</p>
								<p className="font-semibold">{station.id}</p>
							</div>
						</div>
					))}
				</div>

				<div className="text-center text-gray-500">
					<Monitor className="w-16 h-16 mx-auto mb-3 opacity-50" />
					<p className="text-lg font-medium">No patients in queue</p>
				</div>

				{/* Quick Department Access */}
				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-sm font-medium mb-3">Quick Department Access:</p>
					<div className="flex flex-wrap gap-2">
						{departments.map((dept) => (
							<button
								key={dept.id}
								onClick={() => onViewDepartment(dept.id)}
								className="px-3 py-1 rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-200 transition-colors text-sm"
							>
								{dept.name}
								</button>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StationAssignment;