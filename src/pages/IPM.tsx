import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    User,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart2Icon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Pagination from '@/components/Pagination';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb';
import FilterSection from '@/components/Filtering';

// Types
type Unit = 'IT' | 'Marketing' | 'Sales' | 'Operations' | 'Customer Service' | 'Finance';

interface Employee {
    id: string;
    name: string;
    employeeNumber: string;
    department: string;
    position: string;
    unit: Unit;
    pendingPlans: number;
    inProgressPlans: number;
    completedPlans: number;
    totalPlans: number;
}

const IPMPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin'); // employee, manager, sm_dept
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filterUnit, setFilterUnit] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [paginationExpanded, setPaginationExpanded] = useState(true);
    const navigate = useNavigate();

    // Mock data for employees with action plan counts
    const [employees, _setEmployees] = useState<Employee[]>([
        {
            id: '1',
            name: 'John Doe',
            employeeNumber: 'EMP001',
            department: 'Technology',
            position: 'Software Engineer',
            unit: 'IT',
            pendingPlans: 2,
            inProgressPlans: 1,
            completedPlans: 3,
            totalPlans: 6
        },
        {
            id: '2',
            name: 'Jane Smith',
            employeeNumber: 'EMP002',
            department: 'Customer Experience',
            position: 'Customer Support Specialist',
            unit: 'Customer Service',
            pendingPlans: 1,
            inProgressPlans: 2,
            completedPlans: 0,
            totalPlans: 3
        },
        {
            id: '3',
            name: 'Robert Johnson',
            employeeNumber: 'EMP003',
            department: 'Finance',
            position: 'Financial Analyst',
            unit: 'Finance',
            pendingPlans: 0,
            inProgressPlans: 1,
            completedPlans: 2,
            totalPlans: 3
        },
        {
            id: '4',
            name: 'Maria Garcia',
            employeeNumber: 'EMP004',
            department: 'Marketing',
            position: 'Marketing Specialist',
            unit: 'Marketing',
            pendingPlans: 1,
            inProgressPlans: 0,
            completedPlans: 1,
            totalPlans: 2
        },
        {
            id: '5',
            name: 'David Kim',
            employeeNumber: 'EMP005',
            department: 'Technology',
            position: 'UX Designer',
            unit: 'IT',
            pendingPlans: 2,
            inProgressPlans: 1,
            completedPlans: 0,
            totalPlans: 3
        },
        {
            id: '6',
            name: 'Sarah Johnson',
            employeeNumber: 'EMP006',
            department: 'Sales',
            position: 'Sales Representative',
            unit: 'Sales',
            pendingPlans: 0,
            inProgressPlans: 2,
            completedPlans: 1,
            totalPlans: 3
        },
        {
            id: '7',
            name: 'Michael Chen',
            employeeNumber: 'EMP007',
            department: 'Operations',
            position: 'Operations Manager',
            unit: 'Operations',
            pendingPlans: 1,
            inProgressPlans: 3,
            completedPlans: 2,
            totalPlans: 6
        }
    ]);

    // Calculate dashboard metrics based on role and data
    const calculateDashboardMetrics = () => {
        if (currentRole === 'employee') {
            // For employee role - only show data for John Doe (id: '1')
            const employeeData = employees.find(emp => emp.id === '1');
            return {
                pending: employeeData?.pendingPlans || 0,
                inProgress: employeeData?.inProgressPlans || 0,
                completed: employeeData?.completedPlans || 0,
                total: employeeData?.totalPlans || 0
            };
        } else if (currentRole === 'manager') {
            // For manager - show all employees in their unit (assuming IT department)
            const unitEmployees = employees.filter(emp => emp.unit === 'IT');
            return {
                pending: unitEmployees.reduce((sum, emp) => sum + emp.pendingPlans, 0),
                inProgress: unitEmployees.reduce((sum, emp) => sum + emp.inProgressPlans, 0),
                completed: unitEmployees.reduce((sum, emp) => sum + emp.completedPlans, 0),
                total: unitEmployees.reduce((sum, emp) => sum + emp.totalPlans, 0),
                needsReview: unitEmployees.reduce((sum, emp) => sum + emp.inProgressPlans, 0) // For simplicity, using inProgress as needsReview
            };
        } else {
            // For SM - show all employees
            return {
                pending: employees.reduce((sum, emp) => sum + emp.pendingPlans, 0),
                inProgress: employees.reduce((sum, emp) => sum + emp.inProgressPlans, 0),
                completed: employees.reduce((sum, emp) => sum + emp.completedPlans, 0),
                total: employees.reduce((sum, emp) => sum + emp.totalPlans, 0),
                needsValidation: employees.reduce((sum, emp) => sum + emp.inProgressPlans, 0) // For simplicity, using inProgress as needsValidation
            };
        }
    };

    const dashboardMetrics = calculateDashboardMetrics();

    // Filter employees based on selected filters and role
    const getFilteredEmployees = () => {
        let filteredList = [...employees];

        // Filter by role
        if (currentRole === 'employee') {
            // Employee sees only themselves
            filteredList = filteredList.filter(emp => emp.id === '1');
        } else if (currentRole === 'manager') {
            // Approver sees employees in their unit (assuming IT unit)
            filteredList = filteredList.filter(emp => emp.unit === 'IT');
        }
        // For sm_dept role, no department filtering is applied - they see all employees

        // Additional filters - apply only if a specific unit (not 'all') is selected
        if (filterUnit && filterUnit !== 'all') {
            filteredList = filteredList.filter(emp => emp.unit === filterUnit);
        }

        // Search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredList = filteredList.filter(emp =>
                emp.name.toLowerCase().includes(term) ||
                emp.employeeNumber.toLowerCase().includes(term) ||
                emp.position.toLowerCase().includes(term) ||
                emp.unit.toLowerCase().includes(term) ||
                emp.department.toLowerCase().includes(term)
            );
        }

        return filteredList;
    };

    const filteredEmployees = getFilteredEmployees();

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterUnit, searchTerm, currentRole, itemsPerPage]);

    // Get current employees for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    // Handle employee selection/click
    const handleEmployeeSelect = (employeeId: string) => {
        navigate(`/performance-management/ipm/${employeeId}/details`)
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Toggle pagination expanded state
    const togglePaginationExpand = () => {
        setPaginationExpanded(!paginationExpanded);
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

                <main className={`flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full`}>
                    <div className="space-y-6 w-full">
                        <Breadcrumb
                            items={[]}
                            currentPage="Individual Performance Management"
                            showHomeIcon={true}
                        />

                        {/* Dashboard Card - Adapted for each role */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md w-full">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-base md:text-lg text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    IPM Dashboard {currentRole === 'employee' ? '- My Performance' : currentRole === 'manager' ? '- Department Overview' : '- Organization Overview'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                                    <div className="p-2 sm:p-4 bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                        <h3 className="font-medium text-xs sm:text-sm text-[#1B6131] dark:text-[#46B749] flex items-center">
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                            Pending Items
                                        </h3>
                                        <p className="text-sm sm:text-lg font-bold mt-1">
                                            {dashboardMetrics.pending}
                                        </p>
                                    </div>
                                    <div className="p-2 sm:p-4 bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                        <h3 className="font-medium text-xs sm:text-sm text-[#1B6131] dark:text-[#46B749] flex items-center">
                                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                            In Progress
                                        </h3>
                                        <p className="text-sm sm:text-lg font-bold mt-1">
                                            {dashboardMetrics.inProgress}
                                        </p>
                                    </div>
                                    <div className="p-2 sm:p-4 bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                        <h3 className="font-medium text-xs sm:text-sm text-[#1B6131] dark:text-[#46B749] flex items-center">
                                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                            Completed Items
                                        </h3>
                                        <p className="text-sm sm:text-lg font-bold mt-1">
                                            {dashboardMetrics.completed}
                                        </p>
                                    </div>

                                    {/* Role-specific metrics */}
                                    {currentRole === 'manager' && (
                                        <div className="p-2 sm:p-4 bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                            <h3 className="font-medium text-xs sm:text-sm text-[#1B6131] dark:text-[#46B749]">Needs Review</h3>
                                            <p className="text-sm sm:text-lg font-bold mt-1">{dashboardMetrics.needsReview}</p>
                                        </div>
                                    )}

                                    {currentRole === 'sm_dept' && (
                                        <div className="p-2 sm:p-4 bg-[#f0f9f0] dark:bg-[#0a2e14] rounded-lg">
                                            <h3 className="font-medium text-xs sm:text-sm text-[#1B6131] dark:text-[#46B749]">Needs Validation</h3>
                                            <p className="text-sm sm:text-lg font-bold mt-1">{dashboardMetrics.needsValidation}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <FilterSection>
                            {currentRole !== 'employee' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <Search className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                            <span>Search</span>
                                        </label>
                                        <Input
                                            placeholder="Search employees..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <User className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                            <span>Unit</span>
                                        </label>
                                        <Select
                                            value={filterUnit}
                                            onValueChange={setFilterUnit}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Filter by Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Units</SelectItem>
                                                <SelectItem value="IT">IT</SelectItem>
                                                <SelectItem value="Marketing">Marketing</SelectItem>
                                                <SelectItem value="Sales">Sales</SelectItem>
                                                <SelectItem value="Operations">Operations</SelectItem>
                                                <SelectItem value="Customer Service">Customer Service</SelectItem>
                                                <SelectItem value="Finance">Finance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <BarChart2Icon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                            <span>Team</span>
                                        </label>
                                        <Select
                                        // value={filters.team}
                                        // onValueChange={(value) => handleFilterChange('team', value)}
                                        >
                                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                                <SelectValue placeholder="All Teams" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Teams</SelectItem>
                                                {/* {teams.map(team => (
                                                    <SelectItem key={team.team_id} value={String(team.team_id)}>
                                                        {team.team_name}
                                                    </SelectItem>
                                                ))} */}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <BarChart2Icon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                            <span>Status</span>
                                        </label>
                                        <Select
                                        // value={filters.status}
                                        // onValueChange={(value) => handleFilterChange('status', value)}
                                        >
                                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </FilterSection>

                        {/* Employee List Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md w-full">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-base md:text-lg text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    {currentRole === 'employee' ? 'My Performance Plans' : 'Employee Performance Plans'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="w-full mt-4">
                                {/* Employee List */}
                                <div className="space-y-4 w-full">
                                    {currentEmployees.length > 0 ? (
                                        currentEmployees.map((employee) => (
                                            <div
                                                key={employee.id}
                                                className="border rounded-lg p-3 sm:p-4 hover:bg-[#f0f9f0] dark:hover:bg-[#0a2e14]/30 cursor-pointer transition-colors w-full"
                                                onClick={() => handleEmployeeSelect(employee.id)}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 w-full">
                                                    <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#1B6131] text-white flex items-center justify-center flex-shrink-0">
                                                            <User className="h-4 w-4 sm:h-6 sm:w-6" />
                                                        </div>
                                                        <div className="flex-grow overflow-hidden">
                                                            <h3 className="font-medium text-sm sm:text-base truncate">{employee.name}</h3>
                                                            <p className="text-xs sm:text-sm text-gray-500 truncate">{employee.employeeNumber} - {employee.position}</p>
                                                            <p className="text-xs text-gray-500 truncate">{employee.unit} | {employee.department}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap sm:flex-col lg:flex-row gap-1 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-start sm:justify-center">
                                                        <div className="flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                                                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                                            <span className="text-xs font-medium">Pending: {employee.pendingPlans}</span>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                                                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                            <span className="text-xs font-medium">In Progress: {employee.inProgressPlans}</span>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                            <span className="text-xs font-medium">Completed: {employee.completedPlans}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No employees found matching the selected filters.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredEmployees.length}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                    expanded={paginationExpanded}
                                    onToggleExpand={togglePaginationExpand}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default IPMPage;