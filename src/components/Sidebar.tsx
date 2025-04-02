import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, BarChart3, Building2, LineChart, Target, Rocket, Trophy, ChevronDown, ChevronRight, Home, Calendar, SquareKanban, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    system?: string;
    role?: string;
}

interface MenuItem {
    title: string;
    path: string;
    icon?: any;
    roles: string[];
    subMenus?: MenuItem[];
}

// Define performance management menus
const performanceMenus: MenuItem[] = [
    {
        title: 'Home',
        path: '/',
        icon: Home,
        roles: ['admin', 'manager', 'sm_dept', 'employee'],
    },
    {
        title: 'Dashboard',
        path: '/performance-management/dashboard',
        icon: SquareKanban,
        roles: ['admin', 'manager', 'sm_dept'],
    },
    {
        title: 'Period Master',
        path: '/performance-management/period-master',
        icon: Calendar,
        roles: ['admin', 'manager', 'sm_dept'],
    },
    {
        title: 'Company Management',
        path: '/performance-management/company-management',
        icon: Building,
        roles: ['admin'],
        subMenus: [
            {
                title: 'Department Management',
                path: '/performance-management/company-management/departments',
                roles: ['admin']
            },
            {
                title: 'Teams Management',
                path: '/performance-management/company-management/teams',
                roles: ['admin']
            },
             {
                title: 'Employee Management',
                path: '/performance-management/company-management/employees',
                roles: ['admin']
            },
        ]
    },
    {
        title: 'BSC',
        path: '/performance-management/bsc',
        icon: BarChart3,
        roles: ['admin', 'manager', 'sm_dept'],
        subMenus: [
            {
                title: 'BSC Dashboard',
                path: '/performance-management/bsc/dashboard',
                roles: ['admin', 'manager', 'sm_dept']
            },
            {
                title: 'BSC KPI Input',
                path: '/performance-management/bsc/input',
                roles: ['admin', 'manager']
            }
        ]
    },
    {
        title: 'Individual Performance',
        path: '/performance-management/ipm',
        icon: LineChart,
        roles: ['admin', 'employee', 'manager', 'sm_dept'],
    },
    {
        title: 'Monthly Management Performance',
        path: '/monthly-performance-management/mpm/dashboard',
        icon: Target,
        roles: ['admin', 'manager', 'sm_dept'],
        subMenus: [
            {
                title: 'MPM Dashboard',
                path: '/performance-management/mpm/dashboard',
                roles: ['admin', 'manager', 'sm_dept']
            },
            {
                title: 'MPM Actual',
                path: '/performance-management/mpm/actual',
                roles: ['admin', 'manager', 'sm_dept']
            },
            {
                title: 'MPM Target',
                path: '/performance-management/mpm/target',
                roles: ['admin', 'manager', 'sm_dept']
            }
        ]
    },
    {
        title: 'Strategic Initiative',
        path: '#',
        icon: Rocket,
        roles: ['admin', 'manager', 'sm_dept'],
    }
];

const systems = [
    {
        title: 'Performance Management System',
        description: 'Monitor and manage employee performance metrics',
        icon: Trophy,
        roles: ['admin', 'employee', 'manager', 'sm_dept'],
        iconColor: '#4CAF50',
        titleColor: '#2E7D32',
        url: '/performance-management/bsc/dashboard',
        menus: performanceMenus
    },
    {
        title: 'Company Profile CMS',
        description: 'Manage company website content and information',
        icon: Building2,
        roles: ['admin'],
        iconColor: '#FFA000',
        titleColor: '#E65100',
        url: '#',
        menus: []
    }
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, system, role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

    const handleLogout = () => {
        navigate('/login');
    };

    const currentSystem = systems.find(sys => sys.url.includes(system || ''));
    const accessibleMenus = currentSystem?.menus?.filter(menu =>
        menu.roles.includes(role || '')
    ) || [];

    const toggleSubmenu = (menuPath: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuPath]: !prev[menuPath]
        }));
    };

    const isMenuActive = (menu: MenuItem): boolean => {
        if (menu.subMenus) {
            return menu.subMenus.some(subMenu => location.pathname === subMenu.path);
        }
        return location.pathname === menu.path;
    };

    const isSubmenuActive = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-10"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`
                font-montserrat 
                fixed left-0 top-16 h-[calc(100vh-4rem)] w-72
                bg-white dark:bg-gray-800 
                shadow-lg z-20
                border-r border-gray-200 dark:border-gray-700
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                overflow-y-auto
            `}>
                <div className="relative h-full p-4 md:p-6 flex flex-col">
                    {/* Profile Section - Disesuaikan padding untuk mobile */}
                    <div className="flex flex-col items-center mt-4 md:mt-8">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg"
                            alt="Profile"
                            className="rounded-full w-14 h-14 md:w-16 md:h-16 mb-3 md:mb-4"
                        />
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">John Doe</h2>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">ID: EMP123456</p>
                    </div>

                    {/* Navigation Menu - Disesuaikan spacing untuk mobile */}
                    <nav className="mt-4 md:mt-8 space-y-1 md:space-y-2 flex-grow overflow-y-auto">
                        {accessibleMenus.map((menu, menuIndex) => (
                            <div key={menuIndex}>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        if (menu.subMenus) {
                                            toggleSubmenu(menu.path);
                                        } else {
                                            navigate(menu.path);
                                            if (window.innerWidth < 1024) {
                                                setIsSidebarOpen(false);
                                            }
                                        }
                                    }}
                                    className={`w-full justify-start h-auto min-h-9 md:min-h-10 py-1 md:py-2 px-3 ${isMenuActive(menu)
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <div className="flex items-center w-full">
                                        {menu.icon && <menu.icon className="mr-2 h-4 w-4 flex-shrink-0" />}
                                        <span className="truncate text-sm md:text-base">{menu.title}</span>
                                        {menu.subMenus && (
                                            <span className="ml-auto flex-shrink-0">
                                                {expandedMenus[menu.path]
                                                    ? <ChevronDown className="h-4 w-4" />
                                                    : <ChevronRight className="h-4 w-4" />
                                                }
                                            </span>
                                        )}
                                    </div>
                                </Button>

                                {/* Submenu - Disesuaikan spacing untuk mobile */}
                                {menu.subMenus && expandedMenus[menu.path] && (
                                    <div className="ml-4 md:ml-6 mt-1 md:mt-2 space-y-0 md:space-y-1">
                                        {menu.subMenus.map((submenu, subIndex) => (
                                            <Button
                                                key={subIndex}
                                                variant="ghost"
                                                onClick={() => {
                                                    navigate(submenu.path);
                                                    if (window.innerWidth < 640) {
                                                        setIsSidebarOpen(false);
                                                    }
                                                }}
                                                className={`w-full justify-start pl-4 md:pl-6 h-auto min-h-8 py-1 md:py-2 ${isSubmenuActive(submenu.path)
                                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                <span className="truncate text-xs md:text-sm">{submenu.title}</span>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Actions - Disesuaikan padding untuk mobile */}
                    <div className="mt-auto mb-4 md:mb-8 space-y-1 md:space-y-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/user-profile')}
                            className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 py-1 md:py-2 px-3"
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span className="truncate text-sm md:text-base">User Detail</span>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 py-1 md:py-2 px-3"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span className="truncate text-sm md:text-base">Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;