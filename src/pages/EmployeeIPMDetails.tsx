import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    Save,
    CheckCircle2,
    XCircle,
    Upload,
    FileText,
    Eye,
    AlertCircle,
    User,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Pagination from '@/components/Pagination';
import { Textarea } from '@/components/ui/textarea';
import Breadcrumb from '@/components/Breadcrumb';
import { useParams } from 'react-router-dom';
import Filtering from '@/components/Filtering';
import Footer from '@/components/Footer';

// Types
type IPMStatus = 'Pending' | 'Evidence Submitted' | 'Approved' | 'Rejected';
type Perspective = 'Financial' | 'Customer' | 'Internal Business Process' | 'Learning & Growth';
type Unit = 'IT' | 'Marketing' | 'Sales' | 'Operations' | 'Customer Service' | 'Finance';
type Position = 'Employee' | 'Manager' | 'Senior Manager' | 'Admin';

interface Employee {
    id: string;
    name: string;
    employeeNumber: string;
    department: string;
    position: Position;
    unit: Unit;
}

interface Evidence {
    id: string;
    fileName: string;
    uploadDate: string;
    comments?: string;
}

interface IPMEntry {
    id: string;
    title: string;
    description: string;
    status: IPMStatus;
    targetValue: number;
    actualValue?: number;
    weight: number;
    perspective: Perspective;
    employee: Employee;
    evidence: Evidence[];
}

const EmployeeIPMDetailsPage = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState<{ [key: string]: boolean }>({});
    const [currentRole, setCurrentRole] = useState('admin'); // employee, manager, sm_dept, admin
    const [evidenceComment, setEvidenceComment] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [paginationExpanded, _] = useState(false);
    const [expanded, setExpanded] = useState(true);

    const [filterStatus, setFilterStatus] = useState('');
    const [filterPerspective, setFilterPerspective] = useState('');
    const [actualValueInput, setActualValueInput] = useState<{ [key: string]: number }>({});

    // Mock data for employee - would normally fetch based on employeeId
    const [employee, _setEmployee] = useState<Employee>({
        id: '2',
        name: 'Jane Smith',
        employeeNumber: 'EMP002',
        department: 'Customer Experience',
        position: 'Employee',
        unit: 'Customer Service'
    });

    // Mock data for action plans from MPM for this specific employee
    const [entries, setEntries] = useState<IPMEntry[]>([
        {
            id: '1',
            title: 'Increase Customer Satisfaction Rating',
            description: 'Achieve a minimum of 90% satisfaction rating from customer feedback surveys',
            status: 'Pending',
            targetValue: 90,
            weight: 30,
            perspective: 'Customer',
            employee: employee,
            evidence: []
        },
        {
            id: '2',
            title: 'Reduce Response Time',
            description: 'Decrease average ticket response time to under 2 hours',
            status: 'Evidence Submitted',
            targetValue: 2,
            weight: 25,
            perspective: 'Internal Business Process',
            employee: employee,
            evidence: [
                {
                    id: '1001',
                    fileName: 'response_time_metrics_q1.pdf',
                    uploadDate: '2025-02-15',
                    comments: 'Mid-quarter progress report showing 30% improvement in response time'
                }
            ]
        },
        {
            id: '3',
            title: 'Complete Advanced Customer Service Training',
            description: 'Finish the certification program for advanced customer handling techniques',
            status: 'Approved',
            targetValue: 1,
            actualValue: 1,
            weight: 15,
            perspective: 'Learning & Growth',
            employee: employee,
            evidence: [
                {
                    id: '1002',
                    fileName: 'certification_completion.pdf',
                    uploadDate: '2025-03-10',
                    comments: 'Completed certification with distinction'
                }
            ]
        },
        {
            id: '4',
            title: 'Implement New Customer Feedback System',
            description: 'Roll out and train staff on the new feedback collection platform',
            status: 'Approved',
            targetValue: 1,
            actualValue: 1,
            weight: 20,
            perspective: 'Internal Business Process',
            employee: employee,
            evidence: [
                {
                    id: '1003',
                    fileName: 'feedback_system_implementation.pdf',
                    uploadDate: '2025-02-25',
                    comments: 'Implementation completed ahead of schedule with full staff training'
                }
            ]
        },
        {
            id: '5',
            title: 'Reduce Customer Churn Rate',
            description: 'Implement retention strategies to reduce monthly churn by 15%',
            status: 'Pending',
            targetValue: 15,
            weight: 10,
            perspective: 'Financial',
            employee: employee,
            evidence: []
        }
    ]);

    // Get summary counts
    const pendingCount = entries.filter(e => e.status === 'Pending').length;
    const inProgressCount = entries.filter(e => e.status === 'Evidence Submitted').length;
    const completedCount = entries.filter(e => e.status === 'Approved').length;

    // Filter entries based on selected filters
    const filteredEntries = entries.filter(entry => {
        const statusMatch = filterStatus ? entry.status === filterStatus : true;
        const perspectiveMatch = filterPerspective ? entry.perspective === filterPerspective : true;
        return statusMatch && perspectiveMatch;
    });

    // Get current entries for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEntries = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
        setCurrentPage(1);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Handler for file selection
    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Handler for evidence upload
    const handleUploadEvidence = (entryId: string) => {
        if (!selectedFile) return;

        const newEvidence: Evidence = {
            id: Date.now().toString(),
            fileName: selectedFile.name,
            uploadDate: new Date().toISOString().split('T')[0],
            comments: evidenceComment
        };

        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? {
                    ...entry,
                    evidence: [...entry.evidence, newEvidence],
                    status: 'Evidence Submitted',
                }
                : entry
        ));

        setSelectedFile(null);
        setEvidenceComment('');
    };

    const handleReviewActionPlan = (entryId: string, action: 'approve' | 'reject') => {
        const entry = entries.find(e => e.id === entryId);
        if (!entry) return;

        // Check if current user has permission to approve this entry
        const canApprove = checkApprovalPermission(currentRole, entry.employee.position);
        if (!canApprove) return;

        setEntries(prev => prev.map(entry => {
            if (entry.id !== entryId) return entry;

            // If approve
            if (action === 'approve') {
                // Ensure actual value is filled
                if (actualValueInput[entryId] === undefined) {
                    // Could add validation or error message
                    return entry;
                }

                const updatedEntry: IPMEntry = {
                    ...entry,
                    status: 'Approved',
                    actualValue: actualValueInput[entryId]
                };

                return updatedEntry;
            }

            // If reject
            if (action === 'reject') {
                const updatedEntry: IPMEntry = {
                    ...entry,
                    status: 'Rejected',
                };

                return updatedEntry;
            }

            return entry;
        }));

        // Tutup dialog setelah aksi
        setReviewDialogOpen(prev => ({ ...prev, [entryId]: false }));
    };

    // Add this helper function to check approval permissions
    const checkApprovalPermission = (currentRole: string, employeePosition: Position): boolean => {
        switch (currentRole) {
            case 'admin':
                return true; // Admin can approve everything
            case 'sm_dept':
                return employeePosition === 'Manager' || employeePosition === 'Employee';
            case 'manager':
                return employeePosition === 'Employee';
            default:
                return false;
        }
    };

    // Helper function to get status color classes with dark mode support
    const getStatusColor = (status: IPMStatus) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200';
            case 'Evidence Submitted':
                return 'bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
            case 'Approved':
                return 'bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200';
            case 'Rejected':
                return 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const canReviewEntry = (entry: IPMEntry): boolean => {
        // Admin can review all
        if (currentRole === 'admin') return true;

        // Senior Manager can review Manager and Employee
        if (currentRole === 'sm_dept') {
            return entry.employee.position === 'Manager' || entry.employee.position === 'Employee';
        }

        // Manager can only review Employee
        if (currentRole === 'manager') {
            return entry.employee.position === 'Employee';
        }

        return false;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-montserrat overflow-x-hidden">
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

                <div className={`flex flex-col mt-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full`}>
                    <main className='flex-1 px-2  md:px-4  pt-16 pb-12 transition-all duration-300 ease-in-out  w-full'>
                        <div className="space-y-6 w-full">
                            <Breadcrumb
                                items={[{
                                    label: 'Individual Performance Management',
                                    path: '/performance-management/ipm',
                                }]}
                                currentPage="Team KPI Action Plans"
                                subtitle={`Employee ID: ${employeeId}`}
                                showHomeIcon={true}
                            />

                            <h1 className="text-xl md:text-2xl font-bold text-[#1B6131] dark:text-[#46B749] mt-4">
                            </h1>

                            {/* Employee Info Card */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md w-full">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-base md:text-lg text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        <User className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                                        Employee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 mt-4">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        <div className="mb-4 md:mb-0">
                                            <h2 className="text-lg md:text-xl font-semibold">{employee.name}</h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{employee.employeeNumber}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{employee.department} • {employee.unit}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                                            <div className="p-2 md:p-3 text-center bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                                <h3 className="font-medium text-xs md:text-sm text-[#1B6131] dark:text-[#46B749]">Pending</h3>
                                                <p className="text-base md:text-lg font-bold">{pendingCount}</p>
                                            </div>
                                            <div className="p-2 md:p-3 text-center bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                                <h3 className="font-medium text-xs md:text-sm text-[#1B6131] dark:text-[#46B749]">In Progress</h3>
                                                <p className="text-base md:text-lg font-bold">{inProgressCount}</p>
                                            </div>
                                            <div className="p-2 md:p-3 text-center bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                                <h3 className="font-medium text-xs md:text-sm text-[#1B6131] dark:text-[#46B749]">Completed</h3>
                                                <p className="text-base md:text-lg font-bold">{completedCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Filtering>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <User className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                        <span>Status</span>
                                    </label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Evidence Submitted">Evidence Submitted</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <User className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                        <span>Status</span>
                                    </label>
                                    <Select value={filterPerspective} onValueChange={setFilterPerspective}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter Perspective" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Perspectives</SelectItem>
                                            <SelectItem value="Financial">Financial</SelectItem>
                                            <SelectItem value="Customer">Customer</SelectItem>
                                            <SelectItem value="Internal Business Process">Internal Business Process</SelectItem>
                                            <SelectItem value="Learning & Growth">Learning & Growth</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Filtering>

                            {/* IPM Entries */}
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md w-full">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-base md:text-lg text-[#1B6131] dark:text-[#46B749] flex flex-col sm:flex-row justify-between items-center">
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            <FileText className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                                            Action Plans
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='m-0 p-0'>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px]">
                                            <thead className="bg-[#1B6131] text-white">
                                                <tr>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Title</th>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Perspective</th>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Target</th>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Actual</th>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Weight</th>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Status</th>
                                                    <th className="p-2 md:p-4 text-left text-xs md:text-sm">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentEntries.length > 0 ? (
                                                    currentEntries.map((entry) => (
                                                        <tr key={entry.id} className="border-b hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20">
                                                            <td className="p-2 md:p-4">
                                                                <p className="font-medium text-xs md:text-sm">{entry.title}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{entry.description}</p>
                                                            </td>
                                                            <td className="p-2 md:p-4 text-xs md:text-sm">{entry.perspective}</td>
                                                            <td className="p-2 md:p-4 text-xs md:text-sm">{entry.targetValue}</td>
                                                            <td className="p-2 md:p-4 text-xs md:text-sm">
                                                                {entry.actualValue !== undefined ? (
                                                                    <span className="text-[#1B6131] dark:text-[#46B749]">
                                                                        {entry.actualValue}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[#1B6131] dark:text-[#46B749]">
                                                                        -
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-2 md:p-4 text-xs md:text-sm">{entry.weight}%</td>
                                                            <td className="p-2 md:p-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                                                                    {entry.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex space-x-2">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="text-[#1B6131] border-[#1B6131] hover:bg-[#f0f9f0] dark:text-[#46B749] dark:border-[#46B749] dark:hover:bg-[#0a2e14]"
                                                                            >
                                                                                <Eye className="h-4 w-4 mr-1" />
                                                                                View
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-w-md w-[95%] lg:max-w-2xl rounded-lg overflow-y-scroll max-h-[85vh]">
                                                                            <DialogHeader>
                                                                                <DialogTitle>IPM Details</DialogTitle>
                                                                            </DialogHeader>
                                                                            <div className="space-y-4 mt-4">
                                                                                <div>
                                                                                    <h3 className="font-medium">Title</h3>
                                                                                    <p>{entry.title}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <h3 className="font-medium">Description</h3>
                                                                                    <p>{entry.description}</p>
                                                                                </div>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <h3 className="font-medium">Perspective</h3>
                                                                                        <p>{entry.perspective}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h3 className="font-medium">Weight</h3>
                                                                                        <p>{entry.weight}%</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h3 className="font-medium">Target Value</h3>
                                                                                        <p>{entry.targetValue}</p>
                                                                                    </div>
                                                                                    {entry.actualValue !== undefined && (
                                                                                        <div>
                                                                                            <h3 className="font-medium">Actual Value</h3>
                                                                                            <p>{entry.actualValue}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <h3 className="font-medium">Status</h3>
                                                                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                                                                                            {entry.status}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                <div>
                                                                                    <h3 className="font-medium">Evidence</h3>
                                                                                    {entry.evidence.length > 0 ? (
                                                                                        <div className="space-y-2 mt-2">
                                                                                            {entry.evidence.map(ev => (
                                                                                                <div key={ev.id} className="p-3 border rounded-md">
                                                                                                    <div className="flex items-center">
                                                                                                        <FileText className="h-4 w-4 mr-2 text-[#1B6131]" />
                                                                                                        <p className="font-medium">{ev.fileName}</p>
                                                                                                    </div>
                                                                                                    <p className="text-sm mt-1">Uploaded: {ev.uploadDate}</p>
                                                                                                    {ev.comments && (
                                                                                                        <p className="text-sm mt-1">{ev.comments}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p className="text-sm text-gray-500 mt-1">No evidence submitted yet</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>

                                                                    {/* Evidence Upload Button - Only for employee role */}
                                                                    {currentRole === 'employee' && entry.status !== 'Approved' && (
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="text-[#1B6131] border-[#1B6131] hover:bg-[#f0f9f0] dark:text-[#46B749] dark:border-[#46B749] dark:hover:bg-[#0a2e14]"
                                                                                >
                                                                                    <Upload className="h-4 w-4 mr-1" />
                                                                                    Evidence
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-md w-[95%] lg:max-w-2xl rounded-lg overflow-y-scroll max-h-[85vh]">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Upload Evidence</DialogTitle>
                                                                                </DialogHeader>
                                                                                <div className="space-y-4 mt-4">
                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Action Plan</label>
                                                                                        <p className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                                                                                            {entry.title}
                                                                                        </p>
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Upload File</label>
                                                                                        <Input
                                                                                            type="file"
                                                                                            onChange={handleSelectFile}
                                                                                        />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label className="block text-sm font-medium mb-1">Comments</label>
                                                                                        <Textarea
                                                                                            value={evidenceComment}
                                                                                            onChange={(e) => setEvidenceComment(e.target.value)}
                                                                                            placeholder="Provide details about this evidence..."
                                                                                        />
                                                                                    </div>

                                                                                    <div className="flex justify-end">
                                                                                        <Button
                                                                                            className="bg-[#1B6131] hover:bg-[#46B749]"
                                                                                            onClick={() => handleUploadEvidence(entry.id)}
                                                                                            disabled={!selectedFile}
                                                                                        >
                                                                                            <Save className="h-4 w-4 mr-1" />
                                                                                            Submit Evidence
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    )}

                                                                    {canReviewEntry(entry) && entry.evidence.length > 0 && (
                                                                        <Dialog
                                                                            open={reviewDialogOpen[entry.id] || false}
                                                                            onOpenChange={(open) => setReviewDialogOpen(prev => ({ ...prev, [entry.id]: open }))}>
                                                                            <DialogTrigger asChild>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="text-[#1B6131] border-[#1B6131] hover:bg-[#f0f9f0] dark:text-[#46B749] dark:border-[#46B749] dark:hover:bg-[#0a2e14]"
                                                                                >
                                                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                                                    Review
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-md w-[95%] lg:max-w-2xl rounded-lg overflow-y-scroll max-h-[85vh]">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Review Evidence</DialogTitle>
                                                                                </DialogHeader>
                                                                                <div className="space-y-4 mt-4">
                                                                                    <div>
                                                                                        <h3 className="font-medium">Action Plan</h3>
                                                                                        <p>{entry.title}</p>
                                                                                    </div>

                                                                                    <div>
                                                                                        <h3 className="font-medium">Target Value</h3>
                                                                                        <p>{entry.targetValue}</p>
                                                                                    </div>

                                                                                    <div>
                                                                                        <h3 className="font-medium">Actual Value</h3>
                                                                                        <Input
                                                                                            type="number"
                                                                                            value={actualValueInput[entry.id] ?? ''}
                                                                                            onChange={(e) => {
                                                                                                setActualValueInput({
                                                                                                    ...actualValueInput,
                                                                                                    [entry.id]: parseFloat(e.target.value)
                                                                                                });
                                                                                            }}
                                                                                            disabled={!canReviewEntry(entry)}
                                                                                        />
                                                                                    </div>

                                                                                    <div>
                                                                                        <h3 className="font-medium">Evidence Submitted</h3>
                                                                                        {entry.evidence.map(ev => (
                                                                                            <div key={ev.id} className="p-3 border rounded-md mt-2">
                                                                                                <div className="flex items-center">
                                                                                                    <FileText className="h-4 w-4 mr-2 text-[#1B6131]" />
                                                                                                    <p className="font-medium">{ev.fileName}</p>
                                                                                                </div>
                                                                                                <p className="text-sm mt-1">Uploaded: {ev.uploadDate}</p>

                                                                                                <div className="mt-2">
                                                                                                    <h3 className="font-medium text-sm">Comments</h3>
                                                                                                    <Textarea
                                                                                                        value={ev.comments || ''}
                                                                                                        readOnly
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                        {canReviewEntry(entry) && (
                                                                                            <div className="flex justify-end space-x-2 mt-3">
                                                                                                <Button
                                                                                                    variant="outline"
                                                                                                    size="sm"
                                                                                                    onClick={() => handleReviewActionPlan(entry.id, 'reject')}
                                                                                                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                                                                >
                                                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                                                    Reject
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    onClick={() => handleReviewActionPlan(entry.id, 'approve')}
                                                                                                    className="bg-[#1B6131] hover:bg-[#46B749]"
                                                                                                >
                                                                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                                                                    Approve
                                                                                                </Button>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={7} className="p-4 text-center text-gray-500">
                                                            No entries found matching your filter criteria.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredEntries.length / itemsPerPage)}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filteredEntries.length}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        expanded={paginationExpanded}
                                        onToggleExpand={toggleExpand}
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
};

export default EmployeeIPMDetailsPage;