import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import { Edit, Send } from 'lucide-react';
import Header from '@/components/Header';

// Types
type UOMType = 'Number' | '%' | 'Days' | 'Kriteria' | 'Number (Ton)';
type Category = 'Max' | 'Min' | 'On Target';
type YTDCalculation = 'Accumulative' | 'Average' | 'Last Value';

type KPIEntry = {
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

const MPMInputActual = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPIEntry | null>(null);
  const [sendToApproverOpen, setSendToApproverOpen] = useState(false);

  // Sample data structure matching the client's image
  const [kpiData, setKpiData] = useState<KPIEntry[]>([
    {
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
    {
      kpi: 'Jumlah Customer',
      kpiDefinition: 'Jumlah customer',
      weight: 15,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      target: 10,
      actual: 10,
      achievement: 100.0,
      score: 2,
      problemIdentification: '',
      correctiveAction: '',
    },
    {
      kpi: 'Jumlah Supplier',
      kpiDefinition: 'Jumlah supplier',
      weight: 15,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      target: 10,
      actual: 10,
      achievement: 100.0,
      score: 2,
      problemIdentification: '',
      correctiveAction: '',
    },
    {
      kpi: 'Jumlah Training',
      kpiDefinition: 'Jumlah training',
      weight: 15,
      uom: 'Number',
      category: 'Max',
      ytdCalculation: 'Accumulative',
      target: 5,
      actual: 3,
      achievement: 60.0,
      score: 1,
      problemIdentification: '',
      correctiveAction: '',
    },
  ]);

  // Edit Dialog Component
  const EditKPIDialog = () => {
    if (!selectedKPI) return null;

    const handleSave = () => {
      if (selectedKPI) {
        setKpiData((prevData) =>
          prevData.map((kpi) =>
            kpi.kpi === selectedKPI.kpi ? selectedKPI : kpi
          )
        );
        setIsEditDialogOpen(false);
      }
    };

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
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

  // Dialog for sending to approver
  const SendToApproverDialog = () => (
    <Dialog open={sendToApproverOpen} onOpenChange={setSendToApproverOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send to Approver</DialogTitle>
          <DialogDescription>
            Are you sure you want to send this KPI data for approval?
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

  // Handle edit button click
  const handleEditClick = (item: KPIEntry) => {
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
                MPM Info - KPI Specific (Input Actual)
              </h1>
              <Button
                variant="outline"
                className="border-[#1B6131] text-[#1B6131] hover:bg-[#E4EFCF]"
                onClick={() => setSendToApproverOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send to Approver
              </Button>
            </div>

            {/* Main Card */}
            <Card className="border-[#46B749] dark:border-[#1B6131]">
              <CardHeader>
                <CardTitle className="text-[#1B6131] dark:text-[#46B749]">
                  KPI Actuals
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
                        <th className="p-4 text-center">Target</th>
                        <th className="p-4 text-center">Actual</th>
                        <th className="p-4 text-center">Achievement</th>
                        <th className="p-4 text-center">Score</th>
                        <th className="p-4 text-left">
                          Problem Identification
                        </th>
                        <th className="p-4 text-left">Corrective Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpiData.map((item, index) => (
                        <tr
                          key={index}
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
};

export default MPMInputActual;
