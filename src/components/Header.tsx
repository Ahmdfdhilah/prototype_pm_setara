import {
    Menu,
    Sun,
    Moon,
    UserCircle,
    ChevronDown
} from 'lucide-react';
import LogoLightMode from '../assets/logo_abi_lightmode.png';
import LogoDarkMode from '../assets/logo_abi_darkmode.png';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    isDarkMode: boolean;
    setIsDarkMode: (mode: boolean) => void;
    currentRole: string;
    setCurrentRole: (role: string) => void;
    currentSystem: string;
}

const Header: React.FC<HeaderProps> = ({ 
    isSidebarOpen, 
    setIsSidebarOpen, 
    isDarkMode, 
    setIsDarkMode,
    currentRole,
    setCurrentRole,
    currentSystem
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const roles = [
        { id: 'admin', label: 'Admin' },
        { id: 'employee', label: 'Employee' },
        { id: 'approver', label: 'Approver' },
        { id: 'sm_dept', label: 'SM Department' }
    ];

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const RoleSelector = ({ isMobile = false }) => (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-2 rounded-md border border-gray-300 
                dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                ${isMobile ? 'px-2 py-1' : 'px-3 py-2'}`}
            >
                <UserCircle className="h-4 w-4" />
                <span className={`text-gray-700 dark:text-gray-200 ${isMobile ? 'text-sm' : ''}`}>
                    {roles.find(role => role.id === currentRole)?.label || 'Select Role'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 
                    ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg 
                    border border-gray-200 dark:border-gray-600 py-1 z-50">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            className={`w-full flex items-center space-x-2 px-4 py-2 text-left
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                ${currentRole === role.id ? 'bg-gray-50 dark:bg-gray-700' : ''}
                                text-gray-700 dark:text-gray-200`}
                            onClick={() => {
                                setCurrentRole(role.id);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <UserCircle className="h-4 w-4" />
                            <span>{role.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <header className="font-montserrat md:h-16 bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-30">
            <div className="px-4 py-4 md:h-full flex flex-col md:flex-row md:items-center justify-between">
                {/* Top section (Logo and Menu) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        
                        {/* Logo container */}
                        <div className="flex items-center">
                            <img
                                src={isDarkMode ? LogoDarkMode : LogoLightMode}
                                alt="Company Logo"
                                className="w-24 md:w-32"
                            />
                        </div>
                    </div>

                    {/* Theme toggle - mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="md:hidden"
                    >
                        {isDarkMode ?
                            <Sun className="h-5 w-5" /> :
                            <Moon className="h-5 w-5" />
                        }
                    </Button>
                </div>

                {/* Desktop controls */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* System name - desktop */}
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {currentSystem}
                        </span>
                    </div>
                    
                    {/* Desktop Role selector */}
                    <RoleSelector />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                        {isDarkMode ?
                            <Sun className="h-5 w-5" /> :
                            <Moon className="h-5 w-5" />
                        }
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;