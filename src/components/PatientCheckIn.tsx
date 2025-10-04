import React, { useState } from 'react';
import { UserPlus, Clock } from 'lucide-react';
import { Patient, Department, NewPatient } from '../types';

interface PatientCheckInProps {
    departments: Department[];
    onAddPatient: (patient: NewPatient) => void;
    noCard?: boolean;
}

const PatientCheckIn: React.FC<PatientCheckInProps> = ({ departments, onAddPatient, noCard }) => {
	const [patientName, setPatientName] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [scanTime, setScanTime] = useState('');
    const [phone, setPhone] = useState('');
    const [appointmentType, setAppointmentType] = useState('');
    const [priority, setPriority] = useState<'Regular' | 'Priority' | 'Emergency'>('Regular');
    const [notes, setNotes] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
        if (patientName.trim() && selectedDepartment) {
			onAddPatient({
				name: patientName.trim(),
				department: selectedDepartment,
                scanTime: scanTime || undefined,
                phone: phone || undefined,
                appointmentType: appointmentType || undefined,
                priority,
                notes: notes || undefined
			});
			setPatientName('');
			setSelectedDepartment('');
			setScanTime('');
            setPhone('');
            setAppointmentType('');
            setPriority('Regular');
            setNotes('');
		}
	};

    const content = (
            <div className="p-4 sm:p-6">
				<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
					<UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
					<h2 className="text-base sm:text-lg font-semibold">Patient Check-In</h2>
				</div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="patientName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Patient Name
                            </label>
                            <input
                                type="text"
                                id="patientName"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Enter patient name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90 text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90 text-sm sm:text-base"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="department" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Appointment Type
                            </label>
                            <select
                                id="appointmentType"
                                value={appointmentType}
                                onChange={(e) => setAppointmentType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90 text-sm sm:text-base"
                                required
                            >
                                <option value="">Select appointment type</option>
                                <option value="MRI Scan">MRI Scan</option>
                                <option value="Mammography">Mammography</option>
                                <option value="CT Scan">CT Scan</option>
                                <option value="Ultrasound">Ultrasound</option>
                                <option value="X-Ray">X-Ray</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="department" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Department
                            </label>
                            <select
                                id="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90 text-sm sm:text-base"
                                required
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priority Level
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90 text-sm sm:text-base"
                            >
                                <option value="Regular">Regular</option>
                                <option value="Priority">Priority</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="scanTime" className="block text-sm font-medium text-gray-700 mb-2">
                                Scan Time (Optional)
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="time"
                                    id="scanTime"
                                    value={scanTime}
                                    onChange={(e) => setScanTime(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white/90"
                            placeholder="Additional notes or special instructions"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            type="submit"
                            className="btn-primary font-medium text-sm sm:text-base flex-1"
                        >
                            Check In Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPatientName('');
                                setSelectedDepartment('');
                                setScanTime('');
                                setPhone('');
                                setAppointmentType('');
                                setPriority('Regular');
                                setNotes('');
                            }}
                            className="btn-secondary text-sm sm:text-base flex-1 sm:flex-none"
                        >
                            Cancel
                        </button>
                    </div>
				</form>
			</div>
    );
    return noCard ? content : <div className="card">{content}</div>;
};

export default PatientCheckIn;