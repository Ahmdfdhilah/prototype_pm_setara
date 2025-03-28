import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Breadcrumb from '@/components/Breadcrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { ClockIcon } from 'lucide-react';
import FilterSection from '@/components/Filtering';

// Ranking Badge Component
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    return (
        <span className={`inline-flex items-center justify-center w-6 h-6 text-black font-bold text-xs mr-2 dark:text-white`}>
            {rank}.
        </span>
    );
};

// Dummy data for tables and charts
const performanceData: {
    [key: string]: {
        mpm: Array<{ name: string; score: number }>;
        ipm: Array<{ name: string; score: number }>;
        averageMpm: number;
        averageIpm: number;
    }
} = {
    'Jan-25': {
        mpm: [
            { name: 'Financial', score: 95 },
            { name: 'Customer', score: 88 },
            { name: 'Internal Business Process', score: 82 },
            { name: 'Learning & Growth', score: 78 },
            { name: 'IT', score: 75 }
        ],
        ipm: [
            { name: 'Haniefan Muhammad', score: 92 },
            { name: 'Muhammad Habib', score: 87 },
            { name: 'Richard', score: 85 },
            { name: 'Daffa', score: 83 },
            { name: 'David', score: 80 }
        ],
        averageMpm: 85,
        averageIpm: 82
    },
    'Feb-25': {
        mpm: [
            { name: 'Financial', score: 96 },
            { name: 'Customer', score: 89 },
            { name: 'Internal Business Process', score: 84 },
            { name: 'Learning & Growth', score: 80 },
            { name: 'Operations', score: 76 }
        ],
        ipm: [
            { name: 'Haniefan Muhammad', score: 93 },
            { name: 'Richard', score: 89 },
            { name: 'Muhammad Habib', score: 86 },
            { name: 'Sarah', score: 84 },
            { name: 'Daffa', score: 81 }
        ],
        averageMpm: 87,
        averageIpm: 84
    },
    'Mar-25': {
        mpm: [
            { name: 'Financial', score: 97 },
            { name: 'Customer', score: 90 },
            { name: 'Internal Business Process', score: 85 },
            { name: 'IT', score: 81 },
            { name: 'Learning & Growth', score: 79 }
        ],
        ipm: [
            { name: 'Richard', score: 94 },
            { name: 'Haniefan Muhammad', score: 91 },
            { name: 'Muhammad Habib', score: 88 },
            { name: 'David', score: 86 },
            { name: 'Sarah', score: 83 }
        ],
        averageMpm: 89,
        averageIpm: 86
    },
    'Apr-25': {
        mpm: [
            { name: 'Customer', score: 94 },
            { name: 'Financial', score: 93 },
            { name: 'Internal Business Process', score: 86 },
            { name: 'Operations', score: 84 },
            { name: 'Learning & Growth', score: 78 }
        ],
        ipm: [
            { name: 'Daffa', score: 95 },
            { name: 'Richard', score: 92 },
            { name: 'Haniefan Muhammad', score: 90 },
            { name: 'Muhammad Habib', score: 87 },
            { name: 'Sarah', score: 84 }
        ],
        averageMpm: 86,
        averageIpm: 88
    },
    'May-25': {
        mpm: [
            { name: 'Financial', score: 98 },
            { name: 'Customer', score: 95 },
            { name: 'Internal Business Process', score: 88 },
            { name: 'IT', score: 85 },
            { name: 'Learning & Growth', score: 82 }
        ],
        ipm: [
            { name: 'Haniefan Muhammad', score: 95 },
            { name: 'Richard', score: 92 },
            { name: 'Muhammad Habib', score: 89 },
            { name: 'Daffa', score: 86 },
            { name: 'David', score: 85 }
        ],
        averageMpm: 90,
        averageIpm: 85
    },
    'Jun-25': {
        mpm: [
            { name: 'Financial', score: 99 },
            { name: 'Customer', score: 96 },
            { name: 'Internal Business Process', score: 90 },
            { name: 'IT', score: 88 },
            { name: 'Learning & Growth', score: 84 }
        ],
        ipm: [
            { name: 'Haniefan Muhammad', score: 97 },
            { name: 'Richard', score: 94 },
            { name: 'Muhammad Habib', score: 91 },
            { name: 'David', score: 88 },
            { name: 'Daffa', score: 87 }
        ],
        averageMpm: 92,
        averageIpm: 87
    },
    'Jul-25': {
        mpm: [
            { name: 'Financial', score: 98 },
            { name: 'Customer', score: 95 },
            { name: 'Internal Business Process', score: 91 },
            { name: 'IT', score: 89 },
            { name: 'Learning & Growth', score: 86 }
        ],
        ipm: [
            { name: 'Haniefan Muhammad', score: 96 },
            { name: 'Richard', score: 93 },
            { name: 'Sarah', score: 92 },
            { name: 'Muhammad Habib', score: 90 },
            { name: 'David', score: 89 }
        ],
        averageMpm: 93,
        averageIpm: 88
    }
};

// Available periods (months)
const availablePeriods = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25'];

const PerformanceManagementDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [startPeriod, setStartPeriod] = useState('Jan-25');
    const [endPeriod, setEndPeriod] = useState('Jun-25');
    const [availableEndPeriods, setAvailableEndPeriods] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [trendData, setTrendData] = useState<Array<{ month: string, mpm: number, ipm: number }>>([]);

    // Set available end periods based on start period (max 6 months)
    useEffect(() => {
        const startIndex = availablePeriods.indexOf(startPeriod);
        // Maximum 6 months forward from start period
        const endOptions = availablePeriods.slice(startIndex, startIndex + 6);
        setAvailableEndPeriods(endOptions);

        // If current end period is not valid, set to max available
        if (!endOptions.includes(endPeriod)) {
            setEndPeriod(endOptions[endOptions.length - 1]);
        }
    }, [startPeriod]);

    // Update selected periods range and trend data when start/end periods change
    useEffect(() => {
        const startIndex = availablePeriods.indexOf(startPeriod);
        const endIndex = availablePeriods.indexOf(endPeriod);

        if (startIndex <= endIndex) {
            const periods = availablePeriods.slice(startIndex, endIndex + 1);
            setSelectedPeriods(periods);

            // Create trend data for the chart
            const newTrendData = periods.map(period => {
                return {
                    month: period.split('-')[0],
                    mpm: performanceData[period].averageMpm,
                    ipm: performanceData[period].averageIpm
                };
            });
            setTrendData(newTrendData);
        }
    }, [startPeriod, endPeriod]);

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

                <main className={`flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full`}>
                    <div className="space-y-6">
                        <Breadcrumb
                            items={[]}
                            currentPage="Performance Management Dashboard"
                            showHomeIcon={true}
                        />

                        <FilterSection
                        >
                            {/* Additional custom filters can be added as children */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <ClockIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>Start Period</span>
                                </label>
                                <Select
                                    value={startPeriod}
                                    onValueChange={setStartPeriod}
                                >
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                        <SelectValue placeholder="Select Start Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePeriods.map((period) => (
                                            <SelectItem key={`start-${period}`} value={period}>
                                                {period}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <ClockIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>End Period</span>
                                </label>
                                <Select
                                    value={endPeriod}
                                    onValueChange={setEndPeriod}
                                >
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                        <SelectValue placeholder="Select End Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableEndPeriods.map((period) => (
                                            <SelectItem key={`end-${period}`} value={period}>
                                                {period}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <ClockIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>Period Year</span>
                                </label>
                                <Select>
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                        <SelectValue placeholder="Select Start Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='2022'>
                                            2022
                                        </SelectItem>
                                        <SelectItem value='2023'>
                                            2023
                                        </SelectItem>
                                        <SelectItem value='2024'>
                                            2024
                                        </SelectItem>
                                        <SelectItem value='2025'>
                                            2025
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </FilterSection>

                        {/* Performance Trends Chart */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                    Performance Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 px-0">
                                <div className="flex flex-col md:flex-row items-center justify-end gap-4 mb-4">
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-[#1B6131] rounded-full mr-2"></span>
                                        <span className="text-sm">MPM Score</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-[#46B749] rounded-full mr-2"></span>
                                        <span className="text-sm">IPM Score</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart
                                        data={trendData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="month" tick={{ fill: '#666666' }} />
                                        <YAxis tick={{ fill: '#666666' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="mpm" stroke="#1B6131" strokeWidth={2} activeDot={{ r: 6 }} name="MPM Score" />
                                        <Line type="monotone" dataKey="ipm" stroke="#46B749" strokeWidth={2} activeDot={{ r: 6 }} name="IPM Score" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-6">
                            {/* MPM Top 5 Table */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                        </svg>
                                        MPM Top 5 Performers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {selectedPeriods.map((period) => (
                                                        <th key={`mpm-header-${period}`} className="text-center p-4 text-white">
                                                            {period}
                                                        </th>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {[0, 1, 2, 3, 4].map((index) => (
                                                    <TableRow className='hover:bg-gray-50 dark:hover:bg-gray-800/50' key={`mpm-row-${index}`}>
                                                        {selectedPeriods.map((period) => (
                                                            <TableCell key={`mpm-cell-${period}-${index}`} className="text-center">
                                                                <div className="flex items-center justify-center">
                                                                    <RankBadge rank={index + 1} />
                                                                    <span>{performanceData[period].mpm[index].name}</span>
                                                                </div>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* IPM Top 5 Table */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        IPM Top 5 Performers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {selectedPeriods.map((period) => (
                                                        <th key={`ipm-header-${period}`} className="text-center p-4 text-white">
                                                            {period}
                                                        </th>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {[0, 1, 2, 3, 4].map((index) => (
                                                    <TableRow className='hover:bg-gray-50 dark:hover:bg-gray-800/50' key={`ipm-row-${index}`} >
                                                        {selectedPeriods.map((period) => (
                                                            <TableCell key={`ipm-cell-${period}-${index}`} className="text-center">
                                                                <div className="flex items-center justify-center">
                                                                    <RankBadge rank={index + 1} />
                                                                    <span>{performanceData[period].ipm[index].name}</span>
                                                                </div>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
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