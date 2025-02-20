import { useNavigate } from 'react-router-dom';
import { LogOut, User, BarChart3, Building2, LineChart, Target, Rocket, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    system?: string;
    role?: string;
}

// Define performance management menus
const performanceMenus = [
  {
    title: 'BSC Dashboard',
    path: '/performance-management/bsc/dashboard',
    icon: BarChart3,
    roles: ['admin', 'approver', 'sm_dept']
  },
  {
    title: 'Individual Performance',
    path: '/performance-management/ipm/dashboard',
    icon: LineChart,
    roles: ['admin', 'employee', 'approver', 'sm_dept']
  },
  {
    title: 'Management Performance',
    path: '/performance-management/mpm/dashboard',
    icon: Target,
    roles: ['admin', 'approver', 'sm_dept']
  },
  {
    title: 'Strategic Initiative',
    path: '/performance-management/strategic/dashboard',
    icon: Rocket,
    roles: ['admin', 'approver', 'sm_dept']
  }
];

const systems = [
  {
    title: 'Performance Management System',
    description: 'Monitor and manage employee performance metrics',
    icon: Trophy,
    roles: ['admin', 'employee', 'approver', 'sm_dept'],
    iconColor: '#4CAF50',
    titleColor: '#2E7D32',
    url: '/performance-management/bsc/dashboard',
    subMenus: performanceMenus
  },
  {
    title: 'Company Profile CMS',
    description: 'Manage company website content and information',
    icon: Building2,
    roles: ['admin'],
    iconColor: '#FFA000',
    titleColor: '#E65100',
    url: '#',
    subMenus: []
  }
];
const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, system, role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    const currentSystem = systems.find(sys => sys.url.includes(system || ''));
    const accessibleMenus = currentSystem?.subMenus?.filter(menu => 
        menu.roles.includes(role || '')
    ) || [];

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 lg:hidden z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            <aside className={`
                fixed left-0 top-16 h-[calc(100vh-4rem)] w-64
                bg-white dark:bg-gray-800 
                shadow-lg z-40
                border-r border-gray-200 dark:border-gray-700
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="relative h-full p-6 flex flex-col">
                    {/* Close button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute right-2 top-2 lg:hidden"
                    >
                        <X className="h-4 w-4" />
                    </Button>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center mt-8 lg:mt-0">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg"
                            alt="Profile"
                            className="rounded-full w-16 h-16 mb-4"
                        />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">John Doe</h2>
                        <p className="text-gray-600 dark:text-gray-400">ID: EMP123456</p>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="mt-8 space-y-2">
                        {accessibleMenus.map((menu, menuIndex) => (
                            <Button
                                key={menuIndex}
                                variant="ghost"
                                onClick={() => {
                                    navigate(menu.path);
                                    // Close sidebar on mobile after navigation
                                    if (window.innerWidth < 1024) {
                                        setIsSidebarOpen(false);
                                    }
                                }}
                                className="w-full justify-start text-gray-600 dark:text-gray-400 
                                hover:text-gray-900 dark:hover:text-gray-100
                                hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                                {menu.icon && <menu.icon className="mr-2 h-4 w-4" />}
                                {menu.title}
                            </Button>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto space-y-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/user-profile')}
                            className="w-full justify-start text-gray-700 dark:text-gray-300 
                            hover:text-gray-900 dark:hover:text-gray-100
                            hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <User className="mr-2 h-4 w-4" />
                            User Detail
                        </Button>

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
            </aside>
        </>
    );
};

export default Sidebar;