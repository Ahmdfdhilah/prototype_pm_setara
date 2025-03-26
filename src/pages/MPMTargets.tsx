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

import {
  Perspective,
  MPMEntry,
  Approver
} from '../lib/types';
import {
  mpmTargetsDataMock
}
  from '../lib/mpmTargetsMock';

import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import { Edit, Plus, PlusCircle, Send } from 'lucide-react';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import EditMonthlyTargetDialog from '@/components/MPM/EditMonthlyTargetDialog';
import Breadcrumb from '@/components/Breadcrumb';

const MPMTargets = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');

  const [isEditMonthlyTargetOpen, setIsEditMonthlyTargetOpen] = useState(false);
  const [sendToApproverOpen, setSendToApproverOpen] = useState(false);

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
  const [mpmData, setMpmData] = useState(mpmTargetsDataMock.targets);

  const handleEditMonthlyTarget = (item: MPMEntry) => {
    setSelectedKPI(item);
    setIsEditMonthlyTargetOpen(true);
  };

  const handleSaveMonthlyTarget = (updatedKPI: MPMEntry) => {
    setMpmData(prev =>
      prev?.map(kpi =>
        kpi.kpiNumber === updatedKPI.kpiNumber &&
          kpi.perspective === updatedKPI.perspective
          ? updatedKPI
          : kpi
      )
    );
    setIsEditMonthlyTargetOpen(false);
  };


  // Dialog for sending to manager
  const SendToApproverDialog = () => (
    <Dialog open={sendToApproverOpen} onOpenChange={setSendToApproverOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send to Approver</DialogTitle>
          <DialogDescription>
            Select an manager and send this MPM target for approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="manager-select">Select Approver</Label>
            <Select
              value={selectedApprover}
              onValueChange={setSelectedApprover}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an manager" />
              </SelectTrigger>
              <SelectContent>
                {approvers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name} - {manager.position}, {manager.department}
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
              // Handle send to manager logic here
              if (selectedApprover) {
                // Process the submission with the selected manager
                console.log(`Sending to manager: ${selectedApprover}`);
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

  const navigate = useNavigate();

  // Group data by perspective
  const groupedData = useMemo(() => {
    return mpmData?.reduce((acc, curr) => {
      if (!acc[curr.perspective]) {
        acc[curr.perspective] = [];
      }
      acc[curr.perspective].push(curr);
      return acc;
    }, {} as Record<Perspective, MPMEntry[]>);
  }, [mpmData]);


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
        flex-1 
            px-2 
            sm:px-4 
            lg:px-6 
            pt-16 
            pb-12
            mt-4
            sm:pt-18 
            lg:pt-20 
            transition-all 
            duration-300 
            ease-in-out 
            ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
            w-full
          `}
        >
          <div className="space-y-6 w-full">
            {/* Header Section */}
            <Breadcrumb
              items={[{
                label: 'MPM Target List',
                path: '/performance-management/mpm/target'
              }]}
              currentPage="MPM  Targets"
              showHomeIcon={true}
              subtitle={`MPM Targets ID : ${mpmTargetsDataMock.id}`}
            />

            {/* Main Card */}
            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                    KPI Targets Table
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    <Button
                      onClick={() => navigate('/performance-management/mpm/action-plan')}
                      className="w-full sm:w-auto bg-[#1B6131] hover:bg-[#46B749] flex items-center justify-center text-white"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Action Plan
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-[#1B6131] text-[#1B6131] hover:bg-[#E4EFCF] flex items-center justify-center dark:text-white"
                      onClick={() => setSendToApproverOpen(true)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send to Approver
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='mt-2 p-0'>
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
                      {groupedData && Object.entries(groupedData).map(([perspective, items]) => (
                        <>
                          <tr key={perspective} className="bg-[#E4EFCF] dark:bg-[#1B6131]/30">
                            <td colSpan={10} className="p-4 font-medium text-[#1B6131] dark:text-[#46B749]">
                              {perspective}
                            </td>
                          </tr>
                          {items.map((item) => (
                            <>
                              <tr key={`${item.perspective}-${item.kpiNumber}`} className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20">
                                <td className="p-4 text-center flex gap-2 justify-center">
                                  {/* Tombol Edit */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-[#1B6131]"
                                    onClick={() => handleEditMonthlyTarget(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>

                                  {/* Tombol Create */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-[#1B6131]"
                                    onClick={() => navigate(`/performance-management/mpm/target/${mpmTargetsDataMock.id}/entri/${item.id}/teams`)}
                                  >
                                   
                                    <Plus className="h-4 w-4" />
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

      <EditMonthlyTargetDialog
        isOpen={isEditMonthlyTargetOpen}
        onClose={() => setIsEditMonthlyTargetOpen(false)}
        kpi={selectedKPI}
        onSave={handleSaveMonthlyTarget}
      />

      <SendToApproverDialog />
    </div>
  );
}

export default MPMTargets;