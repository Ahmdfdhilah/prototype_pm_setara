import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import FilterSection from '@/components/Filtering';

// Dummy data for charts
const mpmTopData = [
    { name: 'Financial', score: 95, target: 90 },
    { name: 'Customer', score: 88, target: 85 },
    { name: 'Internal Business Process', score: 82, target: 80 },
    { name: 'Learning & Growth', score: 78, target: 75 },
    { name: 'IT', score: 75, target: 70 }
];

const ipmTopData = [
    { name: 'Haniefan Muhammad', score: 92, target: 85 },
    { name: 'Muhammad Habib', score: 87, target: 80 },
    { name: 'Richard', score: 85, target: 80 },
    { name: 'Daffa', score: 83, target: 75 },
    { name: 'David', score: 80, target: 75 }
];

const monthlyTrendData = [
    { month: 'Jan', mpm: 85, ipm: 82 },
    { month: 'Feb', mpm: 87, ipm: 84 },
    { month: 'Mar', mpm: 89, ipm: 86 },
    { month: 'Apr', mpm: 86, ipm: 88 },
    { month: 'May', mpm: 90, ipm: 85 },
    { month: 'Jun', mpm: 92, ipm: 87 }
];

const PerformanceManagementDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('Jan-25');
    const [selectedType, setSelectedType] = useState('Monthly');

    const handleStartDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEndDate(e.target.value);
    };

    const handlePeriodChange = (value: React.SetStateAction<string>) => {
        setSelectedPeriod(value);
    };

    const handleTypeChange = (value: React.SetStateAction<string>) => {
        setSelectedType(value);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Header
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentSystem='Performance Management System'
            />

            <div className="flex">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    role={currentRole}
                    system="performance-management"
                />

                <main className={`flex-1 px-8 pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                            Performance Management Dashboard
                        </h1>

                        <FilterSection
                            startDate={startDate}
                            endDate={endDate}
                            handleStartDateChange={handleStartDateChange}
                            handleEndDateChange={handleEndDateChange}
                            handlePeriodChange={handlePeriodChange}
                            selectedPeriod={selectedPeriod}
                            handleTypeChange={handleTypeChange}
                            selectedType={selectedType} isEndDateDisabled={false}                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* MPM Top 5 Card */}
                            <Card className="border-[#46B749] dark:border-[#1B6131]">
                                <CardHeader>
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                                        MPM Top 5 Performers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={mpmTopData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="score" fill="#1B6131" name="Score" />
                                            <Bar dataKey="target" fill="#46B749" name="Target" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* IPM Top 5 Card */}
                            <Card className="border-[#46B749] dark:border-[#1B6131]">
                                <CardHeader>
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                                        IPM Top 5 Performers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={ipmTopData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="score" fill="#1B6131" name="Score" />
                                            <Bar dataKey="target" fill="#46B749" name="Target" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Monthly Performance Trends */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                                        Performance Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={monthlyTrendData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="mpm" stroke="#1B6131" name="MPM Score" />
                                            <Line type="monotone" dataKey="ipm" stroke="#46B749" name="IPM Score" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PerformanceManagementDashboard;