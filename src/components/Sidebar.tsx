import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, BarChart3, Building2, LineChart, Target, Rocket, Trophy, ChevronDown, ChevronRight, Home, Calendar, SquareKanban } from 'lucide-react';
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
        path: '/performance-management',
        icon: Home,
        roles: ['admin', 'approver', 'sm_dept', 'employee'],
    },
    {
        title: 'Dashboard',
        path: '/performance-management/dashboard',
        icon: SquareKanban,
        roles: ['admin', 'approver', 'sm_dept'],
    },
    {
        title: 'Period Master',
        path: '/performance-management/period-master',
        icon: Calendar,
        roles: ['admin', 'approver', 'sm_dept'],
    },
    {
        title: 'BSC',
        path: '/performance-management/bsc',
        icon: BarChart3,
        roles: ['admin', 'approver', 'sm_dept'],
        subMenus: [
            {
                title: 'Dashboard',
                path: '/performance-management/bsc/dashboard',
                roles: ['admin', 'approver', 'sm_dept']
            },
            {
                title: 'Input',
                path: '/performance-management/bsc/input',
                roles: ['admin', 'approver']
            }
        ]
    },
    {
        title: 'Individual Performance',
        path: '/performance-management/ipm',
        icon: LineChart,
        roles: ['admin', 'employee', 'approver', 'sm_dept'],
    },
    {
        title: 'Management Performance', 
        path: '/performance-management/mpm/dashboard',
        icon: Target,
        roles: ['admin', 'approver', 'sm_dept'],
        subMenus: [
            {
                title: 'Action Plan MPM',
                path: '/performance-management/mpm/action-plan',
                roles: ['admin', 'approver', 'sm_dept']
            },
            {
                title: 'Actual Input MPM',
                path: '/performance-management/mpm/actual-input',
                roles: ['admin','approver', 'sm_dept']
            },
            {
                title: 'Target Input MPM',
                path: '/performance-management/mpm/target-input',
                roles: ['admin','approver', 'sm_dept']
            }
        ]
    },
    {
        title: 'Strategic Initiative', //FIX ME
        path: '#',
        icon: Rocket,
        roles: ['admin', 'approver', 'sm_dept'],
        
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
        // Check if current path matches exactly with menu path or any of its submenus
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
            font-proxima 
            fixed left-0 top-16 h-[calc(100vh-4rem)] w-72
            bg-white dark:bg-gray-800 
            shadow-lg z-20
            border-r border-gray-200 dark:border-gray-700
            transition-transform duration-300 ease-in-out
            overflow-y-auto
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
                <div className="relative h-full p-6 flex flex-col">
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
                                    className={`w-full justify-start ${isMenuActive(menu)
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    {menu.icon && <menu.icon className="mr-2 h-4 w-4" />}
                                    {menu.title}
                                    {menu.subMenus && (
                                        expandedMenus[menu.path]
                                            ? <ChevronDown className="ml-auto h-4 w-4" />
                                            : <ChevronRight className="ml-auto h-4 w-4" />
                                    )}
                                </Button>

                                {/* Submenu */}
                                {menu.subMenus && expandedMenus[menu.path] && (
                                    <div className="ml-6 mt-2 space-y-1">
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
                                                className={`w-full justify-start pl-6 ${isSubmenuActive(submenu.path)
                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                {submenu.title}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto mb-8 md:mb-0 space-y-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/user-profile')}
                            className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <User className="mr-2 h-4 w-4" />
                            User Detail
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
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