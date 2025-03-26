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

// Types
type IPMStatus = 'Pending' | 'Evidence Submitted' | 'Approved by Manager' | 'Validated by SM';
type EvidenceStatus = 'Not Submitted' | 'Submitted' | 'Approved' | 'Rejected';
type Perspective = 'Financial' | 'Customer' | 'Internal Business Process' | 'Learning & Growth';
type Unit = 'IT' | 'Marketing' | 'Sales' | 'Operations' | 'Customer Service' | 'Finance';

interface Employee {
    id: string;
    name: string;
    employeeNumber: string;
    department: string;
    position: string;
    unit: Unit;
}

interface Evidence {
    id: string;
    fileName: string;
    uploadDate: string;
    status: EvidenceStatus;
    comments?: string;
    reviewedBy?: string;
    reviewDate?: string;
}

interface IPMEntry {
    id: string;
    title: string;
    description: string;
    status: IPMStatus;
    targetDate: string;
    weight: number;
    perspective: Perspective;
    employee: Employee;
    evidence: Evidence[];
}


const EmployeeIPMDetailsPage = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin'); // employee, manager, sm_dept
    const [evidenceComment, setEvidenceComment] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, _setItemsPerPage] = useState(5);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPerspective, setFilterPerspective] = useState('');

    // Mock data for employee - would normally fetch based on employeeId
    const [employee, _setEmployee] = useState<Employee>({
        id: '2',
        name: 'Jane Smith',
        employeeNumber: 'EMP002',
        department: 'Customer Experience',
        position: 'Customer Support Specialist',
        unit: 'Customer Service'
    });

    // Mock data for action plans from MPM for this specific employee
    const [entries, setEntries] = useState<IPMEntry[]>([
        {
            id: '1',
            title: 'Increase Customer Satisfaction Rating',
            description: 'Achieve a minimum of 90% satisfaction rating from customer feedback surveys',
            status: 'Pending',
            targetDate: '2025-06-30',
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
            targetDate: '2025-05-15',
            weight: 25,
            perspective: 'Internal Business Process',
            employee: employee,
            evidence: [
                {
                    id: '1001',
                    fileName: 'response_time_metrics_q1.pdf',
                    uploadDate: '2025-02-15',
                    status: 'Submitted',
                    comments: 'Mid-quarter progress report showing 30% improvement in response time'
                }
            ]
        },
        {
            id: '3',
            title: 'Complete Advanced Customer Service Training',
            description: 'Finish the certification program for advanced customer handling techniques',
            status: 'Approved by Manager',
            targetDate: '2025-04-20',
            weight: 15,
            perspective: 'Learning & Growth',
            employee: employee,
            evidence: [
                {
                    id: '1002',
                    fileName: 'certification_completion.pdf',
                    uploadDate: '2025-03-10',
                    status: 'Approved',
                    comments: 'Completed certification with distinction',
                    reviewedBy: 'Michael Wilson',
                    reviewDate: '2025-03-12'
                }
            ]
        },
        {
            id: '4',
            title: 'Implement New Customer Feedback System',
            description: 'Roll out and train staff on the new feedback collection platform',
            status: 'Validated by SM',
            targetDate: '2025-03-01',
            weight: 20,
            perspective: 'Internal Business Process',
            employee: employee,
            evidence: [
                {
                    id: '1003',
                    fileName: 'feedback_system_implementation.pdf',
                    uploadDate: '2025-02-25',
                    status: 'Approved',
                    comments: 'Implementation completed ahead of schedule with full staff training',
                    reviewedBy: 'Michael Wilson',
                    reviewDate: '2025-02-27'
                }
            ]
        },
        {
            id: '5',
            title: 'Reduce Customer Churn Rate',
            description: 'Implement retention strategies to reduce monthly churn by 15%',
            status: 'Pending',
            targetDate: '2025-07-31',
            weight: 10,
            perspective: 'Financial',
            employee: employee,
            evidence: []
        }
    ]);

    // Get summary counts
    const pendingCount = entries.filter(e => e.status === 'Pending').length;
    const inProgressCount = entries.filter(e => e.status === 'Evidence Submitted' || e.status === 'Approved by Manager').length;
    const completedCount = entries.filter(e => e.status === 'Validated by SM').length;

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
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

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
            status: 'Submitted',
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

    // Handler for approving evidence
    const handleApproveEvidence = (entryId: string, evidenceId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? {
                    ...entry,
                    evidence: entry.evidence.map(ev =>
                        ev.id === evidenceId
                            ? {
                                ...ev,
                                status: 'Approved',
                                reviewedBy: currentRole === 'manager' ? 'Michael Wilson' : ev.reviewedBy,
                                reviewDate: new Date().toISOString().split('T')[0]
                            }
                            : ev
                    ),
                    status: 'Approved by Manager'
                }
                : entry
        ));
    };

    // Handler for rejecting evidence
    const handleRejectEvidence = (entryId: string, evidenceId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? {
                    ...entry,
                    evidence: entry.evidence.map(ev =>
                        ev.id === evidenceId
                            ? {
                                ...ev,
                                status: 'Rejected',
                                reviewedBy: currentRole === 'manager' ? 'Michael Wilson' : ev.reviewedBy,
                                reviewDate: new Date().toISOString().split('T')[0]
                            }
                            : ev
                    ),
                    status: 'Pending'
                }
                : entry
        ));
    };

    // Handler for validating IPM entry
    const handleValidate = (entryId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Validated by SM' }
                : entry
        ));
    };

    // Helper function to get status color classes with dark mode support
    const getStatusColor = (status: IPMStatus) => {
        switch (status) {
            case 'Pending':
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
            case 'Evidence Submitted':
                return 'bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
            case 'Approved by Manager':
                return 'bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200';
            case 'Validated by SM':
                return 'bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    // Helper function to get evidence status color classes with dark mode support
    const getEvidenceStatusColor = (status: EvidenceStatus) => {
        switch (status) {
            case 'Not Submitted':
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
            case 'Submitted':
                return 'bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
            case 'Approved':
                return 'bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200';
            case 'Rejected':
                return 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
        }
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

                <main className={`   flex-1 
            px-2 
            sm:px-4 
            lg:px-6 
            pt-16 
            pb-12
            mt-4
            sm:pt-18 
            lg:pt-20 
            transition-all 
            duration-300 
            ease-in-out 
            ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
            w-full`}>
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

                        {/* IPM Entries */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md w-full">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-base md:text-lg text-[#1B6131] dark:text-[#46B749] flex flex-col sm:flex-row justify-between items-center">
                                    <div className="flex items-center mb-2 sm:mb-0">
                                        <FileText className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                                        Action Plans
                                    </div>

                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger className="w-full sm:w-36 text-xs sm:text-sm h-9">
                                                <SelectValue placeholder="Filter Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Evidence Submitted">Evidence Submitted</SelectItem>
                                                <SelectItem value="Approved by Manager">Approved by Manager</SelectItem>
                                                <SelectItem value="Validated by SM">Validated by SM</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={filterPerspective} onValueChange={setFilterPerspective}>
                                            <SelectTrigger className="w-full sm:w-36 text-xs sm:text-sm h-9">
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
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='mt-2 p-0'>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px]">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-2 md:p-4 text-left text-xs md:text-sm">Title</th>
                                                <th className="p-2 md:p-4 text-left text-xs md:text-sm">Perspective</th>
                                                <th className="p-2 md:p-4 text-left text-xs md:text-sm">Target Date</th>
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
                                                        <td className="p-2 md:p-4 text-xs md:text-sm">{entry.targetDate}</td>
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
                                                                                    <h3 className="font-medium">Target Date</h3>
                                                                                    <p>{entry.targetDate}</p>
                                                                                </div>
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
                                                                                                <div className="flex items-center justify-between">
                                                                                                    <div className="flex items-center">
                                                                                                        <FileText className="h-4 w-4 mr-2 text-[#1B6131]" />
                                                                                                        <p className="font-medium">{ev.fileName}</p>
                                                                                                    </div>
                                                                                                    <span className={`px-2 py-1 rounded-full text-xs ${getEvidenceStatusColor(ev.status)}`}>
                                                                                                        {ev.status}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <p className="text-sm mt-1">Uploaded: {ev.uploadDate}</p>
                                                                                                {ev.comments && (
                                                                                                    <p className="text-sm mt-1">{ev.comments}</p>
                                                                                                )}
                                                                                                {ev.reviewedBy && (
                                                                                                    <p className="text-sm mt-1">
                                                                                                        Reviewed by {ev.reviewedBy} on {ev.reviewDate}
                                                                                                    </p>
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
                                                                {currentRole === 'employee' && entry.status !== 'Validated by SM' && (
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

                                                                {/* Review buttons - Only for manager role and appropriate statuses */}
                                                                {currentRole === 'manager' && entry.status === 'Evidence Submitted' && entry.evidence.length > 0 && (
                                                                    <Dialog>
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
                                                                                    <h3 className="font-medium">Evidence Submitted</h3>
                                                                                    {entry.evidence
                                                                                        .filter(ev => ev.status === 'Submitted')
                                                                                        .map(ev => (
                                                                                            <div key={ev.id} className="p-3 border rounded-md mt-2">
                                                                                                <div className="flex items-center">
                                                                                                    <FileText className="h-4 w-4 mr-2 text-[#1B6131]" />
                                                                                                    <p className="font-medium">{ev.fileName}</p>
                                                                                                </div>
                                                                                                <p className="text-sm mt-1">Uploaded: {ev.uploadDate}</p>
                                                                                                {ev.comments && (
                                                                                                    <p className="text-sm mt-1">{ev.comments}</p>
                                                                                                )}
                                                                                                <div className="flex justify-end space-x-2 mt-3">
                                                                                                    <Button
                                                                                                        variant="outline"
                                                                                                        size="sm"
                                                                                                        onClick={() => handleRejectEvidence(entry.id, ev.id)}
                                                                                                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                                                                    >
                                                                                                        <XCircle className="h-4 w-4 mr-1" />
                                                                                                        Reject
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        size="sm"
                                                                                                        onClick={() => handleApproveEvidence(entry.id, ev.id)}
                                                                                                        className="bg-[#1B6131] hover:bg-[#46B749]"
                                                                                                    >
                                                                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                                                                        Approve
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                </div>
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                )}

                                                                {/* Validation button - Only for sm_dept role and entries that are approved by manager */}
                                                                {currentRole === 'sm_dept' && entry.status === 'Approved by Manager' && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-[#1B6131] border-[#1B6131] hover:bg-[#f0f9f0] dark:text-[#46B749] dark:border-[#46B749] dark:hover:bg-[#0a2e14]"
                                                                        onClick={() => handleValidate(entry.id)}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                                        Validate
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                                        No entries found matching your filter criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredEntries.length > 0 && (
                                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEntries.length)} of {filteredEntries.length} entries
                                        </div>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployeeIPMDetailsPage;