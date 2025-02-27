import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Send, Save, Edit2, CheckCircle2, XCircle } from 'lucide-react';

// Types
type IPMStatus = 'Draft' | 'Sent to Approver' | 'Sent to SM' | 'Validate by SM';
type ActionType = 'Otomatis' | 'Manual';

interface IPMEntry {
    id: string;
    title: string;
    description: string;
    actionType: ActionType;
    status: IPMStatus;
    targetDate: string;
    achievement: number;
    comments: string;
}
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    className = '',
    error,
    ...props
}) => {
    return (
        <div className="relative w-full">
            <textarea
                className={`
            w-full
            min-h-[80px]
            px-3 
            py-2 
            text-sm
            rounded-md
            border
            border-gray-300
            bg-white
            dark:bg-gray-800
            dark:border-gray-600
            placeholder:text-gray-400
            dark:placeholder:text-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-[#46B749]
            focus:border-transparent
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};

const IPMPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('employee'); // employee, approver, sm_dept
    const [entries, setEntries] = useState<IPMEntry[]>([]);
    const [newEntry, setNewEntry] = useState<IPMEntry>({
        id: '',
        title: '',
        description: '',
        actionType: 'Manual',
        status: 'Draft',
        targetDate: '',
        achievement: 0,
        comments: ''
    });

    const handleInputChange = (field: keyof IPMEntry, value: string | number) => {
        setNewEntry(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddEntry = () => {
        const entry = {
            ...newEntry,
            id: Date.now().toString()
        };
        setEntries(prev => [...prev, entry]);
        setNewEntry({
            id: '',
            title: '',
            description: '',
            actionType: 'Manual',
            status: 'Draft',
            targetDate: '',
            achievement: 0,
            comments: ''
        });
    };

    const handleSubmitToApprover = (entryId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Sent to Approver' }
                : entry
        ));
    };

    const handleApprove = (entryId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Sent to SM' }
                : entry
        ));
    };

    const handleValidate = (entryId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Validate by SM' }
                : entry
        ));
    };

    const handleRecall = (entryId: string) => {
        setEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Draft' }
                : entry
        ));
    };

    const getStatusColor = (status: IPMStatus) => {
        switch (status) {
            case 'Draft':
                return 'bg-gray-200 text-gray-700';
            case 'Sent to Approver':
                return 'bg-blue-200 text-blue-700';
            case 'Sent to SM':
                return 'bg-yellow-200 text-yellow-700';
            case 'Validate by SM':
                return 'bg-green-200 text-green-700';
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-proxima">
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

                <main className={`flex-1 px-8 pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                            Individual Performance Management
                        </h1>

                        {currentRole === 'employee' && (
                            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                                <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                        Add New Action Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                value={newEntry.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="Enter action plan title"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Action Type</label>
                                            <Select
                                                value={newEntry.actionType}
                                                onValueChange={(value) => handleInputChange('actionType', value as ActionType)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select action type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Otomatis">Otomatis</SelectItem>
                                                    <SelectItem value="Manual">Manual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <TextArea
                                                value={newEntry.description}
                                                onChange={(e: { target: { value: string | number; }; }) => handleInputChange('description', e.target.value)}
                                                placeholder="Enter action plan description"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Target Date</label>
                                            <Input
                                                type="date"
                                                value={newEntry.targetDate}
                                                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Achievement (%)</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={newEntry.achievement}
                                                onChange={(e) => handleInputChange('achievement', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleAddEntry}
                                        className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Action Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    Action Plans
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto mt-4">
                                    <table className="w-full">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-4 text-left">Title</th>
                                                <th className="p-4 text-left">Description</th>
                                                <th className="p-4 text-left">Type</th>
                                                <th className="p-4 text-left">Target Date</th>
                                                <th className="p-4 text-left">Achievement</th>
                                                <th className="p-4 text-left">Status</th>
                                                <th className="p-4 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry) => (
                                                <tr key={entry.id} className="border-b hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20">
                                                    <td className="p-4">{entry.title}</td>
                                                    <td className="p-4">{entry.description}</td>
                                                    <td className="p-4">{entry.actionType}</td>
                                                    <td className="p-4">{entry.targetDate}</td>
                                                    <td className="p-4">{entry.achievement}%</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                                                            {entry.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex space-x-2">
                                                            {currentRole === 'employee' && entry.status === 'Draft' && (
                                                                <>
                                                                    <Button
                                                                        onClick={() => handleSubmitToApprover(entry.id)}
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                                                        size="sm"
                                                                    >
                                                                        <Send className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                                                                        size="sm"
                                                                    >
                                                                        <Edit2 className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {currentRole === 'approver' && entry.status === 'Sent to Approver' && (
                                                                <>
                                                                    <Button
                                                                        onClick={() => handleApprove(entry.id)}
                                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                                        size="sm"
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleRecall(entry.id)}
                                                                        variant="destructive"
                                                                        size="sm"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {currentRole === 'sm_dept' && entry.status === 'Sent to SM' && (
                                                                <Button
                                                                    onClick={() => handleValidate(entry.id)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                                    size="sm"
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
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
        </div>
    );
};

export default IPMPage;