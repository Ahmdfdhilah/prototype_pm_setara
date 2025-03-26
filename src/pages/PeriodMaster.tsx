import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';

type PeriodStatus = 'Draft' | 'Active' | 'Closed';

interface Period {
    id: string;
    year: number;
    period: string;
    startDate: string;
    endDate: string;
    status: PeriodStatus;
    createdBy: string;
    createdAt: string;
}

// Dummy data
const initialPeriods: Period[] = [
    {
        id: '1',
        year: 2023,
        period: '1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'Closed',
        createdBy: 'SM_DEPT_USER',
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        year: 2024,
        period: '2',
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        status: 'Active',
        createdBy: 'SM_DEPT_USER',
        createdAt: '2024-02-01T00:00:00Z'
    },
    {
        id: '3',
        year: 2025,
        period: '3',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'Draft',
        createdBy: 'SM_DEPT_USER',
        createdAt: '2024-01-01T00:00:00Z'
    }
];

const PeriodMaster = () => {
    // Layout state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');

    // Period management state
    const [periods, setPeriods] = useState<Period[]>(initialPeriods);
    const [showNewPeriodDialog, setShowNewPeriodDialog] = useState(false);
    const [newPeriod, setNewPeriod] = useState({
        year: new Date().getFullYear(),
        period: '',
        startDate: '',
        endDate: '',
    });

    // Check if there's any active period
    const hasActivePeriod = periods.some(p => p.status === 'Active');

    const getStatusColor = (status: PeriodStatus) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500 text-white';
            case 'Closed':
                return 'bg-gray-500 text-white';
            case 'Draft':
                return 'bg-yellow-500 text-white';
        }
    };

    const handleCreatePeriod = () => {
        const periodExists = periods.some(p =>
            p.year === newPeriod.year &&
            p.period === newPeriod.period
        );

        if (periodExists) {
            alert('A period with these parameters already exists');
            return;
        }

        const newPeriodEntry: Period = {
            id: `${Date.now()}`,
            year: newPeriod.year,
            period: newPeriod.period,
            startDate: newPeriod.startDate,
            endDate: newPeriod.endDate,
            status: 'Draft',
            createdBy: 'SM_DEPT_USER',
            createdAt: new Date().toISOString(),
        };

        setPeriods(prev => [...prev, newPeriodEntry]);
        setShowNewPeriodDialog(false);
        setNewPeriod({
            year: new Date().getFullYear(),
            period: '',
            startDate: '',
            endDate: '',
        });
    };

    const handleStatusChange = (periodId: string, newStatus: PeriodStatus) => {
        if (newStatus === 'Active' && hasActivePeriod) {
            alert('Another period is already active. Please close it first.');
            return;
        }

        setPeriods(prev => prev.map(period => {
            if (period.id === periodId) {
                return { ...period, status: newStatus };
            }
            return period;
        }));
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
                            currentPage="Period Master Management"
                            showHomeIcon={true}
                        />

                        {/* Period Management Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131]">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex p-0">
                                        Period Table
                                    </CardTitle>
                                    <Button
                                        onClick={() => setShowNewPeriodDialog(true)}
                                        className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Create New Period
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="dark:bg-gray-900 mt-2 p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-4 text-left border-b">Year</th>
                                                <th className="p-4 text-left border-b">Period</th>
                                                <th className="p-4 text-left border-b">Start Date</th>
                                                <th className="p-4 text-left border-b">End Date</th>
                                                <th className="p-4 text-left border-b">Status</th>
                                                <th className="p-4 text-left border-b">Created By</th>
                                                <th className="p-4 text-left border-b">Created At</th>
                                                <th className="p-4 text-left border-b">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {periods.map((period) => (
                                                <tr
                                                    key={period.id}
                                                    className="border-b hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20"
                                                >
                                                    <td className="p-4">{period.year}</td>
                                                    <td className="p-4">{period.period}</td>
                                                    <td className="p-4">{period.startDate}</td>
                                                    <td className="p-4">{period.endDate}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(period.status)}`}>
                                                            {period.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">{period.createdBy}</td>
                                                    <td className="p-4">
                                                        {new Date(period.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        {period.status === 'Draft' && (
                                                            <Button
                                                                onClick={() => handleStatusChange(period.id, 'Active')}
                                                                className="mr-2 bg-green-500 hover:bg-green-600 text-white"
                                                                size="sm"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {period.status === 'Active' && (
                                                            <Button
                                                                onClick={() => handleStatusChange(period.id, 'Closed')}
                                                                className="bg-gray-500 hover:bg-gray-600 text-white"
                                                                size="sm"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </main>
            </div>

            {/* Create New Period Dialog */}
            <AlertDialog open={showNewPeriodDialog} onOpenChange={setShowNewPeriodDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create New Period</AlertDialogTitle>
                        <AlertDialogDescription>
                            Set up a new BSC period. Only one period can be active at a time.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Year</label>
                            <Input
                                type="number"
                                value={newPeriod.year}
                                onChange={(e) => setNewPeriod(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Start Date</label>
                            <Input
                                type="date"
                                value={newPeriod.startDate}
                                onChange={(e) => setNewPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">End Date</label>
                            <Input
                                type="date"
                                value={newPeriod.endDate}
                                onChange={(e) => setNewPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCreatePeriod}
                            className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                        >
                            Create Period
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PeriodMaster;