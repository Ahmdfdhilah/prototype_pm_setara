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
import { Edit, PlusCircle, Send } from 'lucide-react';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

// Types
type Perspective =
  | 'Financial'
  | 'Customer'
  | 'Internal Business Process'
  | 'Learning & Growth';
type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria';
type ActionPlan = {
  id: string;
  description: string;
  responsiblePerson: string;
  deadline: string;
};

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
  actionPlans: ActionPlan[];
};

// Definisi tipe untuk approver
type Approver = {
  id: string;
  name: string;
  position: string;
  department: string;
};

const MPMInfoTarget = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');
  const [isCreateKPIOpen, setIsCreateKPIOpen] = useState(false);
  const [sendToApproverOpen, setSendToApproverOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<MPMEntry | null>(null);
  const [selectedApprover, setSelectedApprover] = useState<string>('');

  // Sample data untuk approvers
  const approvers: Approver[] = [
    { id: 'app1', name: 'Budi Santoso', position: 'Manager', department: 'Performance Management' },
    { id: 'app2', name: 'Rina Wijaya', position: 'Senior Manager', department: 'Operations' },
    { id: 'app3', name: 'Agus Purnomo', position: 'Director', department: 'Business Development' },
    { id: 'app4', name: 'Dewi Kartika', position: 'VP', department: 'Human Resources' },
  ];

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
      actionPlans: [
        {
          id: 'ap1',
          description: 'Meningkatkan penjualan produk A',
          responsiblePerson: 'Budi Santoso',
          deadline: '2025-01-31',
        },
      ],
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
      actionPlans: [
        {
          id: 'ap1',
          description: 'Meningkatkan penjualan produk B',
          responsiblePerson: 'Budi Santoso',
          deadline: '2025-01-31',
        },
      ],
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
      actionPlans: [
        {
          id: 'ap1',
          description: 'Meningkatkan penjualan produk C',
          responsiblePerson: 'Budi Santoso',
          deadline: '2025-01-31',
        },
      ],
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
      actionPlans: [
        {
          id: 'ap1',
          description: 'Meningkatkan penjualan produk D',
          responsiblePerson: 'Budi Santoso',
          deadline: '2025-01-31',
        },
      ],
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
      actionPlans: [
        {
          id: 'ap1',
          description: 'Meningkatkan penjualan produk E',
          responsiblePerson: 'Budi Santoso',
          deadline: '2025-01-31',
        },
      ],
    },
  ]);

  // Edit Dialog Component
  const EditKPIDialog = () => {
    if (!selectedKPI) return null;
    const [newActionPlan, setNewActionPlan] = useState<Partial<ActionPlan>>({});

    const handleAddActionPlan = () => {
      if (newActionPlan.description && newActionPlan.responsiblePerson && newActionPlan.deadline) {
        const updatedKPI = {
          ...selectedKPI,
          actionPlans: [
            ...selectedKPI.actionPlans,
            {
              id: `ap${selectedKPI.actionPlans.length + 1}`,
              description: newActionPlan.description,
              responsiblePerson: newActionPlan.responsiblePerson,
              deadline: newActionPlan.deadline,
            } as ActionPlan,
          ],
        };
        setMpmData((prev) =>
          prev.map((item) =>
            item.kpiNumber === selectedKPI.kpiNumber &&
              item.perspective === selectedKPI.perspective
              ? updatedKPI
              : item
          )
        );
        setSelectedKPI(updatedKPI);
        setNewActionPlan({});
      }
    };

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl  overflow-y-scroll max-h-[85vh]">
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

          <div className="mt-6">
            <h3 className="text-lg font-medium text-[#1B6131] dark:text-[#46B749]">
              Action Plans
            </h3>
            <div className="space-y-4 mt-2">
              {selectedKPI.actionPlans.map((actionPlan) => (
                <div key={actionPlan.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm">{actionPlan.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Responsible: {actionPlan.responsiblePerson}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deadline: {actionPlan.deadline}
                  </p>
                </div>
              ))}
              <div className="space-y-2">
                <Label>New Action Plan</Label>
                <Input
                  placeholder="Description"
                  value={newActionPlan.description || ''}
                  onChange={(e) =>
                    setNewActionPlan({ ...newActionPlan, description: e.target.value })
                  }
                />
                <Input
                  placeholder="Responsible Person"
                  value={newActionPlan.responsiblePerson || ''}
                  onChange={(e) =>
                    setNewActionPlan({ ...newActionPlan, responsiblePerson: e.target.value })
                  }
                />
                <Input
                  type="date"
                  placeholder="Deadline"
                  value={newActionPlan.deadline || ''}
                  onChange={(e) =>
                    setNewActionPlan({ ...newActionPlan, deadline: e.target.value })
                  }
                />
                <Button onClick={handleAddActionPlan} className="mt-2">
                  Add Action Plan
                </Button>
              </div>
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
            Select an approver and send this MPM target for approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="approver-select">Select Approver</Label>
            <Select
              value={selectedApprover}
              onValueChange={setSelectedApprover}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an approver" />
              </SelectTrigger>
              <SelectContent>
                {approvers.map((approver) => (
                  <SelectItem key={approver.id} value={approver.id}>
                    {approver.name} - {approver.position}, {approver.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedApprover && (
            <div className="p-4 bg-[#E4EFCF]/50 rounded-md">
              <p className="font-medium text-[#1B6131]">Selected Approver:</p>
              <p>{approvers.find(a => a.id === selectedApprover)?.name}</p>
              <p className="text-sm text-gray-600">
                {approvers.find(a => a.id === selectedApprover)?.position},
                {approvers.find(a => a.id === selectedApprover)?.department}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSendToApproverOpen(false);
              setSelectedApprover('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle send to approver logic here
              if (selectedApprover) {
                // Process the submission with the selected approver
                console.log(`Sending to approver: ${selectedApprover}`);
                setSendToApproverOpen(false);
                setSelectedApprover('');
              }
            }}
            disabled={!selectedApprover}
            className="bg-[#1B6131] hover:bg-[#46B749]"
          >
            <Send className="mr-2 h-4 w-4" />
            Send for Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  const CreateKPIDialog = () => {
    const [newKPI, setNewKPI] = useState<Partial<MPMEntry>>({
      actionPlans: [], // Inisialisasi actionPlans
    });
    const [newActionPlan, setNewActionPlan] = useState<Partial<ActionPlan>>({});

    const handleAddActionPlan = () => {
      if (newActionPlan.description && newActionPlan.responsiblePerson && newActionPlan.deadline) {
        setNewKPI((prev) => ({
          ...prev,
          actionPlans: [
            ...(prev.actionPlans || []),
            {
              id: `ap${(prev.actionPlans?.length || 0) + 1}`, // Generate ID unik
              description: newActionPlan.description,
              responsiblePerson: newActionPlan.responsiblePerson,
              deadline: newActionPlan.deadline,
            } as ActionPlan,
          ],
        }));
        setNewActionPlan({}); // Reset form input
      }
    };

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
            actionPlans: newKPI.actionPlans || [], // Pastikan actionPlans disimpan
          } as MPMEntry,
        ]);
        setIsCreateKPIOpen(false); // Tutup dialog
      }
    };
    
    // Create KPI Dialog
    const [approverForNewKPI, setApproverForNewKPI] = useState<string>('');

    return (
      <Dialog open={isCreateKPIOpen} onOpenChange={setIsCreateKPIOpen}>
        <DialogContent className="max-w-2xl overflow-y-scroll max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Create KPI</DialogTitle>
            <DialogDescription>
              Add a new KPI to the MPM system
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Perspective</Label>
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
            </div>

            <div className="space-y-2">
              <Label>KPI</Label>
              <Input
                placeholder="Enter KPI name"
                onChange={(e) => setNewKPI({ ...newKPI, kpi: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>KPI Definition</Label>
              <Input
                placeholder="Enter KPI definition"
                onChange={(e) => setNewKPI({ ...newKPI, kpiDefinition: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Weight (%)</Label>
              <Input
                type="number"
                placeholder="Enter weight"
                onChange={(e) => setNewKPI({ ...newKPI, weight: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>UOM</Label>
              <Select
                onValueChange={(value) =>
                  setNewKPI({ ...newKPI, uom: value as UOMType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select UOM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Number">Number</SelectItem>
                  <SelectItem value="%">%</SelectItem>
                  <SelectItem value="Days">Days</SelectItem>
                  <SelectItem value="Kriteria">Kriteria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={(value) =>
                  setNewKPI({ ...newKPI, category: value as Category })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Max">Max</SelectItem>
                  <SelectItem value="Min">Min</SelectItem>
                  <SelectItem value="On Target">On Target</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>YTD Calculation</Label>
              <Select
                onValueChange={(value) =>
                  setNewKPI({ ...newKPI, ytdCalculation: value as YTDCalculation })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select YTD Calculation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accumulative">Accumulative</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Last Value">Last Value</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Approver (Optional)</Label>
              <Select
                value={approverForNewKPI}
                onValueChange={setApproverForNewKPI}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Approver (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {approvers.map((approver) => (
                    <SelectItem key={approver.id} value={approver.id}>
                      {approver.name} - {approver.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Jan-25 Target</Label>
              <Input
                type="number"
                placeholder="Enter target"
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    targets: {
                      ...newKPI.targets as any,
                      'Jan-25': Number(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Feb-25 Target</Label>
              <Input
                type="number"
                placeholder="Enter target"
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    targets: {
                      ...newKPI.targets as any,
                      'Feb-25': Number(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Mar-25 Target</Label>
              <Input
                type="number"
                placeholder="Enter target"
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    targets: {
                      ...newKPI.targets as any,
                      'Mar-25': Number(e.target.value)
                    }
                  })
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-[#1B6131] dark:text-[#46B749]">
              Action Plans
            </h3>
            <div className="space-y-4 mt-2">
              {newKPI.actionPlans?.map((actionPlan) => (
                <div key={actionPlan.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm">{actionPlan.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Responsible: {actionPlan.responsiblePerson}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deadline: {actionPlan.deadline}
                  </p>
                </div>
              ))}
              <div className="space-y-2">
                <Label>New Action Plan</Label>
                <Input
                  placeholder="Description"
                  value={newActionPlan.description || ''}
                  onChange={(e) =>
                    setNewActionPlan({ ...newActionPlan, description: e.target.value })
                  }
                />
                <Input
                  placeholder="Responsible Person"
                  value={newActionPlan.responsiblePerson || ''}
                  onChange={(e) =>
                    setNewActionPlan({ ...newActionPlan, responsiblePerson: e.target.value })
                  }
                />
                <Input
                  type="date"
                  placeholder="Deadline"
                  value={newActionPlan.deadline || ''}
                  onChange={(e) =>
                    setNewActionPlan({ ...newActionPlan, deadline: e.target.value })
                  }
                />
                <Button onClick={handleAddActionPlan} className="mt-2">
                  Add Action Plan
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateKPIOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#1B6131] hover:bg-[#46B749]">
              Save KPI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const navigate = useNavigate();

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

        <main
          className={`
            flex-1 px-4 md:px-8 pt-20 
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'md:ml-72' : 'md:ml-0'}
            w-full
          `}
        >
       <div className="space-y-6 w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 mt-4 space-y-4 md:space-y-0">
              <h1 className="text-xl md:text-2xl font-bold text-[#1B6131] dark:text-[#46B749] w-full">
                MPM Info - Input Target
              </h1>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <Button
                  onClick={() => navigate('/performance-management/mpm/action-plan')}
                  className="w-full sm:w-auto bg-[#1B6131] hover:bg-[#46B749] flex items-center justify-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Action Plan
                </Button>
                <Button
                  onClick={() => setIsCreateKPIOpen(true)}
                  className="w-full sm:w-auto bg-[#1B6131] hover:bg-[#46B749] flex items-center justify-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create KPI
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-[#1B6131] text-[#1B6131] hover:bg-[#E4EFCF] flex items-center justify-center"
                  onClick={() => setSendToApproverOpen(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send to Approver
                </Button>
              </div>
            </div>

            {/* Main Card */}
            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                  KPI Targets
                </CardTitle>
              </CardHeader>
              <CardContent className='mt-4'>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#1B6131] text-white">
                      <tr>
                        {[
                          'Action', 'KPI', 'KPI Definition', 'Weight', 'UOM', 
                          'Category', 'YTD Calculation', 'Jan-25', 'Feb-25', 'Mar-25'
                        ].map((header) => (
                          <th 
                            key={header} 
                            className="p-4 text-center whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedData).map(([perspective, items]) => (
                        <>
                          <tr key={perspective} className="bg-[#E4EFCF] dark:bg-[#1B6131]/30">
                            <td colSpan={10} className="p-4 font-medium text-[#1B6131] dark:text-[#46B749]">
                              {perspective}
                            </td>
                          </tr>
                          {items.map((item) => (
                            <>
                              <tr key={`${item.perspective}-${item.kpiNumber}`} className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20">
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
                                <td className="p-4 text-center">{item.weight}%</td>
                                <td className="p-4 text-center">{item.uom}</td>
                                <td className="p-4 text-center">{item.category}</td>
                                <td className="p-4 text-center">{item.ytdCalculation}</td>
                                <td className="p-4 text-center">{item.targets['Jan-25']}</td>
                                <td className="p-4 text-center">{item.targets['Feb-25']}</td>
                                <td className="p-4 text-center">{item.targets['Mar-25']}</td>
                              </tr>
                              {item.actionPlans.map((actionPlan) => (
                                <tr key={actionPlan.id} className="bg-gray-50 dark:bg-gray-800">
                                  <td colSpan={10} className="p-4 pl-8">
                                    <div className="flex items-center space-x-4">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Action Plan:</span>
                                      <span className="text-sm">{actionPlan.description}</span>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Responsible:</span>
                                      <span className="text-sm">{actionPlan.responsiblePerson}</span>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Deadline:</span>
                                      <span className="text-sm">{actionPlan.deadline}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
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
}

export default MPMInfoTarget;