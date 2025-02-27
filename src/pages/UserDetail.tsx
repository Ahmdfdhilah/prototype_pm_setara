import { JSXElementConstructor, ReactElement, ReactNode, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    Calendar, 
    FileText, 
    CheckCircle2, 
    LineChart,
    Users,
    Award,
    Clock
} from 'lucide-react';

const UserDetailPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');

    // Dummy user data
    const userData = {
        id: "USR001",
        name: "Budi Santoso",
        email: "budi.santoso@company.com",
        phone: "+62 812-3456-7890",
        department: "Information Technology",
        position: "Senior Developer",
        joinDate: "15 March 2020",
        status: "Active",
        reportTo: "Bambang Widodo",
        location: "Jakarta HQ",
        image: null,
        performanceData: {
            mpmCompletionRate: 92,
            ipmCompletionRate: 87,
            overallScore: 3.4,
            performanceTrend: [75, 82, 78, 90, 95, 92]
        },
        roles: ["employee", "approver"]
    };

    // Dummy KPI data
    const kpiData = [
        { id: 1, name: "Code Quality", target: "< 2 bugs per sprint", achievement: "0.8 bugs per sprint", score: 4 },
        { id: 2, name: "Project Delivery", target: "100% on time", achievement: "98% on time", score: 3 },
        { id: 3, name: "Documentation", target: "100% completed", achievement: "85% completed", score: 2 },
        { id: 4, name: "Team Collaboration", target: "> 4.5/5 peer rating", achievement: "4.7/5 peer rating", score: 4 },
        { id: 5, name: "Knowledge Sharing", target: "2 sessions per month", achievement: "2 sessions per month", score: 3 }
    ];

    // Dummy action plans data
    const actionPlansData = [
        { id: 1, title: "Implement CI/CD Pipeline", status: "Completed", progress: 100, dueDate: "15 Jan 2025" },
        { id: 2, title: "Reduce Legacy Code Technical Debt", status: "In Progress", progress: 65, dueDate: "28 Feb 2025" },
        { id: 3, title: "API Documentation Update", status: "In Progress", progress: 40, dueDate: "15 Mar 2025" },
        { id: 4, title: "Code Review Process Improvement", status: "Planned", progress: 0, dueDate: "30 Apr 2025" }
    ];

    // Dummy approval history
    const approvalHistoryData = [
        { id: 1, item: "January MPM", status: "Approved", date: "02 Feb 2025", notes: "Excellent work on all KPIs" },
        { id: 2, item: "CI/CD Pipeline Action Plan", status: "Approved", date: "18 Jan 2025", notes: "Successfully implemented ahead of schedule" },
        { id: 3, item: "December MPM", status: "Approved with Comments", date: "05 Jan 2025", notes: "Good progress, improve documentation completion rate" },
        { id: 4, item: "Q4 Performance Review", status: "Approved", date: "20 Dec 2024", notes: "Strong end of year performance" }
    ];

    // Function to render status badge with appropriate color
    const renderStatusBadge = (status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => {
        let className = "text-xs font-medium py-1 px-2 rounded-full ";
        
        switch(status) {
            case "Active":
                className += "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
                break;
            case "Inactive":
                className += "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
                break;
            case "Suspended":
                className += "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
                break;
            default:
                className += "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        }
        
        return <span className={className}>{status}</span>;
    };

    // Function to render progress bar
    const renderProgressBar = (progress: number) => {
        let className = "h-2 rounded-full ";
        
        if (progress < 25) {
            className += "bg-red-500";
        } else if (progress < 50) {
            className += "bg-yellow-500";
        } else if (progress < 75) {
            className += "bg-blue-500";
        } else {
            className += "bg-green-500";
        }
        
        return (
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className={className} style={{ width: `${progress}%` }}></div>
            </div>
        );
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

                <main className={`flex-1 px-8 pt-20 pb-12 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-[#1B6131] dark:text-[#46B749]">
                            User Detail
                        </h1>
                        <div className="space-x-3">
                            <Button 
                                variant="outline" 
                                className="border-[#1B6131] text-[#1B6131] hover:bg-[#f0f9f0] dark:border-[#46B749] dark:text-[#46B749] dark:hover:bg-[#0a2e14]"
                            >
                                Edit User
                            </Button>
                            <Button 
                                className="bg-[#1B6131] hover:bg-[#144d27] text-white dark:bg-[#46B749] dark:hover:bg-[#3da33f]"
                            >
                                Reset Password
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* User Profile Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md lg:col-span-1">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] flex flex-col items-center">
                                <Avatar className="h-24 w-24 mb-4 border-4 border-white dark:border-gray-800">
                                    <AvatarFallback className="bg-[#1B6131] text-white dark:bg-[#46B749] text-2xl">
                                        {userData.name.split(' ').map(name => name[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-center text-[#1B6131] dark:text-[#46B749]">
                                    {userData.name}
                                </CardTitle>
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    {userData.roles.map((role, index) => (
                                        <Badge 
                                            key={index}
                                            className="bg-[#1B6131] hover:bg-[#1B6131] dark:bg-[#46B749] dark:hover:bg-[#46B749]"
                                        >
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="mt-4 w-full">
                                    {renderStatusBadge(userData.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-sm">{userData.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                            <p className="text-sm">{userData.phone}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Briefcase className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                                            <p className="text-sm">{userData.department}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Position</p>
                                            <p className="text-sm">{userData.position}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Users className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Reports to</p>
                                            <p className="text-sm">{userData.reportTo}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                                            <p className="text-sm">{userData.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-[#1B6131] dark:text-[#46B749] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Join Date</p>
                                            <p className="text-sm">{userData.joinDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Summary Card */}
                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md lg:col-span-2">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    <Award className="mr-2 h-5 w-5" />
                                    Performance Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-[#f0f9f0] dark:bg-[#0a2e14] p-4 rounded-lg border border-[#46B749] dark:border-[#1B6131]">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                            <FileText className="h-4 w-4 mr-1 text-[#1B6131] dark:text-[#46B749]" />
                                            MPM Completion
                                        </p>
                                        <p className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                                            {userData.performanceData.mpmCompletionRate}%
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-1">
                                            <div 
                                                className="bg-[#1B6131] dark:bg-[#46B749] h-2 rounded-full" 
                                                style={{ width: `${userData.performanceData.mpmCompletionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#f0f9f0] dark:bg-[#0a2e14] p-4 rounded-lg border border-[#46B749] dark:border-[#1B6131]">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                            <Users className="h-4 w-4 mr-1 text-[#1B6131] dark:text-[#46B749]" />
                                            IPM Completion
                                        </p>
                                        <p className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                                            {userData.performanceData.ipmCompletionRate}%
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-1">
                                            <div 
                                                className="bg-[#1B6131] dark:bg-[#46B749] h-2 rounded-full" 
                                                style={{ width: `${userData.performanceData.ipmCompletionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#f0f9f0] dark:bg-[#0a2e14] p-4 rounded-lg border border-[#46B749] dark:border-[#1B6131]">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                            <CheckCircle2 className="h-4 w-4 mr-1 text-[#1B6131] dark:text-[#46B749]" />
                                            Overall Score
                                        </p>
                                        <p className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                                            {userData.performanceData.overallScore}/4.0
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-1">
                                            <div 
                                                className="bg-[#1B6131] dark:bg-[#46B749] h-2 rounded-full" 
                                                style={{ width: `${(userData.performanceData.overallScore / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-[#f0f9f0] dark:bg-[#0a2e14] p-4 rounded-lg border border-[#46B749] dark:border-[#1B6131] mb-4">
                                    <h4 className="font-semibold mb-2 flex items-center text-sm">
                                        <LineChart className="h-4 w-4 mr-2 text-[#1B6131] dark:text-[#46B749]" />
                                        Performance Trend (Last 6 Months)
                                    </h4>
                                    <div className="h-16 flex items-end space-x-1">
                                        {userData.performanceData.performanceTrend.map((value, index) => (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div 
                                                    className="w-full bg-[#1B6131] dark:bg-[#46B749] rounded-t" 
                                                    style={{ height: `${(value / 100) * 60}px` }}
                                                ></div>
                                                <span className="text-xs mt-1">{index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="kpi" className="mt-8">
                        <TabsList className="bg-[#e6f3e6] dark:bg-[#0a3419] mb-6">
                            <TabsTrigger value="kpi">KPI Data</TabsTrigger>
                            <TabsTrigger value="action-plans">Action Plans</TabsTrigger>
                            <TabsTrigger value="approvals">Approval History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="kpi" className="space-y-4">
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Current KPIs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">KPI Name</th>
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Target</th>
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Achievement</th>
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kpiData.map((kpi) => (
                                                    <tr key={kpi.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <td className="p-3 text-sm">{kpi.name}</td>
                                                        <td className="p-3 text-sm">{kpi.target}</td>
                                                        <td className="p-3 text-sm">{kpi.achievement}</td>
                                                        <td className="p-3 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                                ${kpi.score >= 3 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                                                kpi.score >= 2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                                                kpi.score >= 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
                                                            >
                                                                {kpi.score}/4
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="action-plans" className="space-y-4">
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                        Current Action Plans
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {actionPlansData.map((plan) => (
                                            <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium">{plan.title}</h4>
                                                    <Badge 
                                                        className={`
                                                            ${plan.status === 'Completed' ? 'bg-green-500 hover:bg-green-500' : 
                                                            plan.status === 'In Progress' ? 'bg-blue-500 hover:bg-blue-500' : 
                                                            'bg-gray-500 hover:bg-gray-500'}
                                                        `}
                                                    >
                                                        {plan.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        Due: {plan.dueDate}
                                                    </div>
                                                    <div>{plan.progress}% complete</div>
                                                </div>
                                                {renderProgressBar(plan.progress)}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="approvals" className="space-y-4">
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] text-lg flex items-center">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Recent Approval History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Item</th>
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                                                    <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {approvalHistoryData.map((item) => (
                                                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <td className="p-3 text-sm">{item.item}</td>
                                                        <td className="p-3 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                                ${item.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                                                item.status === 'Approved with Comments' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                                                item.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-sm">{item.date}</td>
                                                        <td className="p-3 text-sm">{item.notes}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default UserDetailPage;