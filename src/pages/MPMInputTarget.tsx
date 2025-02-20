import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import { Edit, Send } from 'lucide-react';
import Header from '@/components/Header';

// Types
type Perspective =
  | 'Financial'
  | 'Customer'
  | 'Internal Business Process'
  | 'Learning & Growth';
type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria';

type MPMEntry = {
  perspective: Perspective;
  kpiNumber: number;
  kpi: string;
  kpiDefinition: string;
  weight: number;
  uom: UOMType;
  category: Category;
  ytdCalculation: YTDCalculation;
  targets: {
    'Jan-25': number;
    'Feb-25': number;
    'Mar-25': number;
  };
};

const MPMInfoTarget = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');
  const [isCreateKPIOpen, setIsCreateKPIOpen] = useState(false);
  const [sendToApproverOpen, setSendToApproverOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<MPMEntry | null>(null);

  // Sample data structure matching the image
  const [mpmData, setMpmData] = useState<MPMEntry[]>([
    {
      perspective: 'Financial',
      kpiNumber: 1,
      kpi: 'Profit / Loss',
      kpiDefinition: 'Rasio keuntungan',
      weight: 15,
      uom: '%',
      category: 'Max',
      ytdCalculation: 'Last Value',
      targets: {
        'Jan-25': 5,
        'Feb-25': 5,
        'Mar-25': 5,
      },
    },
    {
      perspective: 'Financial',
      kpiNumber: 2,
      kpi: 'Total Penjualan',
      kpiDefinition: 'Total penjualan',
      weight: 40,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      targets: {
        'Jan-25': 10,
        'Feb-25': 10,
        'Mar-25': 10,
      },
    },
    {
      perspective: 'Customer',
      kpiNumber: 1,
      kpi: 'Jumlah Customer',
      kpiDefinition: 'Jumlah customer',
      weight: 15,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      targets: {
        'Jan-25': 10,
        'Feb-25': 10,
        'Mar-25': 10,
      },
    },
    {
      perspective: 'Internal Business Process',
      kpiNumber: 1,
      kpi: 'Jumlah Supplier',
      kpiDefinition: 'Jumlah supplier',
      weight: 15,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      targets: {
        'Jan-25': 10,
        'Feb-25': 10,
        'Mar-25': 10,
      },
    },
    {
      perspective: 'Learning & Growth',
      kpiNumber: 1,
      kpi: 'Jumlah Training',
      kpiDefinition: 'Jumlah training',
      weight: 15,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      targets: {
        'Jan-25': 5,
        'Feb-25': 5,
        'Mar-25': 5,
      },
    },
  ]);

  // Edit Dialog Component
  const EditKPIDialog = () => {
    if (!selectedKPI) return null;

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit KPI</DialogTitle>
            <DialogDescription>
              View and edit KPI details below
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Perspective</Label>
              <Input value={selectedKPI.perspective} disabled />
            </div>

            <div className="space-y-2">
              <Label>KPI Number</Label>
              <Input value={selectedKPI.kpiNumber} disabled />
            </div>

            <div className="space-y-2">
              <Label>KPI</Label>
              <Input value={selectedKPI.kpi} disabled />
            </div>

            <div className="space-y-2">
              <Label>KPI Definition</Label>
              <Input value={selectedKPI.kpiDefinition} disabled />
            </div>

            <div className="space-y-2">
              <Label>Weight (%)</Label>
              <Input value={selectedKPI.weight} disabled />
            </div>

            <div className="space-y-2">
              <Label>UOM</Label>
              <Input value={selectedKPI.uom} disabled />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={selectedKPI.category} disabled />
            </div>

            <div className="space-y-2">
              <Label>YTD Calculation</Label>
              <Input value={selectedKPI.ytdCalculation} disabled />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Jan-25 Target</Label>
              <Input value={selectedKPI.targets['Jan-25']} disabled />
            </div>

            <div className="space-y-2">
              <Label>Feb-25 Target</Label>
              <Input value={selectedKPI.targets['Feb-25']} disabled />
            </div>

            <div className="space-y-2">
              <Label>Mar-25 Target</Label>
              <Input value={selectedKPI.targets['Mar-25']} disabled />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Dialog for sending to approver
  const SendToApproverDialog = () => (
    <Dialog open={sendToApproverOpen} onOpenChange={setSendToApproverOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send to Approver</DialogTitle>
          <DialogDescription>
            Are you sure you want to send this MPM target for approval?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSendToApproverOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle send to approver logic here
              setSendToApproverOpen(false);
            }}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Create KPI Dialog
  const CreateKPIDialog = () => {
    const [newKPI, setNewKPI] = useState<Partial<MPMEntry>>({});

    const handleSave = () => {
      if (newKPI.perspective && newKPI.kpi) {
        setMpmData((prev) => [
          ...prev,
          {
            ...newKPI,
            kpiNumber:
              prev.filter((item) => item.perspective === newKPI.perspective)
                .length + 1,
            targets: { 'Jan-25': 0, 'Feb-25': 0, 'Mar-25': 0 },
          } as MPMEntry,
        ]);
        setIsCreateKPIOpen(false);
      }
    };

    return (
      <Dialog open={isCreateKPIOpen} onOpenChange={setIsCreateKPIOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create KPI</DialogTitle>
            <DialogDescription>
              Add a new KPI to the MPM system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              onValueChange={(value) =>
                setNewKPI({ ...newKPI, perspective: value as Perspective })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Perspective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Internal Business Process">
                  Internal Business Process
                </SelectItem>
                <SelectItem value="Learning & Growth">
                  Learning & Growth
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Add more form fields for KPI creation */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateKPIOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save KPI</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Group data by perspective
  const groupedData = useMemo(() => {
    return mpmData.reduce((acc, curr) => {
      if (!acc[curr.perspective]) {
        acc[curr.perspective] = [];
      }
      acc[curr.perspective].push(curr);
      return acc;
    }, {} as Record<Perspective, MPMEntry[]>);
  }, [mpmData]);

  // Handle edit button click
  const handleEditClick = (item: MPMEntry) => {
    setSelectedKPI(item);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      <div className="flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          role={currentRole}
          system="performance-management"
        />

        <main
          className={`flex-1 px-8 pt-20 lg:ml-64 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-24' : 'ml-0'
          }`}
        >
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1B6131] dark:text-[#46B749]">
                MPM Info - Input Target
              </h1>
              <div className="space-x-4">
                <Button
                  onClick={() => setIsCreateKPIOpen(true)}
                  className="bg-[#1B6131] hover:bg-[#46B749]"
                >
                  Create KPI
                </Button>
                <Button
                  variant="outline"
                  className="border-[#1B6131] text-[#1B6131] hover:bg-[#E4EFCF]"
                  onClick={() => setSendToApproverOpen(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send to Approver
                </Button>
              </div>
            </div>

            {/* Main Card */}
            <Card className="border-[#46B749] dark:border-[#1B6131]">
              <CardHeader>
                <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                  KPI Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#1B6131] text-white">
                      <tr>
                        <th className="p-4 text-center">Action</th>
                        <th className="p-4 text-left">KPI</th>
                        <th className="p-4 text-left">KPI Definition</th>
                        <th className="p-4 text-center">Weight</th>
                        <th className="p-4 text-center">UOM</th>
                        <th className="p-4 text-center">Category</th>
                        <th className="p-4 text-center">YTD Calculation</th>
                        <th className="p-4 text-center">Jan-25</th>
                        <th className="p-4 text-center">Feb-25</th>
                        <th className="p-4 text-center">Mar-25</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedData).map(
                        ([perspective, items]) => (
                          <>
                            <tr
                              key={perspective}
                              className="bg-[#E4EFCF] dark:bg-[#1B6131]/30"
                            >
                              <td
                                colSpan={10}
                                className="p-4 font-medium text-[#1B6131] dark:text-[#46B749]"
                              >
                                {perspective}
                              </td>
                            </tr>
                            {items.map((item) => (
                              <tr
                                key={`${item.perspective}-${item.kpiNumber}`}
                                className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20"
                              >
                                <td className="p-4 text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-[#1B6131]"
                                    onClick={() => handleEditClick(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </td>
                                <td className="p-4">{item.kpi}</td>
                                <td className="p-4">{item.kpiDefinition}</td>
                                <td className="p-4 text-center">
                                  {item.weight}%
                                </td>
                                <td className="p-4 text-center">{item.uom}</td>
                                <td className="p-4 text-center">
                                  {item.category}
                                </td>
                                <td className="p-4 text-center">
                                  {item.ytdCalculation}
                                </td>
                                <td className="p-4 text-center">
                                  {item.targets['Jan-25']}
                                </td>
                                <td className="p-4 text-center">
                                  {item.targets['Feb-25']}
                                </td>
                                <td className="p-4 text-center">
                                  {item.targets['Mar-25']}
                                </td>
                              </tr>
                            ))}
                          </>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <CreateKPIDialog />
      <SendToApproverDialog />
      <EditKPIDialog />
    </div>
  );
};

export default MPMInfoTarget;
