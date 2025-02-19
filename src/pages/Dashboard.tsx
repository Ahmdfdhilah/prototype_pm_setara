import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  BarChart3, 
  Building2, 
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import Logo from '../assets/logo.svg';
import Sidebar from '@/components/Sidebar';

// Header Component
interface HeaderProps {
  isSidebarOpen: boolean; 
  setIsSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen, isDarkMode, setIsDarkMode }) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}  // Now correctly toggling the state
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="Company Logo"
              className="h-32 w-32"
            />
          </div>
        </div>
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
    </header>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('employee');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const systems = [
    {
      title: 'Performance Management System',
      description: 'Monitor and manage employee performance metrics',
      icon: BarChart3,
      roles: ['admin', 'employee', 'approver', 'sm_dept'],
      iconColor: '#4CAF50', // Warna ikon untuk sistem ini
      titleColor: '#2E7D32', // Warna judul untuk sistem ini
    },
    {
      title: 'Company Profile CMS',
      description: 'Manage company website content and information',
      icon: Building2,
      roles: ['admin'],
      iconColor: '#FFA000', // Warna ikon untuk sistem ini
      titleColor: '#E65100', // Warna judul untuk sistem ini
    }
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      <Header 
        isSidebarOpen={isSidebarOpen}  // Added this prop
        setIsSidebarOpen={setIsSidebarOpen} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      
      <div className="pt-16 flex">
        <Sidebar
          currentRole={currentRole} 
          setCurrentRole={setCurrentRole}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold dark:text-white">Welcome, John Doe</h1>
              <p className="text-gray-600 dark:text-gray-400">Select a system to continue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems
                .filter(system => system.roles.includes(currentRole))
                .map((system, index) => {
                  const Icon = system.icon;
                  return (
                    <Card 
                      key={index}
                      className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <Icon 
                            className="h-6 w-6" 
                            style={{ color: system.iconColor }} // Menggunakan warna ikon yang berbeda
                          />
                          <ChevronRight 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                          />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 
                          className="text-xl font-semibold mb-2"
                          style={{ color: system.titleColor }} // Menggunakan warna judul yang berbeda
                        >
                          {system.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-400">
                          {system.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;