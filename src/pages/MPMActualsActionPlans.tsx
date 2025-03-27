import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
import { Edit, Info } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

type IndividualKPIActual = {
    id: string;
    name: string;
    position: string;
    target: number;
    actual: number;
    achievement: number;
    problemIdentification: string;
    rootCauseAnalysis: string;
    correctiveAction: string;
    status: 'On Track' | 'At Risk' | 'Off Track';
};

const MPMActualsActionPlans: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { mpmActualId, mpmId, teamId } = useParams<{
        mpmActualId: string,
        mpmId: string,
        teamId: string
    }>();
    const month = searchParams.get('month') || 'January';

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [isAddIndividualDialogOpen, setIsAddIndividualDialogOpen] = useState(false);
    const [isEditIndividualDialogOpen, setIsEditIndividualDialogOpen] = useState(false);
    const [selectedIndividual, setSelectedIndividual] = useState<IndividualKPIActual | null>(null);

    // Team and KPI Context
    const [teamContext] = useState({
        teamName: 'Sales Team',
        kpiName: 'Revenue Growth',
        perspective: 'Financial',
        teamTarget: 100000
    });

    // Individual Actuals State
    const [individualActuals, setIndividualActuals] = useState<IndividualKPIActual[]>([
        {
            id: '1',
            name: 'John Doe',
            position: 'Senior Sales Representative',
            target: 30000,
            actual: 28000,
            achievement: 93.33,
            problemIdentification: 'Lower performance in new market segment',
            rootCauseAnalysis: 'Insufficient product knowledge',
            correctiveAction: 'Additional training and product workshops',
            status: 'At Risk'
        },
        {
            id: '2',
            name: 'Jane Smith',
            position: 'Sales Representative',
            target: 25000,
            actual: 26500,
            achievement: 106,
            problemIdentification: '',
            rootCauseAnalysis: '',
            correctiveAction: '',
            status: 'On Track'
        }
    ]);

    // Calculations
    const calculateTeamTotals = useMemo(() => {
        return {
            totalTarget: individualActuals.reduce((sum, individual) => sum + individual.target, 0),
            totalActual: individualActuals.reduce((sum, individual) => sum + individual.actual, 0),
            averageAchievement: individualActuals.reduce((sum, individual) => sum + individual.achievement, 0) / individualActuals.length
        };
    }, [individualActuals]);

    // Handlers
    const handleAddIndividual = (newIndividual: IndividualKPIActual) => {
        setIndividualActuals(prev => [
            ...prev,
            {
                ...newIndividual,
                id: `${prev.length + 1}`,
                achievement: (newIndividual.actual / newIndividual.target) * 100
            }
        ]);
        setIsAddIndividualDialogOpen(false);
    };

    const handleEditIndividual = (updatedIndividual: IndividualKPIActual) => {
        setIndividualActuals(prev =>
            prev.map(individual =>
                individual.id === updatedIndividual.id
                    ? {
                        ...updatedIndividual,
                        achievement: (updatedIndividual.actual / updatedIndividual.target) * 100
                    }
                    : individual
            )
        );
        setIsEditIndividualDialogOpen(false);
    };

    // Individual Dialog Component
    const IndividualActualsDialog = ({
        isOpen,
        onClose,
        onSave,
        initialData
    }: {
        isOpen: boolean;
        onClose: () => void;
        onSave: (individual: IndividualKPIActual) => void;
        initialData?: IndividualKPIActual;
    }) => {
        const [formData, setFormData] = useState<IndividualKPIActual>(initialData || {
            id: '',
            name: '',
            position: '',
            target: 0,
            actual: 0,
            achievement: 0,
            problemIdentification: '',
            rootCauseAnalysis: '',
            correctiveAction: '',
            status: 'On Track'
        });

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {initialData ? 'Edit' : 'Add'} Individual KPI Actual
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Personal Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                />
                            </div>
                            <div>
                                <Label>Position</Label>
                                <Input
                                    value={formData.position}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        position: e.target.value
                                    }))}
                                />
                            </div>
                        </div>

                        {/* Targets and Actuals */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Target</Label>
                                <Input
                                    type="number"
                                    value={formData.target}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        target: Number(e.target.value)
                                    }))}
                                />
                            </div>
                            <div>
                                <Label>Actual</Label>
                                <Input
                                    type="number"
                                    value={formData.actual}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        actual: Number(e.target.value)
                                    }))}
                                />
                            </div>
                        </div>

                        {/* Problem Analysis */}
                        <div>
                            <Label>Problem Identification</Label>
                            <Input
                                value={formData.problemIdentification}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    problemIdentification: e.target.value
                                }))}
                                placeholder="Describe the specific problem"
                            />
                        </div>

                        <div>
                            <Label>Root Cause Analysis</Label>
                            <Input
                                value={formData.rootCauseAnalysis}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    rootCauseAnalysis: e.target.value
                                }))}
                                placeholder="Analyze the underlying causes"
                            />
                        </div>

                        <div>
                            <Label>Corrective Action</Label>
                            <Input
                                value={formData.correctiveAction}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    correctiveAction: e.target.value
                                }))}
                                placeholder="Propose solutions or improvements"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <Label>Status</Label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value as IndividualKPIActual['status']
                                }))}
                                className="w-full p-2 border rounded"
                            >
                                <option value="On Track">On Track</option>
                                <option value="At Risk">At Risk</option>
                                <option value="Off Track">Off Track</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => onSave(formData)}>
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
                    flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out 
                    ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full
                `}>
                    <div className="space-y-6 mb-16">
                        <Breadcrumb
                            items={[
                                { label: 'MPM Actuals', path: '/performance-management/mpm/actual' },
                                { label: `${month} Actuals`, path: `/performance-management/mpm/actual/${mpmActualId}?month=${month}`},
                                { label: `${month} Actuals`, path: `/performance-management/mpm/actual/${mpmActualId}/entri/${mpmId}/teams?month=${month}`}
                            ]}
                            currentPage="Individual Actuals"
                            subtitle={`MPM Actual ID: ${mpmActualId}  | Team ID: ${teamId} | Month: ${month}`}
                            showHomeIcon={true}
                        />

                        {/* Team and KPI Context Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    <Info className="mr-2 h-5 w-5" />
                                    KPI and Team Context
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749] mb-2">
                                            Team Information
                                        </h3>
                                        <p><strong>Team Name:</strong> {teamContext.teamName}</p>
                                        <p><strong>Team Target:</strong> {teamContext.teamTarget.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749] mb-2">
                                            KPI Details
                                        </h3>
                                        <p><strong>KPI Name:</strong> {teamContext.kpiName}</p>
                                        <p><strong>Perspective:</strong> {teamContext.perspective}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Individual Actuals Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        Individual KPI Actuals
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className='m-0 p-0 overflow-x-auto'>
                                <table className="w-full border-collapse">
                                    <thead className="bg-[#1B6131] text-white">
                                        <tr>
                                            <th className="p-3 text-center min-w-[100px]">Actions</th>
                                            <th className="p-3 min-w-[150px]">Name</th>
                                            <th className="p-3 min-w-[150px]">Position</th>
                                            <th className="p-3 text-center min-w-[100px]">Target</th>
                                            <th className="p-3 text-center min-w-[100px]">Actual</th>
                                            <th className="p-3 text-center min-w-[100px]">Achievement (%)</th>
                                            <th className="p-3 text-center min-w-[100px]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {individualActuals.map(individual => (
                                            <tr
                                                key={individual.id}
                                                className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20"
                                            >
                                                <td className="p-3 text-center">
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
                                                </td>
                                                <td className="p-3">{individual.name}</td>
                                                <td className="p-3">{individual.position}</td>
                                                <td className="p-3 text-center">{individual.target.toLocaleString()}</td>
                                                <td className="p-3 text-center">{individual.actual.toLocaleString()}</td>
                                                <td className={`p-3 text-center font-bold ${individual.achievement >= 100
                                                    ? 'text-green-600'
                                                    : individual.achievement >= 80
                                                        ? 'text-amber-600'
                                                        : 'text-red-600'
                                                    }`}>
                                                    {individual.achievement.toFixed(2)}%
                                                </td>
                                                <td className={`p-3 text-center font-bold ${individual.status === 'On Track'
                                                    ? 'text-green-600'
                                                    : individual.status === 'At Risk'
                                                        ? 'text-amber-600'
                                                        : 'text-red-600'
                                                    }`}>
                                                    {individual.status}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Team Totals Row */}
                                        <tr className="bg-[#1B6131] text-white font-bold">
                                            <td colSpan={3} className="p-3 text-center">Team Total</td>
                                            <td className="p-3 text-center">
                                                {calculateTeamTotals.totalTarget.toLocaleString()}
                                            </td>
                                            <td className="p-3 text-center">
                                                {calculateTeamTotals.totalActual.toLocaleString()}
                                            </td>
                                            <td className="p-3 text-center">
                                                {calculateTeamTotals.averageAchievement.toFixed(2)}%
                                            </td>
                                            <td className="p-3 text-center"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Dialogs */}
            <IndividualActualsDialog
                isOpen={isAddIndividualDialogOpen}
                onClose={() => setIsAddIndividualDialogOpen(false)}
                onSave={handleAddIndividual}
            />

            {selectedIndividual && (
                <IndividualActualsDialog
                    isOpen={isEditIndividualDialogOpen}
                    onClose={() => setIsEditIndividualDialogOpen(false)}
                    onSave={handleEditIndividual}
                    initialData={selectedIndividual}
                />
            )}
        </div>
    );
};

export default MPMActualsActionPlans;