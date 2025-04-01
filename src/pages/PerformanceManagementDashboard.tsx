import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
import Breadcrumb from '@/components/Breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Building,
    ClockIcon,
    TrendingUp,
    PieChart as PieChartIcon,
    Target,
    AlertTriangle,
    Award,
    ArrowUp,
    ArrowDown,
    Minus,
    FileText,
    Users,
    Activity,
    Calendar
} from 'lucide-react';
import FilterSection from '@/components/Filtering';
import { performanceData } from '@/lib/dashboardMocks';

// Ranking Badge Component
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    let badgeColor = "bg-gray-200 text-gray-800";

    if (rank === 1) badgeColor = "bg-yellow-400 text-yellow-800";
    if (rank === 2) badgeColor = "bg-gray-300 text-gray-700";
    if (rank === 3) badgeColor = "bg-amber-600 text-amber-900";

    return (
        <span className={`inline-flex items-center justify-center w-6 h-6 ${badgeColor} rounded-full font-bold text-xs mr-2`}>
            {rank}
        </span>
    );
};

// Trend Indicator Component
const TrendIndicator: React.FC<{ value: number }> = ({ value }) => {
    if (value > 0) {
        return (
            <div className="flex justify-center items-center">
                <span className="text-green-500 flex items-center">
                    <ArrowUp size={14} className="mr-1" />
                    {Math.abs(value).toFixed(1)}%
                </span>
            </div>
        );
    } else if (value < 0) {
        return (
            <div className="flex justify-center items-center">
                <span className="text-red-500 flex items-center">
                    <ArrowDown size={14} className="mr-1" />
                    {Math.abs(value).toFixed(1)}%
                </span>
            </div>
        );
    }
    return (
        <div className="flex justify-center items-center">
            <span className="text-gray-500 flex items-center">
                <Minus size={14} className="mr-1" />
                0%
            </span>
        </div>
    );
};

type StatusType = 'On Track' | 'At Risk' | 'Behind';

// Status Indicator Component
const StatusIndicator: React.FC<{ status: StatusType }> = ({ status }) => {
    let statusColor = "";
    let statusIcon = null;

    switch (status) {
        case 'On Track':
            statusColor = "text-green-500";
            statusIcon = <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>;
            break;
        case 'At Risk':
            statusColor = "text-yellow-500";
            statusIcon = <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>;
            break;
        case 'Behind':
            statusColor = "text-red-500";
            statusIcon = <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>;
            break;
    }

    return (
        <div className="flex justify-center">
            <div className={`flex items-center ${statusColor}`}>
                {statusIcon}
                <span>{status}</span>
            </div>
        </div>
    );
};

// Mock data for additional visualizations
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#46B749', '#1B6131'];

const perspectiveData = [
    { name: 'Financial', value: 89.2 },
    { name: 'Customer', value: 76.4 },
    { name: 'Internal Process', value: 82.7 },
    { name: 'Learning & Growth', value: 70.9 },
];

const departmentPerformance = [
    { department: 'Finance', score: 91.4, lastPeriod: 88.5, status: 'On Track' as const },
    { department: 'Marketing', score: 85.7, lastPeriod: 87.2, status: 'At Risk' as const },
    { department: 'Operations', score: 78.9, lastPeriod: 75.4, status: 'On Track' as const },
    { department: 'HR', score: 82.3, lastPeriod: 84.1, status: 'At Risk' as const },
    { department: 'IT', score: 88.6, lastPeriod: 81.9, status: 'On Track' as const },
    { department: 'Sales', score: 76.2, lastPeriod: 79.5, status: 'Behind' as const },
];

const kpiMissedTargets = [
    {
        kpi_entry_kpi: 'Customer Satisfaction Index',
        kpi_entry_perspective: 'Customer',
        kpi_entry_target: 85,
        kpi_entry_actual: 67.8,
        previous_actual: 70.2, // For trend calculation
        responsible_department: 'Customer Service',
        kpi_entry_uom: 'Percentage'
    },
    {
        kpi_entry_kpi: 'Monthly Revenue Growth',
        kpi_entry_perspective: 'Financial',
        kpi_entry_target: 6.0,
        kpi_entry_actual: 2.05,
        previous_actual: 1.8,
        responsible_department: 'Sales & Marketing',
        kpi_entry_uom: 'Percentage'
    },
    {
        kpi_entry_kpi: 'On-Time Project Delivery',
        kpi_entry_perspective: 'Internal Process',
        kpi_entry_target: 90,
        kpi_entry_actual: 58.7,
        previous_actual: 55.3,
        responsible_department: 'Project Management',
        kpi_entry_uom: 'Percentage'
    },
    {
        kpi_entry_kpi: 'Employee Retention Rate',
        kpi_entry_perspective: 'Learning & Growth',
        kpi_entry_target: 80,
        kpi_entry_actual: 71.9,
        previous_actual: 72.5,
        responsible_department: 'Human Resources',
        kpi_entry_uom: 'Percentage'
    },
];

const radarData = [
    { subject: 'Financial', A: 92, B: 85, fullMark: 100 },
    { subject: 'Customer', A: 86, B: 75, fullMark: 100 },
    { subject: 'Internal Process', A: 78, B: 70, fullMark: 100 },
    { subject: 'Learning & Growth', A: 84, B: 75, fullMark: 100 },
    { subject: 'Innovation', A: 80, B: 72, fullMark: 100 },
];

const availableDepartments = [
    'All Departments',
    'Finance',
    'Marketing',
    'Operations',
    'HR',
    'IT',
    'Sales'
];

// Available periods mocks (months)
const availablePeriods = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25'];
const availableYears = ['2023', '2024', '2025'];

const PerformanceManagementDashboard = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; 
    }
    return true; 
  });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [startPeriod, setStartPeriod] = useState('Jan-25');
    const [endPeriod, setEndPeriod] = useState('Jun-25');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
    const [availableEndPeriods, setAvailableEndPeriods] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [trendData, setTrendData] = useState<Array<{ month: string, mpm: number, ipm: number, target: number }>>([]);
    const [currentView, setCurrentView] = useState('overview');

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
                    ipm: performanceData[period].averageIpm,
                    target: 85 // Adding a target line
                };
            });
            setTrendData(newTrendData);
        }
    }, [startPeriod, endPeriod]);

    // Calculate overall performance scores
    const calculateAverageScore = () => {
        if (selectedPeriods.length === 0) return 0;

        const sum = selectedPeriods.reduce((acc, period) => {
            return acc + performanceData[period].averageMpm;
        }, 0);

        return (sum / selectedPeriods.length).toFixed(1);
    };

    // Calculate percentage difference from previous period
    const calculateTrend = () => {
        if (selectedPeriods.length < 2) return 0;

        const currentPeriod = selectedPeriods[selectedPeriods.length - 1];
        const previousPeriod = selectedPeriods[selectedPeriods.length - 2];

        const currentScore = performanceData[currentPeriod].averageMpm;
        const previousScore = performanceData[previousPeriod].averageMpm;

        return ((currentScore - previousScore) / previousScore) * 100;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

                        <FilterSection>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <Calendar className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>Period Year</span>
                                </label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableYears.map((year) => (
                                            <SelectItem key={`year-${year}`} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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
                                    <Building className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>Department</span>
                                </label>
                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableDepartments.map((dept) => (
                                            <SelectItem key={`dept-${dept}`} value={dept}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </FilterSection>

                        <Tabs>
                            <TabsList className="my-2 p-0 bg-transparent md:max-w-2xl md:mx-auto md:justify-between">
                                <div className="flex flex-wrap gap-2 w-full md:w-auto p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <TabsTrigger
                                        value="overview"
                                        onClick={() => setCurrentView('overview')}
                                        className={`${currentView === 'overview' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="departments"
                                        onClick={() => setCurrentView('departments')}
                                        className={`${currentView === 'departments' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                    >
                                        Departments
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="individuals"
                                        onClick={() => setCurrentView('individuals')}
                                        className={`${currentView === 'individuals' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                    >
                                        Individuals
                                    </TabsTrigger>
                                </div>
                            </TabsList>
                        </Tabs>

                        {/* KPI Summary Metrics */}
                        {currentView === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Overall Performance Score */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                                <Award className="mr-2 h-5 w-5" />
                                                Overall Performance
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-4xl font-bold">
                                                        {calculateAverageScore()}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">out of 100</p>
                                                </div>
                                                <TrendIndicator value={calculateTrend()} />
                                            </div>
                                            <div className="mt-4">
                                                <Progress value={Number(calculateAverageScore())} className="h-2 bg-gray-200" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Departments On Track */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                                <Building className="mr-2 h-5 w-5" />
                                                Departments On Track
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-4xl font-bold">
                                                        3
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">of 6 departments</p>
                                                </div>
                                                <div className="text-green-500 bg-green-50 dark:bg-green-900/20 p-1 rounded">
                                                    50%
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="flex space-x-1">
                                                    <div className="h-2 w-1/2 bg-green-500 rounded-l"></div>
                                                    <div className="h-2 w-1/3 bg-yellow-500"></div>
                                                    <div className="h-2 w-1/6 bg-red-500 rounded-r"></div>
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs">
                                                    <span className="text-green-600">On Track</span>
                                                    <span className="text-yellow-600">At Risk</span>
                                                    <span className="text-red-600">Behind</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* KPIs Meeting Targets */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                                <Target className="mr-2 h-5 w-5" />
                                                KPIs Meeting Targets
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-4xl font-bold">
                                                        68%
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">of total KPIs</p>
                                                </div>
                                                <TrendIndicator value={-3.5} />
                                            </div>
                                            <div className="mt-4">
                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                                                On Target
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-green-600">
                                                                68%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                                        <div style={{ width: "68%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Corrective Actions */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                                <AlertTriangle className="mr-2 h-5 w-5" />
                                                Corrective Actions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-4xl font-bold">
                                                        12
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">pending actions</p>
                                                </div>
                                                <div className="text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm">
                                                    <div>
                                                        <p className="font-medium">Implementation Status</p>
                                                        <p className="text-gray-500">Updated 2 hours ago</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">58%</p>
                                                        <p className="text-gray-500">complete</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Performance Trends Chart */}
                                <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                    <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                        <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                            <TrendingUp className="mr-2" />
                                            Performance Trends
                                        </CardTitle>
                                        <CardDescription>Monthly progression of performance metrics compared to targets</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-5">
                                        <div className="flex flex-col md:flex-row items-center justify-end gap-4 mb-4">
                                            <div className="flex items-center">
                                                <span className="inline-block w-3 h-3 bg-[#1B6131] rounded-full mr-2"></span>
                                                <span className="text-sm">MPM Score</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="inline-block w-3 h-3 bg-[#46B749] rounded-full mr-2"></span>
                                                <span className="text-sm">IPM Score</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                                                <span className="text-sm">Target</span>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                data={trendData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                                <XAxis dataKey="month" tick={{ fill: '#666666' }} />
                                                <YAxis tick={{ fill: '#666666' }} domain={[50, 100]} />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                                    }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="mpm"
                                                    stroke="#1B6131"
                                                    strokeWidth={2}
                                                    activeDot={{ r: 6 }}
                                                    name="MPM Score"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="ipm"
                                                    stroke="#46B749"
                                                    strokeWidth={2}
                                                    activeDot={{ r: 6 }}
                                                    name="IPM Score"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="target"
                                                    stroke="#9CA3AF"
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    name="Target"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Perspective Performance */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <PieChartIcon className="mr-2" />
                                                Balanced Scorecard Perspectives
                                            </CardTitle>
                                            <CardDescription>Performance by strategic perspective</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-5">
                                            <div className="flex flex-col items-center">
                                                <div className="w-full">
                                                    <ResponsiveContainer width="100%" height={200}>
                                                        <PieChart>
                                                            <Pie
                                                                data={perspectiveData}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                            >
                                                                {perspectiveData.map((_, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <RechartsTooltip
                                                                formatter={(value) => [`${value}%`, 'Score']}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="w-full space-y-3 mt-4 md:mt-8">
                                                    {perspectiveData.map((item, index) => (
                                                        <div key={`perspective-${index}`} className="flex items-center">
                                                            <span
                                                                className="inline-block w-4 h-4 rounded-sm mr-2"
                                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                            ></span>
                                                            <span className="text-sm flex-1">{item.name}</span>
                                                            <span className="text-sm font-medium">{item.value.toFixed(1)}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Top Department Performance */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <Building className="mr-2" />
                                                Department Performance
                                            </CardTitle>
                                            <CardDescription>Department performance ranking and status</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[50px]">Rank</TableHead>
                                                        <TableHead>Department</TableHead>
                                                        <TableHead className="text-center">Score</TableHead>
                                                        <TableHead className="text-center">Last Period</TableHead>
                                                        <TableHead className="text-center">Trend</TableHead>
                                                        <TableHead className="text-right">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {departmentPerformance
                                                        .sort((a, b) => b.score - a.score)
                                                        .slice(0, 5)
                                                        .map((dept, index) => (
                                                            <TableRow key={`dept-${index}`}>
                                                                <TableCell className="font-medium">{<RankBadge rank={index + 1} />}</TableCell>
                                                                <TableCell>{dept.department}</TableCell>
                                                                <TableCell className="text-center">{dept.score.toFixed(1)}%</TableCell>
                                                                <TableCell className="text-center">{dept.lastPeriod.toFixed(1)}%</TableCell>
                                                                <TableCell className="text-center">
                                                                    <TrendIndicator value={dept.score - dept.lastPeriod} />
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <StatusIndicator status={dept.status} />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>


                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <AlertTriangle className="mr-2" />
                                                Top Individual Performers
                                            </CardTitle>
                                            <CardDescription>Highest performing employees across departments</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className='text-center'>Rank</TableHead>
                                                        <TableHead className='text-center'>Name</TableHead>
                                                        <TableHead className='text-center'>Department</TableHead>
                                                        <TableHead className="text-center">Score</TableHead>
                                                        <TableHead className="text-center">Change</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {[
                                                        { name: 'Sarah J.', department: 'Finance', score: 96.4, change: 2.1 },
                                                        { name: 'Michael T.', department: 'IT', score: 94.8, change: 1.5 },
                                                        { name: 'Lisa R.', department: 'Marketing', score: 93.2, change: 3.2 },
                                                        { name: 'Robert K.', department: 'Operations', score: 92.7, change: -0.5 },
                                                        { name: 'Amanda P.', department: 'HR', score: 91.5, change: 1.2 },
                                                    ].map((person, index) => (
                                                        <TableRow key={`person-${index}`}>
                                                            <TableCell className='text-center'>
                                                                <RankBadge rank={index + 1} />
                                                            </TableCell>
                                                            <TableCell className="text-center font-medium">{person.name}</TableCell>
                                                            <TableCell className='text-center'>{person.department}</TableCell>
                                                            <TableCell className="text-center">{person.score.toFixed(1)}</TableCell>
                                                            <TableCell className="text-center">
                                                                <TrendIndicator value={person.change} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>

                                    {/* Comparative Analysis */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <Activity className="mr-2" />
                                                Comparative Analysis
                                            </CardTitle>
                                            <CardDescription>Current period vs previous period comparison</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-5">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <RadarChart outerRadius={90} data={radarData}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="subject" />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                    <Radar
                                                        name="Current Period"
                                                        dataKey="A"
                                                        stroke="#1B6131"
                                                        fill="#46B749"
                                                        fillOpacity={0.6}
                                                    />
                                                    <Radar
                                                        name="Previous Period"
                                                        dataKey="B"
                                                        stroke="#8884d8"
                                                        fill="#8884d8"
                                                        fillOpacity={0.3}
                                                    />
                                                    <Legend />
                                                    <RechartsTooltip />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                </div>

                                <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                    <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                        <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                            <AlertTriangle className="mr-2" />
                                            KPI Performance Dashboard
                                        </CardTitle>
                                        <CardDescription>Key metrics with performance trends</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-center">KPI</TableHead>
                                                    <TableHead className="text-center">Perspective</TableHead>
                                                    <TableHead className="text-center">Department</TableHead>
                                                    <TableHead className="text-center">Actual</TableHead>
                                                    <TableHead className="text-center">Target</TableHead>
                                                    <TableHead className="text-center">Achievement</TableHead>

                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {kpiMissedTargets.map((kpi, index) => {
                                                    const achievement = (kpi.kpi_entry_actual / kpi.kpi_entry_target) * 100;

                                                    // Determine achievement color
                                                    let achievementColor = '';
                                                    if (achievement < 70) achievementColor = 'text-red-600 dark:text-red-400 font-bold';
                                                    else if (achievement < 90) achievementColor = 'text-yellow-600 dark:text-yellow-400';
                                                    else achievementColor = 'text-green-600 dark:text-green-400';

                                                    return (
                                                        <TableRow key={`kpi-target-${index}`}>
                                                            <TableCell className="text-center font-medium">
                                                                {kpi.kpi_entry_kpi}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {kpi.kpi_entry_perspective}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {kpi.responsible_department}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {kpi.kpi_entry_actual}{kpi.kpi_entry_uom === 'Percentage' ? '%' : ''}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {kpi.kpi_entry_target}{kpi.kpi_entry_uom === 'Percentage' ? '%' : ''}
                                                            </TableCell>
                                                            <TableCell className={`text-center ${achievementColor}`}>
                                                                {achievement.toFixed(1)}%
                                                            </TableCell>

                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Department View */}
                        {currentView === 'departments' && (
                            <>
                                <div className="grid grid-cols-1 gap-6">
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <Building className="mr-2" />
                                                Department Performance Overview
                                            </CardTitle>
                                            <CardDescription>Performance by department across perspectives</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-5 p-0">
                                            <div className="mb-8 mt-4">
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart
                                                        data={departmentPerformance}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                                        <XAxis dataKey="department" tick={{ fill: '#666666' }} />
                                                        <YAxis tick={{ fill: '#666666' }} domain={[60, 100]} />
                                                        <RechartsTooltip
                                                            contentStyle={{
                                                                backgroundColor: '#ffffff',
                                                                border: '1px solid #e0e0e0',
                                                                borderRadius: '4px',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                                            }}
                                                            formatter={(value) => [`${value}%`, 'Score']}
                                                        />
                                                        <Legend />
                                                        <Bar
                                                            dataKey="score"
                                                            name="Current Period"
                                                            fill="#1B6131"
                                                        />
                                                        <Bar
                                                            dataKey="lastPeriod"
                                                            name="Previous Period"
                                                            fill="#46B749"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Department</TableHead>
                                                        <TableHead className="text-center">Current Score</TableHead>
                                                        <TableHead className="text-center">Previous</TableHead>
                                                        <TableHead className="text-center">Curent</TableHead>
                                                        <TableHead className="text-center">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {departmentPerformance.map((dept, index) => (
                                                        <TableRow key={`dept-detail-${index}`}>
                                                            <TableCell className="font-medium">{dept.department}</TableCell>
                                                            <TableCell className="text-center">{dept.score.toFixed(1)}%</TableCell>
                                                            <TableCell className="text-center">{dept.lastPeriod.toFixed(1)}%</TableCell>
                                                            <TableCell className="text-center">
                                                                <TrendIndicator value={(dept.score - dept.lastPeriod)} />
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <StatusIndicator status={dept.status} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}

                        {/* Individuals View */}
                        {currentView === 'individuals' && (
                            <>
                                <div className="grid grid-cols-1 gap-6">
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <Users className="mr-2" />
                                                Top Individual Performers
                                            </CardTitle>
                                            <CardDescription>Highest performing employees across departments</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-5 p-0">
                                            <div className="mb-8 mt-4">
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart
                                                        data={[
                                                            { name: 'Sarah J.', department: 'Finance', score: 96.4 },
                                                            { name: 'Michael T.', department: 'IT', score: 94.8 },
                                                            { name: 'Lisa R.', department: 'Marketing', score: 93.2 },
                                                            { name: 'Robert K.', department: 'Operations', score: 92.7 },
                                                            { name: 'Amanda P.', department: 'HR', score: 91.5 },
                                                        ]}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                                        <XAxis dataKey="name" tick={{ fill: '#666666' }} />
                                                        <YAxis tick={{ fill: '#666666' }} domain={[80, 100]} />
                                                        <RechartsTooltip
                                                            contentStyle={{
                                                                backgroundColor: '#ffffff',
                                                                border: '1px solid #e0e0e0',
                                                                borderRadius: '4px',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                                            }}
                                                            formatter={(value, name, _) => {
                                                                if (name === 'score') {
                                                                    return [`${value}`, 'Score'];
                                                                }
                                                                return [value, name];
                                                            }}
                                                        />
                                                        <Legend />
                                                        <Bar
                                                            dataKey="score"
                                                            name="Performance Score"
                                                            fill="#1B6131"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className='text-center'>Rank</TableHead>
                                                        <TableHead className='text-center'>Name</TableHead>
                                                        <TableHead className='text-center'>Department</TableHead>
                                                        <TableHead className="text-center">Score</TableHead>
                                                        <TableHead className="text-center">Change</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {[
                                                        { name: 'Sarah J.', department: 'Finance', score: 96.4, change: 2.1 },
                                                        { name: 'Michael T.', department: 'IT', score: 94.8, change: 1.5 },
                                                        { name: 'Lisa R.', department: 'Marketing', score: 93.2, change: 3.2 },
                                                        { name: 'Robert K.', department: 'Operations', score: 92.7, change: -0.5 },
                                                        { name: 'Amanda P.', department: 'HR', score: 91.5, change: 1.2 },
                                                        { name: 'Thomas W.', department: 'Sales', score: 90.8, change: 2.8 },
                                                        { name: 'Jessica L.', department: 'Finance', score: 90.3, change: 0.6 },
                                                        { name: 'David M.', department: 'IT', score: 89.7, change: 1.8 },
                                                        { name: 'Emily S.', department: 'Marketing', score: 89.1, change: -0.7 },
                                                        { name: 'Brian K.', department: 'Operations', score: 88.4, change: 1.3 },
                                                    ].map((person, index) => (
                                                        <TableRow key={`person-${index}`}>
                                                            <TableCell className='text-center'>
                                                                <RankBadge rank={index + 1} />
                                                            </TableCell>
                                                            <TableCell className="text-center font-medium">{person.name}</TableCell>
                                                            <TableCell className='text-center'>{person.department}</TableCell>
                                                            <TableCell className="text-center">{person.score.toFixed(1)}</TableCell>
                                                            <TableCell className="text-center">
                                                                <TrendIndicator value={person.change} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
};

export default PerformanceManagementDashboard;