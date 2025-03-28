import { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import { Edit, Send, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';

// Types
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria' | 'Number (Ton)';
type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';
type MonthType = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' |
  'July' | 'August' | 'September' | 'October' | 'November' | 'December';
type Perspective = 'Financial' | 'Customer' | 'Internal Process' | 'Learning and Growth';

type KPIEntry = {
  id: number;
  periodId: number;
  month: MonthType;
  perspective: Perspective;
  kpi: string;
  kpiDefinition: string;
  weight: number;
  uom: UOMType;
  category: Category;
  ytdCalculation: YTDCalculation;
  target: number;
  actual: number;
  achievement: number;
  score: number;
  problemIdentification: string;
  correctiveAction: string;
};

type Approver = {
  id: string;
  name: string;
  position: string;
  department: string;
};

const MPMActuals = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPIEntry | null>(null);
  const [sendToApproverOpen, setSendToApproverOpen] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const month = searchParams.get('month');
  const { mpmActualId } = useParams<{ mpmActualId: string }>();

  const approvers: Approver[] = [
    { id: 'app1', name: 'Budi Santoso', position: 'Manager', department: 'Performance Management' },
    { id: 'app2', name: 'Rina Wijaya', position: 'Senior Manager', department: 'Operations' },
    { id: 'app3', name: 'Agus Purnomo', position: 'Director', department: 'Business Development' },
    { id: 'app4', name: 'Dewi Kartika', position: 'VP', department: 'Human Resources' },
  ];

  const [kpiData, setKpiData] = useState<KPIEntry[]>([
    {
      id: 1,
      periodId: 1,
      month: 'January',
      perspective: 'Financial',
      kpi: 'Profit / Loss',
      kpiDefinition: 'Rasio keuntungan',
      weight: 15,
      uom: '%',
      category: 'Max',
      ytdCalculation: 'Last Value',
      target: 5,
      actual: 4.5,
      achievement: 90.0,
      score: 2,
      problemIdentification: '',
      correctiveAction: '',
    },
    {
      id: 2,
      periodId: 1,
      month: 'January',
      perspective: 'Customer',
      kpi: 'Total Penjualan',
      kpiDefinition: 'Total penjualan',
      weight: 40,
      uom: 'Number (Ton)',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      target: 10,
      actual: 10,
      achievement: 100.0,
      score: 2,
      problemIdentification: '',
      correctiveAction: '',
    },
  ]);

  // Group data by perspective
  const groupedData = useMemo(() => {
    return kpiData.reduce((acc, curr) => {
      if (!acc[curr.perspective]) {
        acc[curr.perspective] = [];
      }
      acc[curr.perspective].push(curr);
      return acc;
    }, {} as Record<Perspective, KPIEntry[]>);
  }, [kpiData]);

  const handleRowClick = (item: KPIEntry) => {
    navigate(`/performance-management/mpm/actual/${item.periodId}/entri/${item.id}/teams?month=${item.month}`);
  };

  // Edit Dialog Component
  const EditKPIDialog = () => {
    if (!selectedKPI) return null;

    const handleSave = () => {
      if (selectedKPI) {
        setKpiData((prevData) =>
          prevData.map((kpi) =>
            kpi.id === selectedKPI.id ? selectedKPI : kpi
          )
        );
        setIsEditDialogOpen(false);
      }
    };

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-scroll max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Edit KPI Actual Data</DialogTitle>
            <DialogDescription>
              Update actual values and corrective actions
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>KPI</Label>
              <Input value={selectedKPI.kpi} disabled />
            </div>

            <div className="space-y-2">
              <Label>Target</Label>
              <Input value={selectedKPI.target} disabled />
            </div>

            <div className="space-y-2">
              <Label>Actual</Label>
              <Input
                type="number"
                value={selectedKPI.actual}
                onChange={(e) => {
                  const actual = parseFloat(e.target.value);
                  const achievement = (actual / selectedKPI.target) * 100;
                  setSelectedKPI({
                    ...selectedKPI,
                    actual,
                    achievement,
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Achievement (%)</Label>
              <Input value={selectedKPI.achievement.toFixed(2)} disabled />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Problem Identification</Label>
              <Input
                value={selectedKPI.problemIdentification}
                onChange={(e) =>
                  setSelectedKPI({
                    ...selectedKPI,
                    problemIdentification: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Corrective Action</Label>
              <Input
                value={selectedKPI.correctiveAction}
                onChange={(e) =>
                  setSelectedKPI({
                    ...selectedKPI,
                    correctiveAction: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

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

  // Handle edit button click
  const handleEditClick = (item: KPIEntry) => {
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
            flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full
          `}
        >
          <div className="space-y-6 w-full">
            <Breadcrumb
              items={[{
                label: 'MPM Target List',
                path: '/performance-management/mpm/target'
              }]}
              currentPage={`MPM Actual - ${month}`}
              showHomeIcon={true}
              subtitle={`MPM Actual ID : ${mpmActualId}`}
            />

            {/* Main Card */}
            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                    KPI Actuals Table
                  </CardTitle>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-[#1B6131] text-[#1B6131] hover:bg-[#E4EFCF]"
                    onClick={() => setSendToApproverOpen(true)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send to Approver
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='m-0 p-0'>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#1B6131] text-white">
                      <tr>
                        {[
                          'Actions', 'KPI', 'KPI Definition', 'Weight', 'UOM',
                          'Category', 'YTD Calculation', 'Target', 'Actual',
                          'Achievement', 'Score', 'Problem Identification',
                          'Corrective Action'
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
                      {groupedData && Object.entries(groupedData).map(([perspective, items]) => (
                        <>
                          <tr key={perspective} className="bg-[#E4EFCF] dark:bg-[#1B6131]/30">
                            <td colSpan={13} className="p-4 font-medium text-[#1B6131] dark:text-[#46B749]">
                              {perspective}
                            </td>
                          </tr>
                          {items.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20 cursor-pointer"
                            >
                              <td className="p-4 text-center flex items-center justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:text-[#1B6131]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(item);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:text-[#1B6131]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(item);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                              <td className="p-4">{item.kpi}</td>
                              <td className="p-4">{item.kpiDefinition}</td>
                              <td className="p-4 text-center">{item.weight}%</td>
                              <td className="p-4 text-center">{item.uom}</td>
                              <td className="p-4 text-center">{item.category}</td>
                              <td className="p-4 text-center">
                                {item.ytdCalculation}
                              </td>
                              <td className="p-4 text-center">{item.target}</td>
                              <td className="p-4 text-center">{item.actual}</td>
                              <td className="p-4 text-center">
                                {item.achievement.toFixed(2)}%
                              </td>
                              <td className="p-4 text-center">{item.score}</td>
                              <td className="p-4">{item.problemIdentification}</td>
                              <td className="p-4">{item.correctiveAction}</td>
                            </tr>
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

      <EditKPIDialog />
      <SendToApproverDialog />
    </div>
  );
}

export default MPMActuals;