import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
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
import { Edit, Eye, Info, Search } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';
import Pagination from '@/components/Pagination';
import FilterSection from '@/components/Filtering';

type MonthType = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' |
    'July' | 'August' | 'September' | 'October' | 'November' | 'December';

type Perspective =
    | 'Financial'
    | 'Customer'
    | 'Internal Business Process'
    | 'Learning & Growth';

type MPMEntry = {
    id?: number;
    perspective: Perspective;
    kpiNumber: number;
    kpi: string;
    kpiDefinition: string;
    weight: number;
    uom: string;
    target: number;
};

type TeamKPIActual = {
    id: string;
    teamId: number;
    teamName: string;
    month: MonthType;
    target: number;
    actual: number;
    achievement: number;
    weight: number;
    problemIdentification: string;
    rootCauseAnalysis: string;
    correctiveAction: string;
    status: 'On Track' | 'At Risk' | 'Off Track';
};

const MPMActualsTeamKPI: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { mpmActualId, mpmId } = useParams<{
        mpmActualId: string,
        mpmId: string
    }>();
    const month = searchParams.get('month');

    // State for sidebar and UI
     const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; 
    }
    return true; 
  });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedTeamKPI, setSelectedTeamKPI] = useState<TeamKPIActual | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [paginationExpanded, setPaginationExpanded] = useState(true);
    
    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const navigate = useNavigate();

    const [parentKPI] = useState<MPMEntry>({
        id: 1,
        perspective: 'Financial',
        kpiNumber: 1,
        kpi: 'Revenue Growth',
        kpiDefinition: 'Increase overall company revenue',
        weight: 30,
        uom: 'Number',
        target: 100000
    });

    const [teamKPIActuals, setTeamKPIActuals] = useState<TeamKPIActual[]>([
        {
            id: '1',
            teamId: 1,
            teamName: 'Sales Team',
            month: 'January',
            target: 50000,
            actual: 45000,
            achievement: 90,
            weight: 20,
            problemIdentification: 'Lower sales in new market segments',
            rootCauseAnalysis: 'Limited market penetration and competitive pricing',
            correctiveAction: 'Develop targeted marketing strategy and adjust pricing',
            status: 'At Risk'
        },
        {
            id: '2',
            teamId: 2,
            teamName: 'Business Development',
            month: 'January',
            target: 25000,
            actual: 30000,
            achievement: 120,
            weight: 10,
            problemIdentification: '',
            rootCauseAnalysis: '',
            correctiveAction: '',
            status: 'On Track'
        },
        {
            id: '3',
            teamId: 3,
            teamName: 'Marketing',
            month: 'January',
            target: 15000,
            actual: 12000,
            achievement: 80,
            weight: 15,
            problemIdentification: 'Campaign underperformance',
            rootCauseAnalysis: 'Poor targeting and messaging',
            correctiveAction: 'Refine messaging and audience targeting',
            status: 'At Risk'
        },
        {
            id: '4',
            teamId: 4,
            teamName: 'Product Development',
            month: 'January',
            target: 10000,
            actual: 5000,
            achievement: 50,
            weight: 25,
            problemIdentification: 'Product launch delays',
            rootCauseAnalysis: 'Technical issues and resource constraints',
            correctiveAction: 'Increase development team capacity',
            status: 'Off Track'
        },
        {
            id: '5',
            teamId: 5,
            teamName: 'Customer Success',
            month: 'January',
            target: 30000,
            actual: 32000,
            achievement: 107,
            weight: 15,
            problemIdentification: '',
            rootCauseAnalysis: '',
            correctiveAction: '',
            status: 'On Track'
        },
        {
            id: '6',
            teamId: 6,
            teamName: 'Strategic Partnerships',
            month: 'January',
            target: 20000,
            actual: 18000,
            achievement: 90,
            weight: 15,
            problemIdentification: 'Partner engagement issues',
            rootCauseAnalysis: 'Insufficient partner incentives',
            correctiveAction: 'Restructure partner program benefits',
            status: 'At Risk'
        }
    ]);

    // Apply filters to get filtered data
    const filteredData = useMemo(() => {
        return teamKPIActuals.filter(kpi => {
            // Apply search term filter (case insensitive)
            const matchesSearch = searchTerm === '' || 
                kpi.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kpi.problemIdentification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kpi.rootCauseAnalysis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kpi.correctiveAction.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Apply status filter
            const matchesStatus = statusFilter === 'All' || kpi.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [teamKPIActuals, searchTerm, statusFilter]);

    // Paginate the filtered data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const calculateTotals = useMemo(() => {
        // Calculate totals based on filtered data
        return {
            total: filteredData.reduce((sum, plan) => sum + plan.actual, 0),
            totalWeight: filteredData.reduce((sum, plan) => sum + plan.weight, 0),
            averageAchievement: filteredData.length > 0 
                ? filteredData.reduce((sum, plan) => sum + plan.achievement, 0) / filteredData.length 
                : 0
        };
    }, [filteredData]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const togglePaginationExpand = () => {
        setPaginationExpanded(!paginationExpanded);
    };

    // Team KPI handlers
    const handleAddTeamKPI = (newTeamKPI: TeamKPIActual) => {
        setTeamKPIActuals(prev => [
            ...prev,
            { ...newTeamKPI, id: `${prev.length + 1}` }
        ]);
        setIsAddDialogOpen(false);
    };

    const handleEditTeamKPI = (teamKPI: TeamKPIActual) => {
        setTeamKPIActuals(prev =>
            prev.map(item =>
                item.id === teamKPI.id ? teamKPI : item
            )
        );
        setIsEditDialogOpen(false);
    };

    const TeamKPIDialog = ({
        isOpen,
        onClose,
        onSave,
        initialData
    }: {
        isOpen: boolean;
        onClose: () => void;
        onSave: (teamKPI: TeamKPIActual) => void;
        initialData?: TeamKPIActual;
    }) => {
        const [formData, setFormData] = useState<TeamKPIActual>(initialData || {
            id: '',
            teamId: 0,
            teamName: '',
            month: 'January',
            target: 0,
            actual: 0,
            achievement: 0,
            weight: 0,
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
                            {initialData ? 'Edit' : 'Add'} Team KPI Actual
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Team Name and Month */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Team Name</Label>
                                <Input
                                    value={formData.teamName}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        teamName: e.target.value
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

                        {/* Achievement and Weight */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Achievement (%)</Label>
                                <Input
                                    type="number"
                                    value={formData.achievement}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        achievement: Number(e.target.value)
                                    }))}
                                />
                            </div>
                            <div>
                                <Label>Weight (%)</Label>
                                <Input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        weight: Number(e.target.value)
                                    }))}
                                />
                            </div>
                        </div>

                        {/* Problem Identification */}
                        <div>
                            <Label>Problem Identification</Label>
                            <Input
                                value={formData.problemIdentification}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    problemIdentification: e.target.value
                                }))}
                            />
                        </div>

                        {/* Root Cause Analysis */}
                        <div>
                            <Label>Root Cause Analysis</Label>
                            <Input
                                value={formData.rootCauseAnalysis}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    rootCauseAnalysis: e.target.value
                                }))}
                            />
                        </div>

                        {/* Corrective Action */}
                        <div>
                            <Label>Corrective Action</Label>
                            <Input
                                value={formData.correctiveAction}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    correctiveAction: e.target.value
                                }))}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <Label>Status</Label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value as TeamKPIActual['status']
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
                    flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out 
                    ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full
                `}>
                    <div className="space-y-6 w-full">
                        <Breadcrumb
                            items={[
                                { label: 'MPM Actuals', path: '/performance-management/mpm/actual' },
                                { label: `${month} Actuals`, path: `/performance-management/mpm/actual/${mpmActualId}?month=${month}` }
                            ]}
                            currentPage={`MPM Actual ID: ${mpmActualId}`}
                            subtitle={`MPM Actual ID: ${mpmActualId} | Month: ${month}`}
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
                                </div>
                            </CardHeader>
                            <CardContent className="mt-4 space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="font-semibold text-[#1B6131] dark:text-[#46B749]">KPI Information</h3>
                                        <div className="space-y-2">
                                            <p><strong>KPI Name:</strong> {parentKPI.kpi}</p>
                                            <p><strong>Perspective:</strong> {parentKPI.perspective}</p>
                                            <p><strong>KPI Number:</strong> {parentKPI.kpiNumber}</p>
                                            <p><strong>Definition:</strong> {parentKPI.kpiDefinition}</p>
                                            <p><strong>Weight:</strong> {parentKPI.weight}%</p>
                                            <p><strong>Unit of Measurement:</strong> {parentKPI.uom}</p>
                                            <p><strong>Target {month}:</strong>{parentKPI.target}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Filter Section */}
                        <FilterSection>
                            <div className="space-y-3">
                                <label htmlFor="searchTerm" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <Search className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>Search</span>
                                </label>
                                <Input
                                    id="searchTerm"
                                    type="text"
                                    placeholder="Search by team name or action items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <Info className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                    <span>Status</span>
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none text-gray-900 dark:text-gray-100"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="On Track">On Track</option>
                                    <option value="At Risk">At Risk</option>
                                    <option value="Off Track">Off Track</option>
                                </select>
                            </div>
                        </FilterSection>

                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <div className="flex flex-row justify-between items-center">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        Team KPI Actuals
                                    </CardTitle>
                                    <Button 
                                        onClick={() => setIsAddDialogOpen(true)}
                                        className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                                    >
                                        Add Team KPI
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='m-0 p-0 pb-8'>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-4 text-center">Actions</th>
                                                <th className="p-4 text-center">Team</th>
                                                <th className="p-4 text-center">Target</th>
                                                <th className="p-4 text-center">Actual</th>
                                                <th className="p-4 text-center">Achievement (%)</th>
                                                <th className="p-4 text-center">Weight (%)</th>
                                                <th className="p-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((kpi) => (
                                                <tr
                                                    key={kpi.id}
                                                >
                                                    <td className="p-4 text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:text-[#1B6131]"
                                                                onClick={() => navigate(`/performance-management/mpm/actual/${mpmActualId}/entri/${mpmId}/teams/${kpi.teamId}`)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setSelectedTeamKPI(kpi);
                                                                    setIsEditDialogOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">{kpi.teamName}</td>
                                                    <td className="p-4 text-center">{kpi.target.toLocaleString()}</td>
                                                    <td className="p-4 text-center">{kpi.actual.toLocaleString()}</td>
                                                    <td className="p-4 text-center">{kpi.achievement}%</td>
                                                    <td className="p-4 text-center">{kpi.weight}%</td>
                                                    <td className="p-4 text-center">
                                                        <span className={`
                                                            px-2 py-1 rounded-full text-xs font-bold
                                                            ${kpi.status === 'On Track' ? 'bg-green-200 text-green-800' :
                                                                kpi.status === 'At Risk' ? 'bg-yellow-200 text-yellow-800' :
                                                                    'bg-red-200 text-red-800'}
                                                        `}>
                                                            {kpi.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            
                                            {/* Show message when no data is available */}
                                            {paginatedData.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                                        No team KPIs match your search criteria.
                                                    </td>
                                                </tr>
                                            )}
                                            
                                            {/* Total Row - only show if we have data */}
                                            {paginatedData.length > 0 && (
                                                <tr className="bg-[#1B6131] text-white font-bold">
                                                    <td className="p-4 text-center" colSpan={2}>Total</td>
                                                    <td className="p-4 text-center"></td>
                                                    <td className="p-4 text-center">{calculateTotals.total.toLocaleString()}</td>
                                                    <td className="p-4 text-center">{calculateTotals.averageAchievement.toFixed(2)}%</td>
                                                    <td className="p-4 text-center">{calculateTotals.totalWeight}%</td>
                                                    <td className="p-4 text-center"></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination Component */}
                                <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filteredData.length}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        expanded={paginationExpanded}
                                        onToggleExpand={togglePaginationExpand}
                                    />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Dialogs */}
            <TeamKPIDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddTeamKPI}
            />

            {selectedTeamKPI && (
                <TeamKPIDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSave={handleEditTeamKPI}
                    initialData={selectedTeamKPI}
                />
            )}
        </div>
    );
};

export default MPMActualsTeamKPI;