import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Users, Building2, Wifi, WifiOff, Clock, ChevronDown } from 'lucide-react';
import { Department } from '../types';

interface HeaderProps {
	currentView: 'dashboard' | 'lobby' | 'department';
	onViewChange: (view: 'dashboard' | 'lobby' | 'department') => void;
	isOnline: boolean;
	departments: Department[];
	onDepartmentSelect: (deptId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
	currentView, 
	onViewChange, 
	isOnline, 
	departments,
	onDepartmentSelect 
}) => {
	const [showDepartments, setShowDepartments] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDepartments(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	
	return (
		<header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
			<div className="px-3 sm:px-4 md:px-6">
			{/* Branding row: logos + title on the left, nav on the right */}
			<div className="flex items-center justify-between py-3 sm:py-4 md:py-5">
				{/* Left: Logos and Title */}
				<div className="flex items-center gap-2 sm:gap-3 md:gap-5">
					<img src="/image2.png" alt="McAllen Breast Imaging" className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto object-contain" />
					<img src="/image1.png" alt="Northgate Open MRI" className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 w-auto object-contain" />
					<div className="leading-tight hidden xs:block">
						<div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight text-gray-900">Patient Queue System</div>
						<div className="text-xs sm:text-sm text-gray-600">Medical Imaging & Breast Health Services</div>
					</div>
				</div>

				{/* Right: Nav */}
				<nav className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-2 sm:ml-4">
						<button
							onClick={() => onViewChange('dashboard')}
							className={`px-2 sm:px-3 md:px-4 lg:px-5 py-2 rounded-md text-xs sm:text-sm md:text-base font-medium ${currentView === 'dashboard' ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
						>
							<Monitor className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
							<span className="hidden sm:inline">Dashboard</span>
						</button>
						<button
							onClick={() => onViewChange('lobby')}
							className={`px-2 sm:px-3 md:px-4 lg:px-5 py-2 rounded-md text-xs sm:text-sm md:text-base font-medium ${currentView === 'lobby' ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
						>
							<Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
							<span className="hidden sm:inline">Lobby</span>
						</button>
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setShowDepartments(!showDepartments)}
								className={`px-2 sm:px-3 md:px-4 lg:px-5 py-2 rounded-md text-xs sm:text-sm md:text-base font-medium flex items-center ${currentView === 'department' ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
							>
								<Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Departments</span>
								<ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
							</button>
							{showDepartments && (
								<div className="absolute top-full right-0 sm:left-0 mt-1 w-56 sm:w-52 card z-50 shadow-lg">
									<div className="py-2 max-h-64 overflow-y-auto">
										{departments.map((dept) => (
											<button
												key={dept.id}
												onClick={() => {
													onDepartmentSelect(dept.id);
													setShowDepartments(false);
												}}
												className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											>
												{dept.name}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
				</nav>
			</div>
			</div>
		</header>
	);
};

export default Header;