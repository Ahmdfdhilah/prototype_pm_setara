import { useRef, useState } from 'react';
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
import { Plus, Save, Trash2, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

// Types
type Perspective = 'Financial' | 'Customer' | 'Internal Business Process' | 'Learning & Growth';
type UOM = 'Currency' | 'Number' | 'Days' | '%' | 'Kriteria';
type Category = 'Max' | 'Min' | 'On Target' | 'Max is 100' | 'Min is 0';
type Calculation = 'Average' | 'Accumulative' | 'Last Value';

interface KPIEntry {
    perspective: Perspective;
    code: string;
    kpi: string;
    kpiDefinition: string;
    weight: number;
    uom: UOM;
    category: Category;
    calculation: Calculation;
    target: number;
    relatedPIC: string;
}

const BSCInputPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [entries, setEntries] = useState<KPIEntry[]>([]);
    const [newEntry, setNewEntry] = useState<KPIEntry>({
        perspective: 'Financial',
        code: '',
        kpi: '',
        kpiDefinition: '',
        weight: 0,
        uom: 'Currency',
        category: 'Max',
        calculation: 'Average',
        target: 0,
        relatedPIC: ''
    });

    const handleInputChange = (field: keyof KPIEntry, value: string | number) => {
        setNewEntry(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddEntry = () => {
        setEntries(prev => [...prev, newEntry]);
        setNewEntry({
            perspective: 'Financial',
            code: '',
            kpi: '',
            kpiDefinition: '',
            weight: 0,
            uom: 'Currency',
            category: 'Max',
            calculation: 'Average',
            target: 0,
            relatedPIC: ''
        });
    };

    const handleDeleteEntry = (index: number) => {
        setEntries(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveAll = () => {
        console.log('Saving entries:', entries);
        // Implement your save logic here
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Transform the Excel data to match KPIEntry format
                    const newEntries = jsonData.map((row: any) => ({
                        perspective: row.Perspective,
                        code: row.Code,
                        kpi: row.KPI,
                        kpiDefinition: row['KPI Definition'],
                        weight: Number(row.Weight),
                        uom: row.UOM,
                        category: row.Category,
                        calculation: row['YTD Calculation'],
                        target: Number(row.Target),
                        relatedPIC: row['Related PIC']
                    }));

                    setEntries(prev => [...prev, ...newEntries]);
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    // You might want to add error handling UI here
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="font-proxima min-h-screen bg-white dark:bg-gray-900">
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
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                                BSC Input Data
                            </h1>
                            <div className="flex gap-4">
                                {/* Add Excel Import Button */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Import Excel
                                </Button>
                                <Button
                                    onClick={handleSaveAll}
                                    className="bg-[#1B6131] hover:bg-[#46B749] text-white"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save All
                                </Button>
                            </div>
                        </div>

                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    Add New KPI
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Perspective</label>
                                        <Select
                                            value={newEntry.perspective}
                                            onValueChange={(value) => handleInputChange('perspective', value as Perspective)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select perspective" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Financial">Financial</SelectItem>
                                                <SelectItem value="Customer">Customer</SelectItem>
                                                <SelectItem value="Internal Business Process">Internal Business Process</SelectItem>
                                                <SelectItem value="Learning & Growth">Learning & Growth</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Code</label>
                                        <Input
                                            value={newEntry.code}
                                            onChange={(e) => handleInputChange('code', e.target.value)}
                                            placeholder="Enter code"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">KPI</label>
                                        <Input
                                            value={newEntry.kpi}
                                            onChange={(e) => handleInputChange('kpi', e.target.value)}
                                            placeholder="Enter KPI"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">KPI Definition</label>
                                        <Input
                                            value={newEntry.kpiDefinition}
                                            onChange={(e) => handleInputChange('kpiDefinition', e.target.value)}
                                            placeholder="Enter KPI definition"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Weight (%)</label>
                                        <Input
                                            type="number"
                                            value={newEntry.weight}
                                            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                                            placeholder="Enter weight"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">UOM</label>
                                        <Select
                                            value={newEntry.uom}
                                            onValueChange={(value) => handleInputChange('uom', value as UOM)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select UOM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Currency">Currency</SelectItem>
                                                <SelectItem value="Number">Number</SelectItem>
                                                <SelectItem value="Days">Days</SelectItem>
                                                <SelectItem value="%">%</SelectItem>
                                                <SelectItem value="Kriteria">Kriteria</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <Select
                                            value={newEntry.category}
                                            onValueChange={(value) => handleInputChange('category', value as Category)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Max">Max</SelectItem>
                                                <SelectItem value="Min">Min</SelectItem>
                                                <SelectItem value="On Target">On Target</SelectItem>
                                                <SelectItem value="Max is 100">Max is 100</SelectItem>
                                                <SelectItem value="Min is 0">Min is 0</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">YTD Calculation</label>
                                        <Select
                                            value={newEntry.calculation}
                                            onValueChange={(value) => handleInputChange('calculation', value as Calculation)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select calculation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Average">Average</SelectItem>
                                                <SelectItem value="Accumulative">Accumulative</SelectItem>
                                                <SelectItem value="Last Value">Last Value</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Target</label>
                                        <Input
                                            type="number"
                                            value={newEntry.target}
                                            onChange={(e) => handleInputChange('target', parseFloat(e.target.value))}
                                            placeholder="Enter target"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Related PIC</label>
                                        <Input
                                            value={newEntry.relatedPIC}
                                            onChange={(e) => handleInputChange('relatedPIC', e.target.value)}
                                            placeholder="Enter related PIC"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddEntry}
                                    className="bg-[#1B6131] hover:bg-[#46B749] text-white mt-4"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Entry
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                                    KPI Entries
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto  mt-4">
                                    <table className="w-full">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-4 text-left">Perspective</th>
                                                <th className="p-4 text-left">Code</th>
                                                <th className="p-4 text-left">KPI</th>
                                                <th className="p-4 text-left">Weight</th>
                                                <th className="p-4 text-left">UOM</th>
                                                <th className="p-4 text-left">Category</th>
                                                <th className="p-4 text-left">Calculation</th>
                                                <th className="p-4 text-left">Target</th>
                                                <th className="p-4 text-left">Related PIC</th>
                                                <th className="p-4 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry, index) => (
                                                <tr key={index} className="border-b hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20">
                                                    <td className="p-4">{entry.perspective}</td>
                                                    <td className="p-4">{entry.code}</td>
                                                    <td className="p-4">{entry.kpi}</td>
                                                    <td className="p-4">{entry.weight}%</td>
                                                    <td className="p-4">{entry.uom}</td>
                                                    <td className="p-4">{entry.category}</td>
                                                    <td className="p-4">{entry.calculation}</td>
                                                    <td className="p-4">{entry.target}</td>
                                                    <td className="p-4">{entry.relatedPIC}</td>
                                                    <td className="p-4">
                                                        <Button
                                                            onClick={() => handleDeleteEntry(index)}
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
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

export default BSCInputPage;