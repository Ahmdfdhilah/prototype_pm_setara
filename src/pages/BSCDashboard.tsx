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

// Types remain the same as before
type Period = 'Jan-25' | 'Feb-25' | 'Mar-25' | 'Apr-25';
type BSCType = 'Monthly' | 'Quarterly' | 'Yearly';
type Perspective = 'Financial' | 'Customer' | 'Internal Business Process' | 'Learning & Growth';
type Category = 'Max' | 'Min' | 'On Target';
type BSCEntry = {
    perspective: Perspective;
    code: string;
    kpi: string;
    kpiDefinition: string;
    weight: number;
    uom: string;
    category: Category;
    target: number | string;
    actual: number | string;
    achievement: number;
    score: number;
    activeWeight: number;
    totalScore: number;
    scoreAkhir: number;
    problemIdentification?: string;
    correctiveAction?: string;
};

// Table components with hover effects
const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full overflow-auto">
        <table className="w-full border-collapse">{children}</table>
    </div>
);

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <thead className="bg-[#1B6131]">{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <tbody>{children}</tbody>
);

const TableRow: React.FC<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}> = ({ children, className, onClick, hover = false }) => (
    <tr
        className={`border-b ${className || ''} ${hover ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
        onClick={onClick}
    >
        {children}
    </tr>
);

const TableCell: React.FC<{
    children: React.ReactNode;
    colSpan?: number;
    rowSpan?: number;
    className?: string;
}> = ({ children, colSpan, rowSpan, className }) => (
    <td className={`p-4 ${className || ''}`} colSpan={colSpan} rowSpan={rowSpan}>{children}</td>
);

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

    // Enhanced dummy data with multiple KPIs per perspective
    const dummyData: BSCEntry[] = [
        {
            perspective: 'Financial',
            code: 'F.1.1',
            kpi: 'Revenue Growth',
            kpiDefinition: 'Year over year revenue growth',
            weight: 15,
            uom: '%',
            category: 'Max',
            target: 20,
            actual: 18,
            achievement: 90,
            score: 0.15,
            activeWeight: 0.30,
            totalScore: 0.05,
            scoreAkhir: 0.05,
            problemIdentification: 'Slower market growth than expected',
            correctiveAction: 'Expand to new markets'
        }, {
            perspective: 'Financial',
            code: 'F.1.2',
            kpi: 'Profit Margin',
            kpiDefinition: 'Net profit margin percentage',
            weight: 10,
            uom: '%',
            category: 'Max',
            target: 15,
            actual: 16,
            achievement: 107,
            score: 0.10,
            activeWeight: 0.20,
            totalScore: 0.04,
            scoreAkhir: 0.04,
        },
        {
            perspective: 'Financial',
            code: 'F.1.3',
            kpi: 'Cost Reduction',
            kpiDefinition: 'Annual cost reduction target',
            weight: 8,
            uom: '%',
            category: 'Max',
            target: 5,
            actual: 3,
            achievement: 60,
            score: 0.08,
            activeWeight: 0.16,
            totalScore: 0.03,
            scoreAkhir: 0.03,
        },
        {
            perspective: 'Customer',
            code: 'C.1.1',
            kpi: 'Customer Satisfaction',
            kpiDefinition: 'Customer satisfaction score',
            weight: 12,
            uom: 'Score',
            category: 'Max',
            target: 4.5,
            actual: 4.3,
            achievement: 96,
            score: 0.12,
            activeWeight: 0.24,
            totalScore: 0.05,
            scoreAkhir: 0.05,
        },
        {
            perspective: 'Customer',
            code: 'C.1.2',
            kpi: 'Customer Retention',
            kpiDefinition: 'Customer retention rate',
            weight: 10,
            uom: '%',
            category: 'Max',
            target: 95,
            actual: 92,
            achievement: 97,
            score: 0.10,
            activeWeight: 0.20,
            totalScore: 0.04,
            scoreAkhir: 0.04,
        },
        {
            perspective: 'Internal Business Process',
            code: 'I.1.1',
            kpi: 'Process Efficiency',
            kpiDefinition: 'Process cycle time reduction',
            weight: 8,
            uom: 'Days',
            category: 'Min',
            target: 5,
            actual: 4,
            achievement: 120,
            score: 0.08,
            activeWeight: 0.16,
            totalScore: 0.03,
            scoreAkhir: 0.03,
        },
        {
            perspective: 'Internal Business Process',
            code: 'I.1.2',
            kpi: 'Quality Rate',
            kpiDefinition: 'Product quality pass rate',
            weight: 7,
            uom: '%',
            category: 'Max',
            target: 99,
            actual: 98.5,
            achievement: 99.5,
            score: 0.07,
            activeWeight: 0.14,
            totalScore: 0.03,
            scoreAkhir: 0.03,
        },
        {
            perspective: 'Learning & Growth',
            code: 'L.1.1',
            kpi: 'Employee Training',
            kpiDefinition: 'Training hours per employee',
            weight: 5,
            uom: 'Hours',
            category: 'Max',
            target: 40,
            actual: 35,
            achievement: 87.5,
            score: 0.05,
            activeWeight: 0.10,
            totalScore: 0.02,
            scoreAkhir: 0.02,
        },
        {
            perspective: 'Learning & Growth',
            code: 'L.1.2',
            kpi: 'Innovation Rate',
            kpiDefinition: 'New products/services launched',
            weight: 5,
            uom: 'Number',
            category: 'Max',
            target: 5,
            actual: 4,
            achievement: 80,
            score: 0.05,
            activeWeight: 0.10,
            totalScore: 0.02,
            scoreAkhir: 0.02,
        }
    ];

    // Group data by perspective
    const groupedData = useMemo(() => {
        return dummyData.reduce((acc, curr) => {
            if (!acc[curr.perspective]) {
                acc[curr.perspective] = [];
            }
            acc[curr.perspective].push(curr);
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
            weight: acc.weight + curr.weight,
            score: acc.score + curr.score,
            activeWeight: acc.activeWeight + curr.activeWeight,
            totalScore: acc.totalScore + curr.totalScore,
            scoreAkhir: acc.scoreAkhir + curr.scoreAkhir,
        }), {
            weight: 0,
            score: 0,
            activeWeight: 0,
            totalScore: 0,
            scoreAkhir: 0,
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
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Header
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
            />

            <div className="flex">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    role={currentRole}
                    system="performance-management"
                />

                <main className={`flex-1 px-8 pt-20 lg:ml-64 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-24' : 'ml-0'
                    }`}>
                    <div className="space-y-6">
                        {/* Header Section with Toggle Button */}
                        <div className="flex items-center justify-between mb-6 mt-4">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                                    Balanced Scorecard Dashboard
                                </h1>
                            </div>
                        </div>


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
                        <Card className="border-[#46B749] dark:border-[#1B6131]">
                            <CardHeader>
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                                    BSC Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="dark:bg-gray-900">
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
                                            <th className="p-4 text-left font-medium text-white">Active Weight</th>
                                            <th className="p-4 text-left font-medium text-white">Total Score</th>
                                            <th className="p-4 text-left font-medium text-white">Score Akhir</th>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(groupedData).map(([perspective, items]) => (
                                            items.map((item, index) => (
                                                <>
                                                    <TableRow
                                                        key={item.code}
                                                        hover
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
                                                        <TableCell>{item.activeWeight.toFixed(2)}</TableCell>
                                                        <TableCell>{item.totalScore.toFixed(2)}</TableCell>
                                                        <TableCell>{item.scoreAkhir.toFixed(2)}</TableCell>
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
                                            <TableCell>{totals.activeWeight.toFixed(2)}</TableCell>
                                            <TableCell>{totals.totalScore.toFixed(2)}</TableCell>
                                            <TableCell>{totals.scoreAkhir.toFixed(2)}</TableCell>
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