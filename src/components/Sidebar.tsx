import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    User,
    UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    currentRole: string;
    setCurrentRole: (role: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ currentRole, setCurrentRole, isSidebarOpen, setIsSidebarOpen }) => {
    const roles = [
        { id: 'admin', label: 'Admin' },
        { id: 'employee', label: 'Employee' },
        { id: 'approver', label: 'Approver' },
        { id: 'sm_dept', label: 'SM Department' }
    ];
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login')
    };

    return (
        <div className={`
      fixed lg:static 
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      transition-all duration-300 ease-in-out
      w-64 h-[calc(100vh-4rem)] 
      bg-white dark:bg-gray-800 
      shadow-lg z-20
      border-r border-gray-200 dark:border-gray-700
    `}>
            <div className="p-6 flex flex-col h-full">
                <div className="flex flex-col items-center">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg"
                        alt="Profile"
                        className="rounded-full w-16 h-16 mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">John Doe</h2>
                    <p className="text-gray-600 dark:text-gray-400">ID: EMP123456</p>
                </div>

                <div className="my-8">
                    <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                        Switch Role
                    </h3>
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <Button
                                key={role.id}
                                variant={currentRole === role.id ? "default" : "outline"}
                                className={`w-full justify-start
                  ${currentRole === role.id
                                        ? 'dark:bg-gray-700 dark:text-white'
                                        : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }
                `}
                                onClick={() => setCurrentRole(role.id)}
                            >
                                <UserCircle className="mr-2 h-4 w-4" />
                                {role.label}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = "#"}
                        className="w-full justify-start text-gray-700 dark:text-gray-300 
              hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <User className="mr-2 h-4 w-4" />
                        User Detail
                    </Button>
                </div>

                <div className="mt-auto">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 dark:text-red-400 
              hover:text-red-700 dark:hover:text-red-300
              hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;