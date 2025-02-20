import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ChevronRight,
  BarChart3,
  Building2,

} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

// Main Dashboard Component
const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('employee');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const systems = [
    {
      title: 'Performance Management System',
      description: 'Monitor and manage employee performance metrics',
      icon: BarChart3,
      roles: ['admin', 'employee', 'approver', 'sm_dept'],
      iconColor: '#4CAF50', // Warna ikon untuk sistem ini
      titleColor: '#2E7D32', // Warna judul untuk sistem ini
      url: '/performance-management/bcs/dashboard'
    },
    {
      title: 'Company Profile CMS',
      description: 'Manage company website content and information',
      icon: Building2,
      roles: ['admin'],
      iconColor: '#FFA000', // Warna ikon untuk sistem ini
      titleColor: '#E65100', // Warna judul untuk sistem ini,
      url: '#'
    }
  ];

  const handleClick = (url: string) => {
    navigate(url);
  };



  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 lg:ml-64 `}>
      <Header
        isSidebarOpen={isSidebarOpen}  // Added this prop
        setIsSidebarOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      <div className="pt-16 flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          role={currentRole}
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
                      onClick={() => handleClick(system.url)}
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