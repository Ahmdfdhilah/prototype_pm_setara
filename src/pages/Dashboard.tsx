import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  BarChart3,
  Building2,
  Users,
  Eye
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { To, useNavigate } from 'react-router-dom';
import Performance from '../assets/performance.jpg';
import Cms from '../assets/cms.jpg';

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('employee');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const navigate = useNavigate();

  // Simulate loading stats
  useEffect(() => {
    const userTarget = 156;
    const visitorTarget = 423;
    const increment = Math.ceil(Math.max(userTarget, visitorTarget) / 30);

    const timer = setInterval(() => {
      setActiveUsers(prev => {
        if (prev + increment >= userTarget) {
          return userTarget;
        }
        return prev + increment;
      });

      setActiveVisitors(prev => {
        if (prev + increment >= visitorTarget) {
          clearInterval(timer);
          return visitorTarget;
        }
        return prev + increment;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const systems = [
    {
      title: 'Performance Management System',
      description: 'Monitor and manage employee performance metrics with real-time analytics and feedback systems',
      icon: BarChart3,
      roles: ['admin', 'employee', 'approver', 'sm_dept'],
      iconColor: '#4CAF50',
      titleColor: '#2E7D32',
      url: '/performance-management/bsc/dashboard',
      imageUrl: Performance,
      stats: {
        users: '2.4k',
        growth: '+12%',
        activity: 'High'
      }
    },
    {
      title: 'Company Profile CMS',
      description: 'Manage company website content and information with our advanced content management system',
      icon: Building2,
      roles: ['admin'],
      iconColor: '#FFA000',
      titleColor: '#E65100',
      url: '#',
      imageUrl: Cms,
      stats: {
        visitors: '12.5k',
        growth: '+5%',
        activity: 'Medium'
      }
    }
  ];

  const handleClick = (url: To) => {
    navigate(url);
  };

  const QuickStats: React.FC<{ role: string }> = ({ role }) => {
    // Define which stats to show based on role
    const stats = [];

    stats.push(
      <Card key="users" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Active Users</p>
              <h3 className="text-2xl font-bold">{activeUsers}</h3>
            </div>
            <Users className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>
    );


    // Show visitors stat for CMS system (admin only)
    if (role === 'admin') {
      stats.push(
        <Card key="visitors" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Active Visitors</p>
                <h3 className="text-2xl font-bold">{activeVisitors}</h3>
              </div>
              <Eye className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentSystem='Dashboard'
      />

      <div className="md:pt-16 flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          role={currentRole}
          system='gateway'
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-8">
          <div className="mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold dark:text-white">Welcome back, John Doe</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Here's an overview of your available systems</p>
                </div>
              </div>
            </div>

            <QuickStats role={currentRole} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems
                .filter(system => system.roles.includes(currentRole))
                .map((system, index) => {
                  const Icon = system.icon;
                  return (
                    <Card
                      key={index}
                      onClick={() => handleClick(system.url)}
                      className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden cursor-pointer"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={system.imageUrl}
                          alt={system.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Icon
                          className="absolute top-4 right-4 h-8 w-8"
                          style={{ color: system.iconColor }}
                        />
                      </div>

                      <CardContent className="relative z-10 -mt-8">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-t-xl shadow-lg">
                          <h3
                            className="text-xl font-semibold mb-2"
                            style={{ color: system.titleColor }}
                          >
                            {system.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {system.description}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 p-4">
                        <div className="w-full grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {system.title.includes('CMS') ? 'Visitors' : 'Users'}
                            </p>
                            <p className="font-semibold">
                              {system.title.includes('CMS') ? system.stats.visitors : system.stats.users}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
                            <p className="font-semibold text-green-500">{system.stats.growth}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Activity</p>
                            <p className="font-semibold">{system.stats.activity}</p>
                          </div>
                        </div>
                      </CardFooter>
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