import { useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Plus, Save, Trash2, FileSpreadsheet, Edit } from 'lucide-react';
import * as XLSX from 'xlsx';
import KPIFormDialog from '@/components/BSC/KPIFormDialog';
import { BSCEntry } from '@/lib/types';
import Breadcrumb from '@/components/Breadcrumb';


const BSCEntryPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentRole, setCurrentRole] = useState('admin');
    const [entries, setEntries] = useState<BSCEntry[]>([]);

    // State for dialog management
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEditingEntry, setCurrentEditingEntry] = useState<Partial<BSCEntry> | undefined>(undefined);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

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
                    const newEntries: BSCEntry[] = jsonData.map((row: any) => ({
                        perspective: row.Perspective,
                        code: row.code,
                        kpiNumber: 0,
                        kpi: row.KPI,
                        kpiDefinition: row['KPI Definition'],
                        weight: Number(row.Weight),
                        uom: row.UOM,
                        category: row.Category,
                        ytdCalculation: row['YTD Calculation'],
                        relatedPIC: row['Related PIC'],
                        target: Number(row.Target)
                    }));

                    setEntries(prev => [...prev, ...newEntries]);
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleOpenCreateDialog = () => {
        console.log(currentEditingEntry);
        setCurrentEditingEntry(undefined);
        setDialogMode('create');
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (entry: BSCEntry) => {
        console.log(entry);
        setCurrentEditingEntry({ ...entry });
        setDialogMode('edit');
        setIsDialogOpen(true);
    };

    const handleSaveKPI = (kpi: BSCEntry) => {
        if (dialogMode === 'create') {
            // Add new entry
            setEntries(prev => [...prev, { ...kpi, id: Date.now() }]);
        } else {
            // Edit existing entry
            setEntries(prev =>
                prev.map(entry =>
                    entry.id === currentEditingEntry?.id ? { ...kpi, id: entry.id } : entry
                )
            );
        }
        setIsDialogOpen(false);
    };

    const handleDeleteEntry = (id: number) => {
        setEntries(prev => prev.filter(entry => entry.id !== undefined && entry.id === id));
    };

    const handleSaveAll = () => {
        console.log('Saving entries:', entries);
        // Implement your save logic here
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

                <main className={`
                    flex-1 
                    px-2 
                    sm:px-4 
                    lg:px-6 
                    pt-16 
                    sm:pt-18 
                    lg:pt-20 
                    transition-all 
                    duration-300 
                    ease-in-out 
                    ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
                    w-full
                `}>
                    <div className="space-y-6 max-w-full">
                        <Breadcrumb
                            items={[]}
                            currentPage="BSC Input Data"
                            showHomeIcon={true}
                        />
                        <Card className="border-[#46B749] dark:border-[#1B6131]">
                            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex p-0">
                                        KPI Entries
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-start sm:justify-end">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept=".xlsx,.xls"
                                            className="hidden"
                                        />
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-[#1B6131] hover:bg-[#46B749] text-white w-full sm:w-auto"
                                            size="sm"
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            Import Excel
                                        </Button>
                                        <Button
                                            onClick={handleSaveAll}
                                            className="bg-[#1B6131] hover:bg-[#46B749] text-white w-full sm:w-auto"
                                            size="sm"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save All
                                        </Button>
                                        <Button
                                            onClick={handleOpenCreateDialog}
                                            className="bg-[#1B6131] hover:bg-[#46B749] text-white w-full sm:w-auto"
                                            size="sm"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add KPI
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="dark:bg-gray-900 mt-2 p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="bg-[#1B6131] text-white">
                                            <tr>
                                                <th className="p-4 text-left">Perspective</th>
                                                <th className="p-4 text-left">Code</th>
                                                <th className="p-4 text-left">KPI</th>
                                                <th className="p-4 text-left">Weight</th>
                                                <th className="p-4 text-left">UOM</th>
                                                <th className="p-4 text-left">Category</th>
                                                <th className="p-4 text-left">Target</th>
                                                <th className="p-4 text-left">Related PIC</th>
                                                <th className="p-4 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry) => (
                                                <tr key={entry.id} className="border-b hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20">
                                                    <td className="p-4">{entry.perspective}</td>
                                                    <td className="p-4">{entry.code}</td>
                                                    <td className="p-4">{entry.kpi}</td>
                                                    <td className="p-4">{entry.weight}%</td>
                                                    <td className="p-4">{entry.uom}</td>
                                                    <td className="p-4">{entry.category}</td>
                                                    <td className="p-4">{entry.target}</td>
                                                    <td className="p-4">{entry.relatedPIC}</td>
                                                    <td className="p-4 flex space-x-2">
                                                        <Button
                                                            onClick={() => handleOpenEditDialog(entry)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteEntry(entry.id!)}
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
                                    {entries.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No KPI entries added yet. Click "Add KPI" to create an entry.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* KPI Form Dialog */}
                        <KPIFormDialog
                            isOpen={isDialogOpen}
                            onClose={() => {
                                setIsDialogOpen(false);
                                setCurrentEditingEntry(undefined);
                            }}
                            onSave={handleSaveKPI}
                            initialData={currentEditingEntry || {}}
                            mode={dialogMode}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BSCEntryPage;