import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    User,
    Mail,
    Edit,
    Plus,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    UserX,
    UserCheck,
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import Pagination from '@/components/Pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data types based on your database schema
type Employee = {
    employee_id: number;
    employee_number: string;
    employee_name: string;
    employee_department_id: number;
    employee_team_id: number;
    employee_email: string;
    employee_phone: string;
    employee_is_active: boolean;
    employee_created_at: string;
    employee_updated_at: string;
    department_name?: string;
    team_name?: string;
    is_manager?: boolean;
};

type Department = {
    department_id: number;
    department_name: string;
};

type Team = {
    team_id: number;
    team_name: string;
};

const EmployeeManagementPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        department: '',
        team: '',
        status: 'all',
        isManager: 'all'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Generate dummy data
    useEffect(() => {
        // Dummy departments
        const dummyDepartments: Department[] = [
            { department_id: 1, department_name: 'Information Technology' },
            { department_id: 2, department_name: 'Human Resources' },
            { department_id: 3, department_name: 'Finance' },
            { department_id: 4, department_name: 'Marketing' },
            { department_id: 5, department_name: 'Operations' },
        ];

        // Dummy teams
        const dummyTeams: Team[] = [
            { team_id: 1, team_name: 'Frontend Development' },
            { team_id: 2, team_name: 'Backend Development' },
            { team_id: 3, team_name: 'Recruitment' },
            { team_id: 4, team_name: 'Payroll' },
            { team_id: 5, team_name: 'Digital Marketing' },
        ];

        // Dummy employees
        const dummyEmployees: Employee[] = Array.from({ length: 50 }, (_, i) => ({
            employee_id: i + 1,
            employee_number: `EMP${String(i + 1).padStart(4, '0')}`,
            employee_name: `Employee ${i + 1}`,
            employee_department_id: dummyDepartments[Math.floor(Math.random() * dummyDepartments.length)].department_id,
            employee_team_id: dummyTeams[Math.floor(Math.random() * dummyTeams.length)].team_id,
            employee_email: `employee${i + 1}@company.com`,
            employee_phone: `+62 812-${String(Math.floor(1000 + Math.random() * 9000))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
            employee_is_active: Math.random() > 0.2,
            employee_created_at: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString(),
            employee_updated_at: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
            is_manager: Math.random() > 0.7,
        }));

        // Add department and team names to employees
        const employeesWithDetails = dummyEmployees.map(emp => ({
            ...emp,
            department_name: dummyDepartments.find(d => d.department_id === emp.employee_department_id)?.department_name,
            team_name: dummyTeams.find(t => t.team_id === emp.employee_team_id)?.team_name
        }));

        setDepartments(dummyDepartments);
        setTeams(dummyTeams);
        setEmployees(employeesWithDetails);
        setFilteredEmployees(employeesWithDetails);
    }, []);

    // Apply filters and search
    useEffect(() => {
        let result = [...employees];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(emp =>
                emp.employee_name.toLowerCase().includes(term) ||
                emp.employee_number.toLowerCase().includes(term) ||
                emp.employee_email.toLowerCase().includes(term)
            );
        }

        // Apply department filter
        if (filters.department) {
            result = result.filter(emp =>
                emp.employee_department_id === parseInt(filters.department)
            );
        }

        // Apply team filter
        if (filters.team) {
            result = result.filter(emp =>
                emp.employee_team_id === parseInt(filters.team)
            );
        }

        // Apply status filter
        if (filters.status !== 'all') {
            const activeStatus = filters.status === 'active';
            result = result.filter(emp => emp.employee_is_active === activeStatus);
        }

        // Apply manager filter
        if (filters.isManager !== 'all') {
            const isManager = filters.isManager === 'yes';
            result = result.filter(emp => emp.is_manager === isManager);
        }

        setFilteredEmployees(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filters, employees]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            department: '',
            team: '',
            status: 'all',
            isManager: 'all'
        });
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-montserrat">
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
                    <Breadcrumb
                        items={[]}
                        currentPage="Employee Management"
                        showHomeIcon={true}
                    />

                    {/* Search and Filter Section */}
                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md mb-6">
                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] py-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg">
                                    Search & Filter
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="text-[#1B6131] dark:text-[#46B749]"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                    {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex flex-col space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, employee number, or email..."
                                        className="pl-9 bg-white dark:bg-gray-800"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {showFilters && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                            <Select
                                                value={filters.department}
                                                onValueChange={(value) => handleFilterChange('department', value)}
                                            >
                                                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                                    <SelectValue placeholder="All Departments" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Departments</SelectItem>
                                                    {departments.map(dept => (
                                                        <SelectItem key={dept.department_id} value={String(dept.department_id)}>
                                                            {dept.department_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
                                            <Select
                                                value={filters.team}
                                                onValueChange={(value) => handleFilterChange('team', value)}
                                            >
                                                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                                    <SelectValue placeholder="All Teams" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Teams</SelectItem>
                                                    {teams.map(team => (
                                                        <SelectItem key={team.team_id} value={String(team.team_id)}>
                                                            {team.team_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                            <Select
                                                value={filters.status}
                                                onValueChange={(value) => handleFilterChange('status', value)}
                                            >
                                                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
                                            <Select
                                                value={filters.isManager}
                                                onValueChange={(value) => handleFilterChange('isManager', value)}
                                            >
                                                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                                    <SelectValue placeholder="All" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="yes">Managers</SelectItem>
                                                    <SelectItem value="no">Non-Managers</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={resetFilters}
                                                className="border-[#1B6131] text-[#1B6131] dark:border-[#46B749] dark:text-[#46B749]"
                                            >
                                                Reset Filters
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employee Table */}
                    <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] py-6">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg">
                                    Employee List Table
                                </CardTitle>
                                <Button className="bg-[#1B6131] hover:bg-[#144d27] dark:bg-[#46B749] dark:hover:bg-[#3da33f]">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Employee
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 pb-8">
                            <div className="rounded-md border border-gray-200 dark:border-gray-700">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Team</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((employee) => (
                                                <TableRow key={employee.employee_id}>
                                                    <TableCell className="font-medium">{employee.employee_number}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <User className="h-4 w-4 text-[#1B6131] dark:text-[#46B749]" />
                                                            <span>{employee.employee_name}</span>
                                                            {employee.is_manager && (
                                                                <Badge className="bg-[#1B6131] hover:bg-[#1B6131] dark:bg-[#46B749] dark:hover:bg-[#46B749]">
                                                                    Manager
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Mail className="h-4 w-4 text-[#1B6131] dark:text-[#46B749]" />
                                                            <span>{employee.employee_email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{employee.department_name}</TableCell>
                                                    <TableCell>{employee.team_name}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={employee.employee_is_active ? 'default' : 'secondary'}
                                                            className={employee.employee_is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}
                                                        >
                                                            {employee.employee_is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-[#1B6131] hover:bg-[#1B6131] dark:bg-[#46B749] dark:hover:bg-[#46B749]">
                                                            {employee.is_manager ? 'Manager' : 'Employee'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <Edit className="h-4 w-4 text-[#1B6131] dark:text-[#46B749]" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    {employee.employee_is_active ? (
                                                                        <>
                                                                            <UserX className="h-4 w-4 mr-2" />
                                                                            Deactivate
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                                            Activate
                                                                        </>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-24 text-center">
                                                    No employees found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {filteredEmployees.length > itemsPerPage && (
                                <div className="mt-4">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default EmployeeManagementPage;