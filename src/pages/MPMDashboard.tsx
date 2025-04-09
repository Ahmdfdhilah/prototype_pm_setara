import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { mpmDataMock } from '@/lib/mpmMocks';
import Filtering from '@/components/Filtering';
import Pagination from '@/components/Pagination';
import Footer from '@/components/Footer';
import { ExpandedContent } from '@/components/MPM/ExpandedContent';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedPeriodType, setSelectedPeriodType] = useState<PeriodType>('Monthly');
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    // Search functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerspective, setSelectedPerspective] = useState<string>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock data
    const [mpmData, _] = useState<MPMEntry[]>(mpmDataMock);

    // Filter and search data
    const filteredData = useMemo(() => {
        return mpmData.filter(item => {
            // Search term filter
            const matchesSearch =
                searchTerm === '' ||
                item.kpi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.kpiDefinition.toLowerCase().includes(searchTerm.toLowerCase());

            // Perspective filter
            const matchesPerspective =
                selectedPerspective === 'All' ||
                item.perspective === selectedPerspective;

            // Category filter
            const matchesCategory =
                selectedCategory === 'All' ||
                item.category === selectedCategory;

            return matchesSearch && matchesPerspective && matchesCategory;
        });
    }, [mpmData, searchTerm, selectedPerspective, selectedCategory]);

    // Handle pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    // Group paginated data by perspective for display
    const paginatedGroupedData = useMemo(() => {
        return paginatedData.reduce((acc, curr) => {
            if (!acc[curr.perspective]) {
                acc[curr.perspective] = [];
            }
            acc[curr.perspective].push(curr);
            return acc;
        }, {} as Record<Perspective, MPMEntry[]>);
    }, [paginatedData]);

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
    // Calculate totals
    const totals = useMemo(() => {
        const currentPeriod = getCurrentPeriod();
        return filteredData.reduce((acc, curr) => {
            const achievement = curr.achievements[currentPeriod] || 0;
            const score = (curr.weight * Math.min(achievement, 120) / 100);
            return {
                weight: acc.weight + curr.weight,
                score: acc.score + score,
            };
        }, {
            weight: 0,
            score: 0,
        });
    }, [filteredData, selectedYear, selectedPeriodType]);

    // Handler for perspective filter
    const handlePerspectiveChange = (value: string) => {
        setSelectedPerspective(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Handler for category filter
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Handler for search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Row expansion handler
    const handleRowClick = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    const currentPeriod = getCurrentPeriod();

    // Get unique perspectives for filter
    const perspectives = ['All', ...Array.from(new Set(mpmData.map(item => item.perspective)))];

    // Get unique categories for filter
    const categories = ['All', ...Array.from(new Set(mpmData.map(item => item.category)))];


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

                <div className={`flex flex-col mt-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full`}>
                    <main className='flex-1 px-2 md:px-4 pt-16 pb-12 transition-all duration-300 ease-in-out w-full'>
                        <div className="space-y-6 w-full">
                            <Breadcrumb
                                items={[]}
                                currentPage="MPM Dashboard"
                                subtitle={`MPM ${currentRole == 'admin' ? 'Company' : 'IT Department'} Dashboard`}
                                showHomeIcon={true}
                            />

                            {/* Enhanced Filtering with Search and Categories */}
                            <Filtering
                                handlePeriodChange={setSelectedYear}
                                selectedPeriod={selectedYear}
                                handleTypeChange={(value) => setSelectedPeriodType(value as PeriodType)}
                                selectedType={selectedPeriodType}
                            >
                                {/* Search Filter */}
                                <div className="space-y-3 md:col-span-2">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <Search className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                        <span>Search</span>
                                    </label>
                                    <Input
                                        placeholder="Search by KPI or Definition..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none"
                                    />
                                </div>

                                {/* Perspective Filter */}
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <span>Perspective</span>
                                    </label>
                                    <select
                                        value={selectedPerspective}
                                        onChange={(e) => handlePerspectiveChange(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none"
                                    >
                                        {perspectives.map((perspective) => (
                                            <option key={perspective} value={perspective}>
                                                {perspective}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category Filter */}
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <span>Category</span>
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Filtering>

                            {/* Performance Overview */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        Performance Overview - {selectedPeriodType}
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
                                                    {filteredData.length > 0 ?
                                                        (filteredData.reduce((sum, item) => sum + (item.achievements[currentPeriod] || 0), 0) / filteredData.length).toFixed(1) + '%' :
                                                        'N/A'}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-[#1B6131] h-2.5 rounded-full"
                                                    style={{
                                                        width: filteredData.length > 0 ?
                                                            `${Math.min(filteredData.reduce((sum, item) => sum + (item.achievements[currentPeriod] || 0), 0) / filteredData.length, 100)}%` :
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
                                                    {filteredData.filter(item =>
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
                                                    {filteredData.filter(item =>
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
                                                    {filteredData.filter(item =>
                                                        item.achievements[currentPeriod] < 90
                                                    ).length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">Total Weight</span>
                                                <span>
                                                    {totals.weight.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">Total Score</span>
                                                <span>
                                                    {totals.score.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* MPM Table */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md pb-8">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        MPM Performance Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="dark:bg-gray-900 m-0 p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-[#1B6131] text-white">
                                                <TableCell className="p-4 text-left font-medium text-white">Perspective</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">KPI</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">Weight</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">UOM</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">Category</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">Target</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">Actual</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">Achievement</TableCell>
                                                <TableCell className="p-4 text-left font-medium text-white">Score</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(paginatedGroupedData).map(([perspective, items]) => {
                                                // Create an array to track which items have expanded content
                                                const itemsWithExpanded = items.map(item => ({
                                                    ...item,
                                                    isExpanded: expandedRow === item.id
                                                }));

                                                // Calculate perspective subtotals once
                                                const perspectiveWeightTotal = items.reduce((sum, item) => sum + item.weight, 0).toFixed(1);
                                                const perspectiveScoreTotal = items.reduce((sum, item) => {
                                                    const achievement = item.achievements[currentPeriod] || 0;
                                                    return sum + ((item.weight * Math.min(achievement, 120)) / 100);
                                                }, 0).toFixed(1);

                                                return (
                                                    <React.Fragment key={perspective}>
                                                        {/* Render each item row */}
                                                        {itemsWithExpanded.map((item, index) => {
                                                            const isFirstInGroup = index === 0;
                                                            const totalRowsInPerspective = items.length +
                                                                itemsWithExpanded.filter(i => i.isExpanded).length + 1; 

                                                            return (
                                                                <React.Fragment key={item.id}>
                                                                    <TableRow
                                                                        onClick={() => handleRowClick(item.id)}
                                                                        className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20 cursor-pointer"
                                                                    >
                                                                        {isFirstInGroup && (
                                                                            <TableCell
                                                                                rowSpan={totalRowsInPerspective}
                                                                                className="bg-[#E4EFCF] dark:bg-[#1B6131]/30 font-medium text-[#1B6131] dark:text-[#46B749]"
                                                                            >
                                                                                {perspective}
                                                                            </TableCell>
                                                                        )}
                                                                        <TableCell className="flex items-center gap-2 text-[#1B6131] dark:text-[#46B749]">
                                                                            {item.isExpanded ? (
                                                                                <ChevronDown size={16} />
                                                                            ) : (
                                                                                <ChevronRight size={16} />
                                                                            )}
                                                                            {item.kpi}
                                                                        </TableCell>
                                                                        <TableCell>{item.weight}%</TableCell>
                                                                        <TableCell>{item.uom}</TableCell>
                                                                        <TableCell>{item.category}</TableCell>
                                                                        <TableCell>
                                                                            {item.targets[currentPeriod] ?? 'N/A'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.actuals[currentPeriod] ?? 'N/A'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.achievements[currentPeriod] ?
                                                                                `${item.achievements[currentPeriod]}%` : 'N/A'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.achievements[currentPeriod] ?
                                                                                ((item.weight * Math.min(item.achievements[currentPeriod], 120)) / 100).toFixed(1) : 'N/A'}
                                                                        </TableCell>
                                                                    </TableRow>

                                                                    {/* Show expanded content if row is expanded */}
                                                                    {item.isExpanded && (
                                                                        <TableRow>
                                                                            <TableCell colSpan={9} className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
                                                                                <ExpandedContent item={item} />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </React.Fragment>
                                                            );
                                                        })}

                                                        {/* Add perspective subtotal row ONCE per perspective group */}
                                                        <TableRow className="bg-[#E4EFCF]/50 dark:bg-[#1B6131]/30">
                                                            <TableCell colSpan={1} className="font-medium">
                                                                {perspective} Subtotal
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {perspectiveWeightTotal}%
                                                            </TableCell>
                                                            <TableCell colSpan={5}></TableCell>
                                                            <TableCell className="font-medium">
                                                                {perspectiveScoreTotal}
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                );
                                            })}

                                            {paginatedData.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                                        No results found. Try adjusting your filters.
                                                    </TableCell>
                                                </TableRow>
                                            )}

                                            {/* Totals Row - Only show when we have data */}
                                            {paginatedData.length > 0 && (
                                                <TableRow className="font-bold bg-[#1B6131] text-white dark:bg-[#1B6131]">
                                                    <TableCell colSpan={2}>Total</TableCell>
                                                    <TableCell>{totals.weight.toFixed(1)}%</TableCell>
                                                    <TableCell colSpan={5}></TableCell>
                                                    <TableCell>{totals.score.toFixed(1)}</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filteredData.length}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                     
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default MPMDashboard;