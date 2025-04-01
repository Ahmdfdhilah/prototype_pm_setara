import { useState, useEffect } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Building,
    ClockIcon,
    Target,
    AlertTriangle,
    Award,
    Calendar
} from 'lucide-react';
import FilterSection from '@/components/Filtering';
import { PerformanceChart } from '@/components/Dashboard/LineChartDashboard';
import { StatCard, TrendIndicator } from '@/components/Dashboard/StatCard';
import { DistributionBar } from '@/components/Dashboard/DistributionBar';
import { availablePeriods, availableYears, departmentPerformanceByMonth, individualPerformersByMonth } from '@/lib/dashboardMocks';
import { RankBadge } from '@/components/RankBadge';
import { StatusIndicator } from '@/components/Dashboard/StatusIndicator';

const PerformanceManagementDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [startPeriod, setStartPeriod] = useState('January');
    const [endPeriod, setEndPeriod] = useState('June');
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [availableEndPeriods, setAvailableEndPeriods] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
    const [trendData, setTrendData] = useState<Array<{ month: string, mpm: number, ipm: number, target: number }>>([]);
    const [useSingleMonth, setUseSingleMonth] = useState(false);

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

    // Replace the calculateAverageScore function
    const calculateAverageScore = () => {
        if (selectedPeriods.length === 0) return 0;

        const sum = selectedPeriods.reduce((acc, period) => {
            const deptData = departmentPerformanceByMonth[period];
            if (!deptData) return acc;

            const periodAvg = deptData.reduce((sum, dept) => sum + dept.score, 0) / deptData.length;
            return acc + periodAvg;
        }, 0);

        return (sum / selectedPeriods.length).toFixed(1);
    };

    // Replace the calculateTrend function
    const calculateTrend = () => {
        if (selectedPeriods.length < 2) return 0;

        const currentPeriod = selectedPeriods[selectedPeriods.length - 1];
        const previousPeriod = selectedPeriods[selectedPeriods.length - 2];

        const currentDeptData = departmentPerformanceByMonth[currentPeriod] || [];
        const prevDeptData = departmentPerformanceByMonth[previousPeriod] || [];

        if (currentDeptData.length === 0 || prevDeptData.length === 0) return 0;

        const currentAvg = currentDeptData.reduce((sum, dept) => sum + dept.score, 0) / currentDeptData.length;
        const prevAvg = prevDeptData.reduce((sum, dept) => sum + dept.score, 0) / prevDeptData.length;

        return ((currentAvg - prevAvg) / prevAvg) * 100;
    };

    // Update the trend data creation
    useEffect(() => {
        if (useSingleMonth) {
            setSelectedPeriods([selectedMonth]);

            const deptData = departmentPerformanceByMonth[selectedMonth] || [];
            const indivData = individualPerformersByMonth[selectedMonth] || [];

            const deptAvg = deptData.length > 0
                ? deptData.reduce((sum, dept) => sum + dept.score, 0) / deptData.length
                : 0;

            const indivAvg = indivData.length > 0
                ? indivData.reduce((sum, indiv) => sum + indiv.score, 0) / indivData.length
                : 0;

            setTrendData([{
                month: selectedMonth,
                mpm: deptAvg,
                ipm: indivAvg,
                target: 85
            }]);
        } else {
            const startIndex = availablePeriods.indexOf(startPeriod);
            const endIndex = availablePeriods.indexOf(endPeriod);

            if (startIndex <= endIndex) {
                const periods = availablePeriods.slice(startIndex, endIndex + 1);
                setSelectedPeriods(periods);

                const newTrendData = periods.map(period => {
                    const deptData = departmentPerformanceByMonth[period] || [];
                    const indivData = individualPerformersByMonth[period] || [];

                    const deptAvg = deptData.length > 0
                        ? deptData.reduce((sum, dept) => sum + dept.score, 0) / deptData.length
                        : 0;

                    const indivAvg = indivData.length > 0
                        ? indivData.reduce((sum, indiv) => sum + indiv.score, 0) / indivData.length
                        : 0;

                    return {
                        month: period,
                        mpm: Number(deptAvg.toFixed(2)),
                        ipm: Number(indivAvg.toFixed(2)),
                        target: 85
                    };
                });
                setTrendData(newTrendData);
            }
        }
    }, [startPeriod, endPeriod, useSingleMonth, selectedMonth]);

    // Get department performance data for selected period(s)
    const getDepartmentPerformance = () => {
        if (useSingleMonth) {
            return departmentPerformanceByMonth[selectedMonth] || [];
        }

        // For range, we'll show the latest month's data
        const latestMonth = selectedPeriods[selectedPeriods.length - 1];
        return departmentPerformanceByMonth[latestMonth] || [];
    };

    // Get individual performers data for selected period(s)
    const getIndividualPerformers = () => {
        if (useSingleMonth) {
            return individualPerformersByMonth[selectedMonth] || [];
        }

        // For range, we'll show the latest month's data
        const latestMonth = selectedPeriods[selectedPeriods.length - 1];
        return individualPerformersByMonth[latestMonth] || [];
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
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="single-month-mode"
                                    checked={useSingleMonth}
                                    onCheckedChange={setUseSingleMonth}
                                />
                                <Label htmlFor="single-month-mode">Single Month View</Label>
                            </div>
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

                            {useSingleMonth ? (
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <ClockIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                        <span>Select Month</span>
                                    </label>
                                    <Select
                                        value={selectedMonth}
                                        onValueChange={setSelectedMonth}
                                    >
                                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                            <SelectValue placeholder="Select Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availablePeriods.map((period) => (
                                                <SelectItem key={`month-${period}`} value={period}>
                                                    {period}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <>
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
                                </>
                            )}
                        </FilterSection>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Overall Performance Score */}
                            <StatCard
                                title="Overall Performance"
                                value={calculateAverageScore()}
                                subtitle="out of 100"
                                trend={calculateTrend()}
                                icon={<Award />}
                                progress={Number(calculateAverageScore())}
                            />

                            {/* Departments On Track */}
                            <StatCard
                                title="Departments On Track"
                                value="3"
                                subtitle="of 6 departments"
                                icon={<Building />}
                            >
                                <DistributionBar
                                    data={[
                                        { value: 3, color: "bg-green-500", textColor: "text-green-600", label: "On Track" },
                                        { value: 2, color: "bg-yellow-500", textColor: "text-yellow-600", label: "At Risk" },
                                        { value: 1, color: "bg-red-500", textColor: "text-red-600", label: "Behind" },
                                    ]}
                                />
                            </StatCard>

                            {/* Employee On Track */}
                            <StatCard
                                title="Employees On Track"
                                value="50"
                                subtitle="of 100 departments"
                                icon={<Building />}
                            >
                                <DistributionBar
                                    data={[
                                        { value: 3, color: "bg-green-500", textColor: "text-green-600", label: "On Track" },
                                        { value: 2, color: "bg-yellow-500", textColor: "text-yellow-600", label: "At Risk" },
                                        { value: 1, color: "bg-red-500", textColor: "text-red-600", label: "Behind" },
                                    ]}
                                />
                            </StatCard>

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
                        </div>

                        {/* Performance Trends Chart - Only show when not in single month mode */}
                        {!useSingleMonth && (
                            <PerformanceChart
                                data={trendData}
                                title='Performance Trends'
                                description='Monthly progression of performance metrics compared to targets'
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {useSingleMonth && (
                                <>
                                    {/* Top Department Performance */}
                                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                            <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                <Building className="mr-2" />
                                                {useSingleMonth ? `${selectedMonth} Department Performance` : 'Department Performance'}
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
                                                    {getDepartmentPerformance()
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
                                                {useSingleMonth ? `${selectedMonth} Top Performers` : 'Top Individual Performers'}
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
                                                    {getIndividualPerformers().map((person, index) => (
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

                                </>
                            )}
                        </div>
                        {/* Monthly breakdown tables when in range mode */}
                        {!useSingleMonth && selectedPeriods.length > 1 && (
                            <div className="space-y-6">
                                {selectedPeriods.map((period) => (
                                    <div key={`monthly-${period}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                                    <Building className="mr-2" />
                                                    {period} Department Performance
                                                </CardTitle>
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
                                                        {(departmentPerformanceByMonth[period] || [])
                                                            .sort((a, b) => b.score - a.score)
                                                            .slice(0, 5)
                                                            .map((dept, index) => (
                                                                <TableRow key={`${period}-dept-${index}`}>
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
                                                    {period} Top Performers
                                                </CardTitle>
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
                                                        {(individualPerformersByMonth[period] || []).map((person, index) => (
                                                            <TableRow key={`${period}-person-${index}`}>
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
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PerformanceManagementDashboard;