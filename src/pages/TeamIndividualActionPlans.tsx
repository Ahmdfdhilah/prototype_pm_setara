import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, PlusCircle, Trash2, Info } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

// Types reflecting the multi-level performance management hierarchy
type Perspective =
    | 'Financial'
    | 'Customer'
    | 'Internal Business Process'
    | 'Learning & Growth';

type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria';

type ParentKPI = {
    id: number;
    perspective: Perspective;
    kpiNumber: number;
    kpi: string;
    kpiDefinition: string;
    weight: number;
    uom: UOMType;
    category: Category;
    ytdCalculation: YTDCalculation;
    targets: Record<string, number>;
};

type TeamKPIActionPlan = {
    id: string;
    parentKPI: ParentKPI;
    teamName: string;
    teamWeight: number;
    teamTarget: number;
    monthlyTargets: Record<string, number>;
    comments?: string;
};

type IndividualPerformanceEntry = {
    id: string;
    name: string;
    position: string;
    monthlyTargets: Record<string, number>;
    monthlyActuals: Record<string, number>;
    weight: number;
    teamWeight: number;
};

const TeamIndividualActionPlans: React.FC = () => {
    const { targetId, mpmId, teamId } = useParams<{ targetId: string, mpmId: string, teamId: string }>();

    // Predefined Parent KPI (mirroring the structure in the first document)
    const parentKPI: ParentKPI = {
        id: 1,
        perspective: 'Financial',
        kpiNumber: 1,
        kpi: 'Revenue Growth',
        kpiDefinition: 'Increase overall company revenue',
        weight: 30,
        uom: 'Number',
        category: 'Max',
        ytdCalculation: 'Accumulative',
        targets: {
            'Jan-25': 100000,
            'Feb-25': 120000,
            'Mar-25': 150000
        }
    };

    // State for team KPI action plans with individual breakdown
    const [teamActionPlan, _] = useState<TeamKPIActionPlan>({
        id: teamId || '1',
        parentKPI: parentKPI,
        teamName: 'Sales Team',
        teamWeight: 20,
        teamTarget: 75000,
        monthlyTargets: {
            'Jan-25': 50000,
            'Feb-25': 60000,
            'Mar-25': 75000
        },
        comments: 'Focus on high-value client acquisition'
    });

    const [individuals, setIndividuals] = useState<IndividualPerformanceEntry[]>([
        {
            id: 'sales-1',
            name: 'John Doe',
            position: 'Senior Sales Representative',
            monthlyTargets: {
                'Jan-25': 20000,
                'Feb-25': 22000,
                'Mar-25': 25000
            },
            monthlyActuals: {
                'Jan-25': 18000,
                'Feb-25': 21500,
                'Mar-25': 0
            },
            weight: 5,
            teamWeight: 20
        },
        {
            id: 'sales-2',
            name: 'Jane Smith',
            position: 'Sales Representative',
            monthlyTargets: {
                'Jan-25': 15000,
                'Feb-25': 16000,
                'Mar-25': 18000
            },
            monthlyActuals: {
                'Jan-25': 14000,
                'Feb-25': 15500,
                'Mar-25': 0
            },
            weight: 10,
            teamWeight: 15
        }
    ]);

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [isAddIndividualDialogOpen, setIsAddIndividualDialogOpen] = useState(false);
    const [isEditIndividualDialogOpen, setIsEditIndividualDialogOpen] = useState(false);
    const [selectedIndividual, setSelectedIndividual] = useState<IndividualPerformanceEntry | null>(null);

    // Calculations
    const calculateIndividualTotals = useMemo(() => {
        const totals: Record<string, { target: number, actual: number }> = {
            'Jan-25': { target: 0, actual: 0 },
            'Feb-25': { target: 0, actual: 0 },
            'Mar-25': { target: 0, actual: 0 }
        };

        individuals.forEach(individual => {
            Object.keys(individual.monthlyTargets).forEach(month => {
                totals[month].target += individual.monthlyTargets[month];
                totals[month].actual += individual.monthlyActuals[month] || 0;
            });
        });

        return totals;
    }, [individuals]);

    // Handlers for individual performance entries
    const handleAddIndividual = (newIndividual: IndividualPerformanceEntry) => {
        setIndividuals(prev => [
            ...prev,
            {
                ...newIndividual,
                id: `individual-${prev.length + 1}`
            }
        ]);
        setIsAddIndividualDialogOpen(false);
    };

    const handleEditIndividual = (updatedIndividual: IndividualPerformanceEntry) => {
        setIndividuals(prev =>
            prev.map(individual =>
                individual.id === updatedIndividual.id
                    ? updatedIndividual
                    : individual
            )
        );
        setIsEditIndividualDialogOpen(false);
    };

    const handleDeleteIndividual = (individualId: string) => {
        setIndividuals(prev =>
            prev.filter(individual => individual.id !== individualId)
        );
    };

    // Individual Performance Dialog Component
    const IndividualPerformanceDialog = ({
        isOpen,
        onClose,
        onSave,
        initialData
    }: {
        isOpen: boolean;
        onClose: () => void;
        onSave: (individual: IndividualPerformanceEntry) => void;
        initialData?: IndividualPerformanceEntry;
    }) => {
        const [formData, setFormData] = useState<IndividualPerformanceEntry>(initialData || {
            id: '',
            name: '',
            position: '',
            monthlyTargets: {
                'Jan-25': 0,
                'Feb-25': 0,
                'Mar-25': 0
            },
            monthlyActuals: {
                'Jan-25': 0,
                'Feb-25': 0,
                'Mar-25': 0
            },
            weight: 0,
            teamWeight: teamActionPlan.teamWeight
        });

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>
                            {initialData ? 'Edit' : 'Add'} Individual Performance
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Personal Information */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Position</Label>
                            <Input
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    position: e.target.value
                                }))}
                                className="col-span-3"
                            />
                        </div>

                        {/* Individual Weight */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Individual Weight (%)</Label>
                            <Input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    weight: Number(e.target.value)
                                }))}
                                className="col-span-3"
                                max={100}
                                min={0}
                            />
                        </div>

                        {/* Monthly Targets and Actuals */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Monthly Targets/Actuals</Label>
                            <div className="col-span-3 grid grid-cols-3 gap-2">
                                {Object.keys(formData.monthlyTargets).map(month => (
                                    <div key={month} className="space-y-2">
                                        <Label>{month}</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-xs">Target</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.monthlyTargets[month]}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        monthlyTargets: {
                                                            ...prev.monthlyTargets,
                                                            [month]: Number(e.target.value)
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Actual</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.monthlyActuals[month]}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        monthlyActuals: {
                                                            ...prev.monthlyActuals,
                                                            [month]: Number(e.target.value)
                                                        }
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={() => onSave(formData)}
                            disabled={!formData.name}
                        >
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="font-montserrat min-h-screen bg-white dark:bg-gray-900 pb-16">
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

                <main className={`
                flex-1 
                px-2 
                sm:px-4 
                lg:px-6 
                pt-16 
                sm:pt-18 
                lg:pt-20 
                mb-12
                transition-all 
                duration-300 
                ease-in-out 
                ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
                w-full
            `}>
                    <div className="space-y-6 mb-16">
                        <Breadcrumb
                            items={[{
                                label: 'MPM Targets List',
                                path: '/performance-management/mpm/target',
                            }, {
                                label: 'MPM Targets',
                                path: '/performance-management/mpm/target',
                            }, {
                                label: 'Team KPI Action Plans',
                                path: `/performance-management/mpm/target/${targetId}/entri/${mpmId}/teams`,
                            }]}
                            currentPage="Individual Performance Breakdown"
                            subtitle={`MPM Target ID: ${targetId} | Entri ID: ${mpmId} | Team ID: ${teamId}`}
                            showHomeIcon={true}
                        />

                        {/* Team KPI Details Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    <Info className="mr-2 h-5 w-5" />
                                    Team KPI Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749] mb-2">
                                            Team Information
                                        </h3>
                                        <p><strong>Team Name:</strong> {teamActionPlan.teamName}</p>
                                        <p><strong>Team Weight:</strong> {teamActionPlan.teamWeight}%</p>
                                        <p><strong>Team Target:</strong> {teamActionPlan.teamTarget}</p>
                                        <p><strong>Comments:</strong> {teamActionPlan.comments}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749] mb-2">
                                            Parent KPI Details
                                        </h3>
                                        <p><strong>KPI:</strong> {teamActionPlan.parentKPI.kpi}</p>
                                        <p><strong>Perspective:</strong> {teamActionPlan.parentKPI.perspective}</p>
                                        <p><strong>Overall Weight:</strong> {teamActionPlan.parentKPI.weight}%</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749] mb-2">
                                        Monthly Targets
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2 bg-[#f9faf9] dark:bg-gray-800 p-3 rounded-md">
                                        {Object.entries(teamActionPlan.monthlyTargets).map(([month, target]) => (
                                            <div key={month} className="text-center">
                                                <p className="font-medium">{month}</p>
                                                <p className="text-[#1B6131] dark:text-[#46B749]">
                                                    {target.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Individual Performance Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center justify-between">
                                        Individual Performance Entries
                                    </CardTitle>
                                    <Button
                                        onClick={() => setIsAddIndividualDialogOpen(true)}
                                        className="w-full sm:w-auto bg-[#1B6131] dark:text-white hover:bg-[#46B749] flex items-center justify-center"
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Individual
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='mt-2 p-0 overflow-x-auto'>
                                <table className="w-full border-collapse">
                                    <thead className="bg-[#1B6131] text-white">
                                        <tr>
                                            <th className="p-3 text-center min-w-[100px]">Actions</th>
                                            <th className="p-3 min-w-[150px]">Name</th>
                                            <th className="p-3 min-w-[150px]">Position</th>
                                            <th className="p-3 text-center min-w-[100px]">Weight</th>
                                            <th className="p-3 text-center min-w-[100px]">Jan-25</th>
                                            <th className="p-3 text-center min-w-[100px]">Feb-25</th>
                                            <th className="p-3 text-center min-w-[100px]">Mar-25</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {individuals.map(individual => (
                                            <tr
                                                key={individual.id}
                                                className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20"
                                            >
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedIndividual(individual);
                                                                setIsEditIndividualDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteIndividual(individual.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="p-3">{individual.name}</td>
                                                <td className="p-3">{individual.position}</td>
                                                <td className="p-3 text-center">{individual.weight}%</td>
                                                {(['Jan-25', 'Feb-25', 'Mar-25'] as const).map(month => (
                                                    <td key={month} className="p-3 text-center">
                                                        <div className="flex flex-col">
                                                            <span className="dark:text-white">
                                                                T: {individual.monthlyTargets[month]}
                                                            </span>
                                                            <span
                                                                className={`
                                                                font-bold 
                                                                ${individual.monthlyActuals[month] >= individual.monthlyTargets[month]
                                                                        ? 'text-green-600'
                                                                        : individual.monthlyActuals[month] >= individual.monthlyTargets[month] * 0.8
                                                                            ? 'text-amber-600'
                                                                            : 'text-red-600'
                                                                    }
                                                            `}
                                                            >
                                                                A: {individual.monthlyActuals[month] || '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        {/* Team Totals Row */}
                                        <tr className="bg-[#1B6131] text-white font-bold">
                                            <td colSpan={3} className="p-3 text-center">Team Total</td>
                                            <td className="p-3 text-center">
                                                {individuals.reduce((sum, ind) => sum + ind.weight, 0)}%
                                            </td>
                                            {(['Jan-25', 'Feb-25', 'Mar-25'] as const).map(month => {
                                                const monthTotals = calculateIndividualTotals[month];
                                                return (
                                                    <td key={month} className="p-3 text-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-white">
                                                                T: {monthTotals.target}
                                                            </span>
                                                            <span
                                                                className={`
                                                                font-bold 
                                                                ${monthTotals.actual >= monthTotals.target
                                                                        ? 'text-green-600'
                                                                        : monthTotals.actual >= monthTotals.target * 0.8
                                                                            ? 'text-amber-600'
                                                                            : 'text-red-600'
                                                                    }
                                                            `}
                                                            >
                                                                A: {monthTotals.actual}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Dialogs */}
            <IndividualPerformanceDialog
                isOpen={isAddIndividualDialogOpen}
                onClose={() => setIsAddIndividualDialogOpen(false)}
                onSave={handleAddIndividual}
            />

            {selectedIndividual && (
                <IndividualPerformanceDialog
                    isOpen={isEditIndividualDialogOpen}
                    onClose={() => setIsEditIndividualDialogOpen(false)}
                    onSave={handleEditIndividual}
                    initialData={selectedIndividual}
                />
            )}
        </div>
    );
};

export default TeamIndividualActionPlans;