import { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Sidebar from '@/components/Sidebar';
import {
    ChevronUp, ChevronDown, Minus, ChevronRight, ChevronDown as ExpandMore,

} from 'lucide-react';
import Header from '@/components/Header';
import FilterSection from '@/components/Filtering';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { dummyData } from '../lib/bscMocks';
import Breadcrumb from '@/components/Breadcrumb';
// Types
type Period = 'Jan-25' | 'Feb-25' | 'Mar-25' | 'Apr-25';
type BSCType = 'Monthly' | 'Quarterly' | 'Yearly';
type Perspective = 'Financial' | 'Customer' | 'Internal Business Process' | 'Learning & Growth';
type Category = 'Max' | 'Min' | 'On Target';
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria';

type BSCEntry = {
    perspective: Perspective;
    code: string;
    kpi: string;
    kpiDefinition: string;
    weight: number;
    uom: UOMType;
    category: Category;
    target: number;
    actual: number;
    achievement: number;
    score: number;
    activeWeight: number;
    totalScore: number;
    endScore: number;
    problemIdentification?: string;
    correctiveAction?: string;
    relatedPIC: string;
};

const BSCDashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('Jan-25');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [selectedType, setSelectedType] = useState<BSCType>('Monthly');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isEndDateDisabled, setIsEndDateDisabled] = useState<boolean>(false);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        if (selectedType !== 'Yearly') {
            setIsEndDateDisabled(true);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const handleTypeChange = (value: string) => {
        if (isBSCType(value)) {
            setSelectedType(value);
            if (value !== 'Yearly') {
                setIsEndDateDisabled(true);
                setEndDate('');
            } else {
                setIsEndDateDisabled(false);
            }
        }
    };

    const isBSCType = (value: string): value is BSCType => {
        return ['Monthly', 'Quarterly', 'Yearly'].includes(value);
    };


    // Group data by perspective
    const groupedData = useMemo(() => {
        return dummyData.reduce((acc, curr) => {
            if (!acc[curr.perspective]) {
                acc[curr.perspective] = [];
            }
            acc[curr.perspective].push(curr as BSCEntry);
            return acc;
        }, {} as Record<Perspective, BSCEntry[]>);
    }, [dummyData]);

    // Status indicator component
    const StatusIndicator: React.FC<{ value: number }> = ({ value }) => {
        if (value > 100) return <ChevronUp className="text-green-500" />;
        if (value < 100) return <ChevronDown className="text-red-500" />;
        return <Minus className="text-yellow-500" />;
    };

    // Calculate totals
    const totals = useMemo(() => {
        return dummyData.reduce((acc, curr) => ({
            weight: acc.weight + (curr.weight ?? 0),
            score: acc.score + (curr.score ?? 0),
            activeWeight: acc.activeWeight + (curr.activeWeight ?? 0),
            totalScore: acc.totalScore + (curr.totalScore ?? 0),
            endScore: acc.endScore + (curr.endScore ?? 0),
        }), {
            weight: 0,
            score: 0,
            activeWeight: 0,
            totalScore: 0,
            endScore: 0,
        });
    }, [dummyData]);

    const handleRowClick = (code: string) => {
        setExpandedRow(expandedRow === code ? null : code);
    };

    const handlePeriodChange = (value: string) => {
        if (isPeriod(value)) {
            setSelectedPeriod(value);
        }
    };

    const isPeriod = (value: string): value is Period => {
        return ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25'].includes(value);
    };

    const ExpandedContent = ({ item }: { item: BSCEntry }) => (
        <div className="space-y-2">
            <p className="text-[#1B6131] dark:text-[#46B749]">
                <strong>KPI Definition:</strong> {item.kpiDefinition}
            </p>
            {item.problemIdentification && (
                <p className="text-[#1B6131] dark:text-[#46B749]">
                    <strong>Problem Identification:</strong> {item.problemIdentification}
                </p>
            )}
            {item.correctiveAction && (
                <p className="text-[#1B6131] dark:text-[#46B749]">
                    <strong>Corrective Action:</strong> {item.correctiveAction}
                </p>
            )}
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

            <div className="flex">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    role={currentRole}
                    system="performance-management"
                />

                <main className={`flex-1 overflow-x-scroll px-8 pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
                    <div className="space-y-6">
                        <Breadcrumb
                            items={[]}
                            currentPage="BSC Dashboard"
                            showHomeIcon={true}
                        />


                        {/* Filter Section */}
                        <FilterSection
                            startDate={startDate}
                            endDate={endDate}
                            handleStartDateChange={handleStartDateChange}
                            handleEndDateChange={handleEndDateChange}
                            isEndDateDisabled={isEndDateDisabled}
                            handlePeriodChange={handlePeriodChange}
                            selectedPeriod={selectedPeriod}
                            handleTypeChange={handleTypeChange}
                            selectedType={selectedType}
                        />

                        {/* BSC Table Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    BSC Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="dark:bg-gray-900  mt-2 p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <th className="p-4 text-left font-medium text-white">Perspective</th>
                                            <th className="p-4 text-left font-medium text-white">Code</th>
                                            <th className="p-4 text-left font-medium text-white">KPI</th>
                                            <th className="p-4 text-left font-medium text-white">Weight</th>
                                            <th className="p-4 text-left font-medium text-white">UOM</th>
                                            <th className="p-4 text-left font-medium text-white">Category</th>
                                            <th className="p-4 text-left font-medium text-white">Target</th>
                                            <th className="p-4 text-left font-medium text-white">Actual</th>
                                            <th className="p-4 text-left font-medium text-white">Achievement</th>
                                            <th className="p-4 text-left font-medium text-white">Status</th>
                                            <th className="p-4 text-left font-medium text-white">Score</th>
                                            <th className="p-4 text-left font-medium text-white">Score Akhir</th>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(groupedData).map(([perspective, items]) => (
                                            items.map((item, index) => (
                                                <>
                                                    <TableRow
                                                        key={item.code}
                                                        onClick={() => handleRowClick(item.code)}
                                                        className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20"
                                                    >
                                                        {index === 0 && (
                                                            <TableCell
                                                                rowSpan={items.length}
                                                                className="bg-[#E4EFCF] dark:bg-[#1B6131]/30 font-medium text-[#1B6131] dark:text-[#46B749]"
                                                            >
                                                                {perspective}
                                                            </TableCell>
                                                        )}
                                                        <TableCell className="flex items-center gap-2 text-[#1B6131] dark:text-[#46B749]">
                                                            {expandedRow === item.code ? (
                                                                <ExpandMore size={16} />
                                                            ) : (
                                                                <ChevronRight size={16} />
                                                            )}
                                                            {item.code}
                                                        </TableCell>
                                                        <TableCell>{item.kpi}</TableCell>
                                                        <TableCell>{item.weight}%</TableCell>
                                                        <TableCell>{item.uom}</TableCell>
                                                        <TableCell>{item.category}</TableCell>
                                                        <TableCell>{item.target}</TableCell>
                                                        <TableCell>{item.actual}</TableCell>
                                                        <TableCell>{item.achievement}%</TableCell>
                                                        <TableCell>
                                                            <StatusIndicator value={item.achievement} />
                                                        </TableCell>
                                                        <TableCell>{item.score.toFixed(2)}</TableCell>
                                                        <TableCell>{item.endScore.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                    {expandedRow === item.code && (
                                                        <TableRow className="bg-[#E4EFCF]/30 dark:bg-[#1B6131]/10">
                                                            <TableCell colSpan={14}>
                                                                <ExpandedContent item={item} />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))
                                        ))}
                                        {/* Totals Row */}
                                        <TableRow className="font-bold bg-[#1B6131] text-white dark:bg-[#1B6131]">
                                            <TableCell colSpan={3}>Total</TableCell>
                                            <TableCell>{totals.weight.toFixed(2)}%</TableCell>
                                            <TableCell colSpan={6} children={undefined}></TableCell>
                                            <TableCell>{totals.score.toFixed(2)}</TableCell>
                                            <TableCell>{totals.endScore.toFixed(2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div >
        </div >
    );
};

export default BSCDashboard;