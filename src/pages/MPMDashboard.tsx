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

    const [currentPages, setCurrentPages] = useState<Record<Perspective, number>>({
        'Financial': 1,
        'Customer': 1,
        'Internal Process': 1,
        'Learning and Growth': 1
    });

    // Items per page
    const ITEMS_PER_PAGE = 5;

    // Paginated and grouped data
    const paginatedGroupedData = useMemo(() => {
        const result: Record<Perspective, { items: MPMEntry[], totalPages: number }> = {} as any;

        Object.entries(groupedData).forEach(([perspective, items]) => {
            const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
            const currentPage = currentPages[perspective as Perspective];
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;

            result[perspective as Perspective] = {
                items: items.slice(startIndex, endIndex),
                totalPages
            };
        });

        return result;
    }, [groupedData, currentPages, ITEMS_PER_PAGE]);

    // Page change handler for a specific perspective
    const handlePageChange = (perspective: Perspective, newPage: number) => {
        setCurrentPages(prev => ({
            ...prev,
            [perspective]: newPage
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
    const ExpandedContent = ({ item }: { item: MPMEntry }) => (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 space-y-2">
            <div>
                <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">KPI Definition</h4>
                <p>{item.kpiDefinition}</p>
            </div>
            <div>
                <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">Calculation Method</h4>
                <p>{item.ytdCalculation}</p>
            </div>

            {item.problemIdentification && (
                <div>
                    <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">Problem Identification</h4>
                    <p>{item.problemIdentification}</p>
                </div>
            )}

            {item.correctiveAction && (
                <div>
                    <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">Corrective Action</h4>
                    <p>{item.correctiveAction}</p>
                </div>
            )}

            <div>
                <h4 className="font-semibold text-[#1B6131] dark:text-[#46B749]">Monthly Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                    {Object.entries(item.targets)
                        .filter(([key]) => key.includes('-25') && !key.startsWith('Q') && !key.startsWith('20'))
                        .map(([month]) => (
                            <div key={month} className="border p-2 rounded">
                                <p className="font-medium">{month}</p>
                                <p>Target: {item.targets[month]}</p>
                                <p>Actual: {item.actuals[month]}</p>
                                <p>Achievement: {item.achievements[month]}%</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );

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
                            showHomeIcon={true}
                            subtitle={`Performance Year: ${selectedYear} | Period: ${selectedPeriodType} - ${currentPeriod}`}
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
                        {Object.entries(paginatedGroupedData).map(([perspective, { items, totalPages }]) => (
                            <Card key={perspective} className="border-[#46B749] dark:border-[#1B6131] shadow-md pb-4">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                                        {perspective} Perspective
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="m-0 p-0">
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

                                    {/* Pagination Component */}
                                    <Pagination
                                        currentPage={currentPages[perspective as Perspective]}
                                        totalPages={totalPages}
                                        onPageChange={(page) => handlePageChange(perspective as Perspective, page)}
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