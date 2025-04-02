import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Eye, Info, PlusCircle, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

// Enhanced Types
type Perspective =
    | 'Financial'
    | 'Customer'
    | 'Internal Business Process'
    | 'Learning & Growth';

type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria';

type MPMEntry = {
    id?: number;
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
    id?: string;
    parentKPI: MPMEntry;
    teamName: string;
    teamWeight: number; // New: Team-specific weight allocation
    teamTarget: number;
    monthlyTargets: Record<string, number>;
    comments?: string; // Optional: Add comments for team strategy
};

const MPMTargetsTeamKPI: React.FC = () => {
    const { targetId, mpmId } = useParams<{ targetId: string, mpmId: string }>();

    const [parentKPIs, _] = useState<MPMEntry[]>([
        {
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
        }
    ]);

    // Enhanced Team KPI Action Plans with more flexible allocation
    const [teamKPIActionPlans, setTeamKPIActionPlans] = useState<TeamKPIActionPlan[]>([
        {
            id: '1',
            parentKPI: parentKPIs[0],
            teamName: 'Sales Team',
            teamWeight: 20, // Can be different from parent KPI weight
            teamTarget: 50000,
            monthlyTargets: {
                'Jan-25': 50000,
                'Feb-25': 60000,
                'Mar-25': 75000
            },
            comments: 'Focus on high-value client acquisition'
        },
        {
            id: '2',
            parentKPI: parentKPIs[0],
            teamName: 'Business Development',
            teamWeight: 10,
            teamTarget: 25000,
            monthlyTargets: {
                'Jan-25': 25000,
                'Feb-25': 30000,
                'Mar-25': 35000
            },
            comments: 'Explore new market segments'
        }
    ]);


    // State for UI and dialogs
     const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; 
    }
    return true; 
  });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [isAddActionPlanDialogOpen, setIsAddActionPlanDialogOpen] = useState(false);
    const [isEditActionPlanDialogOpen, setIsEditActionPlanDialogOpen] = useState(false);
    const [selectedActionPlan, setSelectedActionPlan] = useState<TeamKPIActionPlan | null>(null);
    const navigate = useNavigate();
    // Calculation of totals
    const calculateTotals = useMemo(() => {
        const totals: Record<string, number> = {
            'Jan-25': 0,
            'Feb-25': 0,
            'Mar-25': 0,
            total: 0
        };

        teamKPIActionPlans.forEach(plan => {
            Object.keys(plan.monthlyTargets).forEach(month => {
                totals[month as keyof typeof totals] += plan.monthlyTargets[month];
            });
            totals.total += plan.teamTarget;
        });

        return totals;
    }, [teamKPIActionPlans]);


    // Dialog for adding/editing team KPI action plans
    const TeamKPIActionPlanDialog = ({
        isOpen,
        onClose,
        onSave,
        initialData
    }: {
        isOpen: boolean;
        onClose: () => void;
        onSave: (actionPlan: TeamKPIActionPlan) => void;
        initialData?: TeamKPIActionPlan;
    }) => {
        const [formData, setFormData] = useState<TeamKPIActionPlan>(initialData || {
            parentKPI: parentKPIs[0],
            teamName: '',
            teamWeight: 0,
            teamTarget: 0,
            monthlyTargets: {
                'Jan-25': 0,
                'Feb-25': 0,
                'Mar-25': 0
            },
            comments: ''
        });

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md w-[95%] lg:max-w-2xl rounded-lg overflow-y-scroll max-h-[85vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {initialData ? 'Edit' : 'Add'} Team KPI Action Plan
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Parent KPI Selection */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Parent KPI</Label>
                            <Select
                                value={formData.parentKPI.id?.toString()}
                                onValueChange={(value) => {
                                    const selectedKPI = parentKPIs.find(kpi => kpi.id === Number(value));
                                    if (selectedKPI) {
                                        setFormData(prev => ({
                                            ...prev,
                                            parentKPI: selectedKPI
                                        }));
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Parent KPI" />
                                </SelectTrigger>
                                <SelectContent>
                                    {parentKPIs.map(kpi => (
                                        <SelectItem key={kpi.id} value={formData.parentKPI.id ? formData.parentKPI.id.toString() : ''}>
                                            {kpi.kpi} - {kpi.perspective}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                        </div>

                        {/* Team Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Team Name</Label>
                            <Input
                                value={formData.teamName}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    teamName: e.target.value
                                }))}
                                className="col-span-3"
                            />
                        </div>

                        {/* Team Target */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Team Target</Label>
                            <Input
                                type="number"
                                value={formData.teamTarget}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    teamTarget: Number(e.target.value)
                                }))}
                                className="col-span-3"
                            />
                        </div>

                        {/* Monthly Targets */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Monthly Targets</Label>
                            <div className="col-span-3 grid grid-cols-3 gap-2">
                                {Object.keys(formData.monthlyTargets).map(month => (
                                    <div key={month}>
                                        <Label>{month}</Label>
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
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Team Weight (%)</Label>
                        <Input
                            type="number"
                            value={formData.teamWeight}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                teamWeight: Number(e.target.value)
                            }))}
                            className="col-span-3"
                            max={100}
                            min={0}
                        />
                    </div>

                    {/* Optional: Comments Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Comments/Strategy</Label>
                        <Input
                            value={formData.comments || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                comments: e.target.value
                            }))}
                            className="col-span-3"
                            placeholder="Team's strategy or comments"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={() => onSave(formData)}
                            disabled={!formData.teamName || formData.teamTarget <= 0}
                        >
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    // Handlers for action plans
    const handleAddActionPlan = (newActionPlan: TeamKPIActionPlan) => {
        setTeamKPIActionPlans(prev => [...prev, { ...newActionPlan, id: `${prev.length + 1}` }]);
        setIsAddActionPlanDialogOpen(false);
    };

    const handleEditActionPlan = (updatedActionPlan: TeamKPIActionPlan) => {
        setTeamKPIActionPlans(prev =>
            prev.map(plan =>
                plan.id === updatedActionPlan.id ? updatedActionPlan : plan
            )
        );
        setIsEditActionPlanDialogOpen(false);
    };

    const handleDeleteActionPlan = (actionPlanId: string) => {
        setTeamKPIActionPlans(prev =>
            prev.filter(plan => plan.id !== actionPlanId)
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

                <main className={`
                     flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full
                `}>
                    <div className="space-y-6 w-full">
                        <Breadcrumb
                            items={[{
                                label: 'MPM Targets List',
                                path: '/performance-management/mpm/target',
                            }
                            ,
                            {
                                label: 'MPM Targets',
                                path: `/performance-management/mpm/target/${targetId}`,
                            }]}
                            currentPage="Team KPI Action Plans"
                            subtitle={`MPM Target ID: ${targetId} | Entry ID: ${mpmId}`}
                            showHomeIcon={true}
                        />

                        <Card className="border-[#1B6131] dark:border-[#46B749] shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                    <div>
                                        <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                            <Info className="mr-2 h-5 w-5" />
                                            KPI Details
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-300">
                                            Overview of the Key Performance Indicator
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => setIsAddActionPlanDialogOpen(true)}
                                        className="w-full sm:w-auto bg-[#1B6131] dark:text-white hover:bg-[#46B749] flex items-center justify-center"
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add KPI Action Plan
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-4 space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749]">KPI Information</h3>
                                        <div className="space-y-2">
                                            <p><strong>KPI Name:</strong> {parentKPIs[0].kpi}</p>
                                            <p><strong>Perspective:</strong> {parentKPIs[0].perspective}</p>
                                            <p><strong>KPI Number:</strong> {parentKPIs[0].kpiNumber}</p>
                                            <p><strong>Definition:</strong> {parentKPIs[0].kpiDefinition}</p>
                                            <p><strong>Weight:</strong> {parentKPIs[0].weight}%</p>
                                            <p><strong>Unit of Measurement:</strong> {parentKPIs[0].uom}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749] mb-2">Targets</h3>
                                    <div className="grid grid-cols-3 gap-2 bg-[#f9faf9] dark:bg-gray-800 p-3 rounded-md">
                                        {Object.entries(parentKPIs[0].targets).map(([month, target]) => (
                                            <div key={month} className="text-center">
                                                <p className="font-medium">{month}</p>
                                                <p className="text-[#1B6131] dark:text-[#46B749]">{target.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    Team KPI Action Plans
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='m-0 p-0'>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-4 text-center">Actions</th>
                                                <th className="p-4 text-center">Team</th>
                                                <th className="p-4 text-center">Team Target</th>
                                                <th>Team Weight</th>
                                                <th>Comments</th>
                                                <th className="p-4 text-center">Jan-25</th>
                                                <th className="p-4 text-center">Feb-25</th>
                                                <th className="p-4 text-center">Mar-25</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamKPIActionPlans.map((plan) => (
                                                <tr
                                                    key={plan.id}
                                                    className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20"
                                                >
                                                    <td className="p-4 text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:text-[#1B6131]"
                                                                onClick={() => navigate(`/performance-management/mpm/target/${targetId}/entri/${mpmId}/teams/${plan.teamName}`)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setSelectedActionPlan(plan);
                                                                    setIsEditActionPlanDialogOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteActionPlan(plan.id!)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">{plan.teamName}</td>
                                                    <td className="p-4 text-center">{plan.teamTarget}</td>
                                                    <td className="p-4 text-center">{plan.teamWeight}%</td>
                                                    <td className="p-4 text-center">{plan.comments}</td>
                                                    <td className="p-4 text-center">{plan.monthlyTargets['Jan-25']}</td>
                                                    <td className="p-4 text-center">{plan.monthlyTargets['Feb-25']}</td>
                                                    <td className="p-4 text-center">{plan.monthlyTargets['Mar-25']}</td>
                                                </tr>
                                            ))}
                                            {/* Total Row */}
                                            <tr className="bg-[#1B6131] text-white font-bold">
                                                <td className="p-4 text-center" colSpan={2}>Total</td>
                                                <td className="p-4 text-center">{calculateTotals.total}</td>
                                                <td className="p-4 text-center">{calculateTotals.totalWeight}%</td>
                                                <td className="p-4 text-center"></td>
                                                <td className="p-4 text-center">{calculateTotals['Jan-25']}</td>
                                                <td className="p-4 text-center">{calculateTotals['Feb-25']}</td>
                                                <td className="p-4 text-center">{calculateTotals['Mar-25']}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Dialogs */}
            <TeamKPIActionPlanDialog
                isOpen={isAddActionPlanDialogOpen}
                onClose={() => setIsAddActionPlanDialogOpen(false)}
                onSave={handleAddActionPlan}
            />

            {selectedActionPlan && (
                <TeamKPIActionPlanDialog
                    isOpen={isEditActionPlanDialogOpen}
                    onClose={() => setIsEditActionPlanDialogOpen(false)}
                    onSave={handleEditActionPlan}
                    initialData={selectedActionPlan}
                />
            )}
        </div>
    );
};

export default MPMTargetsTeamKPI;