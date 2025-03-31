import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { mpmDataMock } from '@/lib/mpmMocks';
import FilterSection from '@/components/Filtering';
import Pagination from '@/components/Pagination';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

// Types
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria' | 'Number (Ton)';
type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';
type Perspective = 'Financial' | 'Customer' | 'Internal Process' | 'Learning and Growth';
type PeriodType = 'Monthly' | 'Quarterly' | 'Yearly';

type MPMEntry = {
    id: number;
    perspective: Perspective;
    kpi: string;
    kpiDefinition: string;
    weight: number;
    uom: UOMType;
    category: Category;
    ytdCalculation: YTDCalculation;
    targets: Record<string, number>;
    actuals: Record<string, number>;
    achievements: Record<string, number>;
    problemIdentification?: string;
    correctiveAction?: string;
    pic?: string;
};

const MPMDashboard: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedPeriodType, setSelectedPeriodType] = useState<PeriodType>('Monthly');
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    // Mock data
    const [mpmData, _] = useState<MPMEntry[]>(mpmDataMock);

    // Group data by perspective
    const groupedData = useMemo(() => {
        return mpmData.reduce((acc, curr) => {
            if (!acc[curr.perspective]) {
                acc[curr.perspective] = [];
            }
            acc[curr.perspective].push(curr);
            return acc;
        }, {} as Record<Perspective, MPMEntry[]>);
    }, [mpmData]);

    // Pagination state for each perspective
    const [currentPages, setCurrentPages] = useState<Record<Perspective, number>>({
        'Financial': 1,
        'Customer': 1,
        'Internal Process': 1,
        'Learning and Growth': 1
    });

    // Items per page state for each perspective
    const [itemsPerPage, setItemsPerPage] = useState<Record<Perspective, number>>({
        'Financial': 5,
        'Customer': 5,
        'Internal Process': 5,
        'Learning and Growth': 5
    });

    // Pagination expanded state for each perspective
    const [paginationExpanded, setPaginationExpanded] = useState<Record<Perspective, boolean>>({
        'Financial': false,
        'Customer': false,
        'Internal Process': false,
        'Learning and Growth': false
    });

    // Paginated and grouped data
    const paginatedGroupedData = useMemo(() => {
        const result: Record<Perspective, { items: MPMEntry[], totalPages: number, totalItems: number }> = {} as any;

        Object.entries(groupedData).forEach(([perspective, items]) => {
            const totalItems = items.length;
            const perspectiveItemsPerPage = itemsPerPage[perspective as Perspective];
            const totalPages = Math.ceil(totalItems / perspectiveItemsPerPage);
            const currentPage = currentPages[perspective as Perspective];
            const startIndex = (currentPage - 1) * perspectiveItemsPerPage;
            const endIndex = startIndex + perspectiveItemsPerPage;

            result[perspective as Perspective] = {
                items: items.slice(startIndex, endIndex),
                totalPages,
                totalItems
            };
        });

        return result;
    }, [groupedData, currentPages, itemsPerPage]);

    // Page change handler for a specific perspective
    const handlePageChange = (perspective: Perspective, newPage: number) => {
        setCurrentPages(prev => ({
            ...prev,
            [perspective]: newPage
        }));
    };

    // Items per page change handler for a specific perspective
    const handleItemsPerPageChange = (perspective: Perspective, value: string) => {
        const newItemsPerPage = parseInt(value);
        setItemsPerPage(prev => ({
            ...prev,
            [perspective]: newItemsPerPage
        }));

        // Reset to page 1 when changing items per page
        setCurrentPages(prev => ({
            ...prev,
            [perspective]: 1
        }));
    };

    // Toggle pagination expanded state
    const handleTogglePaginationExpand = (perspective: Perspective) => {
        setPaginationExpanded(prev => ({
            ...prev,
            [perspective]: !prev[perspective]
        }));
    };

    // Get current period based on selected period type
    const getCurrentPeriod = () => {
        const month = new Date().toLocaleString('default', { month: 'short' });
        switch (selectedPeriodType) {
            case 'Monthly':
                return `${month}-${selectedYear.slice(-2)}`;
            case 'Quarterly':
                const quarter = Math.floor((new Date().getMonth() + 3) / 3);
                return `Q${quarter}-${selectedYear.slice(-2)}`;
            case 'Yearly':
                return selectedYear;
            default:
                return `${month}-${selectedYear.slice(-2)}`;
        }
    };

    const currentPeriod = getCurrentPeriod();

    // Calculate Quarterly Performance
    const calculateQuarterlyPerformance = () => {
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        return quarters.map((quarter) => {
            const quarterKey = `${quarter}-${selectedYear.slice(-2)}`;

            // Calculate performance metrics for each quarter
            const onTrack = mpmData.filter(item =>
                item.achievements[quarterKey] >= 100
            ).length;

            const atRisk = mpmData.filter(item =>
                item.achievements[quarterKey] >= 90 && item.achievements[quarterKey] < 100
            ).length;

            const offTrack = mpmData.filter(item =>
                item.achievements[quarterKey] < 90
            ).length;

            // Calculate average completion
            const completion = mpmData.length > 0 ?
                mpmData.reduce((sum, item) => sum + (item.achievements[quarterKey] || 0), 0) / mpmData.length :
                0;

            return {
                quarter: quarterKey,
                completion,
                onTrack,
                atRisk,
                offTrack
            };
        });
    };

    const quarterlyPerformance = calculateQuarterlyPerformance();

    // Filter Dialog Component
    const FilterDialog = () => (
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter Performance Dashboard</DialogTitle>
                    <DialogDescription>
                        Select the year and period type to view performance data
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Year</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {['2023', '2024', '2025'].map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Period Type</Label>
                        <Select value={selectedPeriodType} onValueChange={(value) => setSelectedPeriodType(value as PeriodType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Period Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                <SelectItem value="Yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsFilterDialogOpen(false)}>
                        Apply Filter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    // Expanded Row Content
    const ExpandedContent = ({ item }: { item: MPMEntry }) => {
        const [viewType, setViewType] = useState<'table' | 'chart' | 'cards'>('table');
        const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

        // Get all months in chronological order
        const months = useMemo(() => {
            return Object.entries(item.targets)
                .filter(([key]) => key.includes('-25') && !key.startsWith('Q') && !key.startsWith('20'))
                .map(([month]) => month)
                .sort((a, b) => {
                    const monthA = a.split('-')[0];
                    const monthB = b.split('-')[0];
                    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
                });
        }, [item.targets]);

        // Calculate trend data for chart
        const chartData = useMemo(() => {
            return months.map(month => ({
                name: month,
                target: item.targets[month] || 0,
                actual: item.actuals[month] || 0,
                achievement: item.achievements[month] || 0
            }));
        }, [months, item]);

        // Get status color based on achievement value
        const getStatusColor = (achievement: number) => {
            if (achievement >= 100) return 'bg-green-500';
            if (achievement >= 90) return 'bg-amber-500';
            return 'bg-red-500';
        };

        // Get detailed info for a specific month
        const getMonthDetails = (month: string) => {
            return {
                target: item.targets[month] || 0,
                actual: item.actuals[month] || 0,
                achievement: item.achievements[month] || 0,
                status: item.achievements[month] >= 100 ? 'On Track' : (item.achievements[month] >= 90 ? 'At Risk' : 'Off Track')
            };
        };

        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
                {/* KPI Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">KPI Definition</h4>
                        <p className="text-sm">{item.kpiDefinition}</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">Calculation Method</h4>
                        <p className="text-sm">{item.ytdCalculation}</p>
                    </div>
                </div>

                {/* Problem and Corrective Action */}
                {(item.problemIdentification || item.correctiveAction) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-3 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
                        {item.problemIdentification && (
                            <div className="space-y-1">
                                <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center">
                                    <span className="mr-2">⚠️</span> Problem Identification
                                </h4>
                                <p className="text-sm">{item.problemIdentification}</p>
                            </div>
                        )}
                        {item.correctiveAction && (
                            <div className="space-y-1">
                                <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center">
                                    <span className="mr-2">🔧</span> Corrective Action
                                </h4>
                                <p className="text-sm">{item.correctiveAction}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Monthly Details Section */}
                <div className="mt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749] text-lg">Monthly Details</h4>

                        {/* View Type Toggle */}
                        <div className="mt-2 sm:mt-0 flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                            <button
                                className={`px-3 py-1 text-sm rounded-md ${viewType === 'table' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                                onClick={() => setViewType('table')}
                            >
                                Table
                            </button>
                            <button
                                className={`px-3 py-1 text-sm rounded-md ${viewType === 'chart' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                                onClick={() => setViewType('chart')}
                            >
                                Chart
                            </button>
                            <button
                                className={`px-3 py-1 text-sm rounded-md ${viewType === 'cards' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                                onClick={() => setViewType('cards')}
                            >
                                Cards
                            </button>
                        </div>
                    </div>

                    {/* Selected Month Detail View */}
                    {selectedMonth && (
                        <div className="mb-4 p-3 border-l-4 border-[#1B6131] bg-white dark:bg-gray-700 rounded shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium text-lg">{selectedMonth} Details</h5>
                                <button
                                    onClick={() => setSelectedMonth(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Target</div>
                                    <div className="text-lg font-medium">{getMonthDetails(selectedMonth).target}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Actual</div>
                                    <div className="text-lg font-medium">{getMonthDetails(selectedMonth).actual}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Achievement</div>
                                    <div className="text-lg font-medium">{getMonthDetails(selectedMonth).achievement}%</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm
                        ${getMonthDetails(selectedMonth).status === 'On Track' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                            getMonthDetails(selectedMonth).status === 'At Risk' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {getMonthDetails(selectedMonth).status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table View */}
                    {viewType === 'table' && (
                        <div className="bg-white dark:bg-gray-700 rounded-md shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actual</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Achievement</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                                    {months.map(month => (
                                        <tr
                                            key={month}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                            onClick={() => setSelectedMonth(month)}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">{month}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.targets[month]}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.actuals[month]}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.achievements[month]}%</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(item.achievements[month])}`}></span>
                                                {item.achievements[month] >= 100 ? 'On Track' :
                                                    (item.achievements[month] >= 90 ? 'At Risk' : 'Off Track')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Chart View */}
                    {viewType === 'chart' && (
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="h-64">
                                <LineChart width={window.innerWidth - 150} height={250} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="target" stroke="#8884d8" name="Target" yAxisId="left" />
                                    <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" yAxisId="left" />
                                    <Line type="monotone" dataKey="achievement" stroke="#ff7300" name="Achievement %" yAxisId="right" />
                                </LineChart>
                            </div>
                        </div>
                    )}

                    {/* Cards View */}
                    {viewType === 'cards' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {months.map(month => {
                                const achievement = item.achievements[month] || 0;
                                let statusClass = "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20";

                                if (achievement < 90) {
                                    statusClass = "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
                                } else if (achievement < 100) {
                                    statusClass = "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20";
                                }

                                return (
                                    <div
                                        key={month}
                                        className={`border rounded-md overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedMonth === month ? 'ring-2 ring-[#1B6131] dark:ring-[#46B749]' : statusClass
                                            }`}
                                        onClick={() => setSelectedMonth(month)}
                                    >
                                        <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 text-center font-medium">
                                            {month}
                                        </div>
                                        <div className="p-3 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Target:</span>
                                                <span className="font-medium">{item.targets[month]}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                                                <span className="font-medium">{item.actuals[month]}</span>
                                            </div>
                                            <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Achievement:</span>
                                                    <span className={`font-medium text-sm ${achievement >= 100 ? 'text-green-600 dark:text-green-400' :
                                                            achievement >= 90 ? 'text-amber-600 dark:text-amber-400' :
                                                                'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {achievement}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                                    <div
                                                        className={`h-1.5 rounded-full ${getStatusColor(achievement)}`}
                                                        style={{ width: `${Math.min(achievement, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="font-montserrat min-h-screen bg-white dark:bg-gray-900">
            <Header
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentSystem='Performance Management System'
            />

            <div className="flex flex-col md:flex-row">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    role={currentRole}
                    system="performance-management"
                />

                <main className={`flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out 
                    ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full`}>
                    <div className="space-y-6 w-full">
                        <Breadcrumb
                            items={[]}
                            currentPage="MPM Dashboard"
                            subtitle={`MPM ${currentRole == 'admin' ? 'Company' : 'IT Department'} Dashboard`}
                            showHomeIcon={true}
                        />

                        <FilterSection
                            handlePeriodChange={setSelectedYear}
                            selectedPeriod={selectedYear}
                            handleTypeChange={(value) => setSelectedPeriodType(value as PeriodType)}
                            selectedType={selectedPeriodType}
                        />

                        {/* Quarterly Performance Overview */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    Performance Overview - {selectedPeriodType}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {selectedPeriodType === 'Quarterly' ? (
                                        quarterlyPerformance.map((quarter) => (
                                            <Card key={quarter.quarter} className="shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-lg">
                                                        {quarter.quarter}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">
                                                                Completion
                                                            </span>
                                                            <span className="text-sm font-bold">
                                                                {quarter.completion.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className="bg-[#1B6131] h-2.5 rounded-full"
                                                                style={{ width: `${quarter.completion}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                                                                <span>On Track</span>
                                                            </div>
                                                            <span>{quarter.onTrack}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                                                                <span>At Risk</span>
                                                            </div>
                                                            <span>{quarter.atRisk}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                                                                <span>Off Track</span>
                                                            </div>
                                                            <span>{quarter.offTrack}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Card className="col-span-4 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">
                                                    {selectedPeriodType} Performance - {currentPeriod}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">
                                                                Average Achievement
                                                            </span>
                                                            <span className="text-sm font-bold">
                                                                {mpmData.length > 0 ?
                                                                    (mpmData.reduce((sum, item) => sum + (item.achievements[currentPeriod] || 0), 0) / mpmData.length).toFixed(1) + '%' :
                                                                    'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className="bg-[#1B6131] h-2.5 rounded-full"
                                                                style={{
                                                                    width: mpmData.length > 0 ?
                                                                        `${mpmData.reduce((sum, item) => sum + (item.achievements[currentPeriod] || 0), 0) / mpmData.length}%` :
                                                                        '0%'
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                                                                <span>On Track KPIs</span>
                                                            </div>
                                                            <span>
                                                                {mpmData.filter(item =>
                                                                    item.achievements[currentPeriod] >= 100
                                                                ).length}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                                                                <span>At Risk KPIs</span>
                                                            </div>
                                                            <span>
                                                                {mpmData.filter(item =>
                                                                    item.achievements[currentPeriod] >= 90 &&
                                                                    item.achievements[currentPeriod] < 100
                                                                ).length}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                                                                <span>Off Track KPIs</span>
                                                            </div>
                                                            <span>
                                                                {mpmData.filter(item =>
                                                                    item.achievements[currentPeriod] < 90
                                                                ).length}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="font-medium">Total Weight</span>
                                                            <span>
                                                                {mpmData.reduce((sum, item) => sum + item.weight, 0)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="font-medium">Total Score</span>
                                                            <span>
                                                                {mpmData.reduce((sum, item) => {
                                                                    const achievement = item.achievements[currentPeriod] || 0;
                                                                    return sum + (item.weight * Math.min(achievement, 120) / 100);
                                                                }, 0).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detailed Performance by Perspective */}
                        {Object.entries(paginatedGroupedData).map(([perspective, { items, totalPages, totalItems }]) => (
                            <Card key={perspective} className="border-[#46B749] dark:border-[#1B6131] shadow-md pb-4">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                                        {perspective} Perspective
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="m-0 p-0 pb-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-[#1B6131] text-white">
                                                <TableCell className="w-[50px]"></TableCell>
                                                <TableCell>KPI</TableCell>
                                                <TableCell className="text-center">Weight</TableCell>
                                                <TableCell className="text-center">UOM</TableCell>
                                                <TableCell className="text-center">Category</TableCell>
                                                <TableCell className="text-center">Target</TableCell>
                                                <TableCell className="text-center">Actual</TableCell>
                                                <TableCell className="text-center">Achievement</TableCell>
                                                <TableCell className="text-center">Score</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => (
                                                <React.Fragment key={item.id}>
                                                    <TableRow
                                                        className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20 cursor-pointer"
                                                        onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                                                    >
                                                        <TableCell>
                                                            {expandedRow === item.id ?
                                                                <ChevronDown className="h-4 w-4" /> :
                                                                <ChevronRight className="h-4 w-4" />}
                                                        </TableCell>
                                                        <TableCell>{item.kpi}</TableCell>
                                                        <TableCell className="text-center">{item.weight}%</TableCell>
                                                        <TableCell className="text-center">{item.uom}</TableCell>
                                                        <TableCell className="text-center">{item.category}</TableCell>
                                                        <TableCell className="text-center">
                                                            {item.targets[currentPeriod] ?? 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {item.actuals[currentPeriod] ?? 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {item.achievements[currentPeriod] ?
                                                                `${item.achievements[currentPeriod]}%` : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {item.achievements[currentPeriod] ?
                                                                ((item.weight * Math.min(item.achievements[currentPeriod], 120)) / 100).toFixed(1) : 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedRow === item.id && (
                                                        <TableRow>
                                                            <TableCell colSpan={9} className="p-0">
                                                                <ExpandedContent item={item} />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {/* Perspective Totals */}
                                            <TableRow className="font-bold bg-[#1B6131] text-white dark:bg-[#1B6131]">
                                                <TableCell colSpan={2}>Total</TableCell>
                                                <TableCell className="text-center">
                                                    {items.reduce((sum, item) => sum + item.weight, 0)}%
                                                </TableCell>
                                                <TableCell colSpan={5}></TableCell>
                                                <TableCell className="text-center">
                                                    {items.reduce((sum, item) => {
                                                        const achievement = item.achievements[currentPeriod] || 0;
                                                        return sum + (item.weight * Math.min(achievement, 120) / 100);
                                                    }, 0).toFixed(1)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                    {/* Updated Pagination Component */}
                                    <Pagination
                                        currentPage={currentPages[perspective as Perspective]}
                                        totalPages={totalPages}
                                        itemsPerPage={itemsPerPage[perspective as Perspective]}
                                        totalItems={totalItems}
                                        onPageChange={(page) => handlePageChange(perspective as Perspective, page)}
                                        onItemsPerPageChange={(value) => handleItemsPerPageChange(perspective as Perspective, value)}
                                        expanded={paginationExpanded[perspective as Perspective]}
                                        onToggleExpand={() => handleTogglePaginationExpand(perspective as Perspective)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>

            <FilterDialog />
        </div>
    );
}

export default MPMDashboard;