import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/Pagination';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FilterSection from '@/components/Filtering';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Breadcrumb from '@/components/Breadcrumb';

type MPMActualStatus = 'Pending' | 'Draft' | 'Submitted' | 'Approved by Senior Manager' | 'Rejected by Senior Manager';

type ApproverComment = {
  reviewer: string;
  comment: string;
  action: 'Approved' | 'Rejected';
  reviewedAt: Date;
};

type MpmActual = {
  id: string;
  month: string;
  period: string;
  submittedBy: string;
  submittedAt: Date;
  status: MPMActualStatus;
  approverComments?: ApproverComment[];
};

const MPMActualList: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState('manager');

  // Filtering States
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, _] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [selectedMpmActual, setSelectedMpmActual] = useState<MpmActual | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const [mpmActuals, setMpmActuals] = useState<MpmActual[]>([
    {
      id: '1',
      month: 'January',
      period: 'Jan-25',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 0, 15),
      status: 'Approved by Senior Manager',
      approverComments: [{
        reviewer: 'Jane Smith',
        comment: 'All KPIs look good, approved',
        action: 'Approved',
        reviewedAt: new Date(2025, 0, 18)
      }]
    },
    {
      id: '2',
      month: 'February',
      period: 'Feb-25',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 1, 16),
      status: 'Approved by Senior Manager',
      approverComments: [{
        reviewer: 'Jane Smith',
        comment: 'Minor discrepancies noted but within acceptable range',
        action: 'Approved',
        reviewedAt: new Date(2025, 1, 19)
      }]
    },
    {
      id: '3',
      month: 'March',
      period: 'Mar-25',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 2, 17),
      status: 'Approved by Senior Manager',
      approverComments: [{
        reviewer: 'Jane Smith',
        comment: 'Good',
        action: 'Rejected',
        reviewedAt: new Date(2025, 2, 20)
      }]
    },
    {
      id: '4',
      month: 'April',
      period: 'Apr-25',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 3, 15),
      status: 'Submitted',
      approverComments: []
    },
    {
      id: '5',
      month: 'May',
      period: 'May-25',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 4, 16),
      status: 'Draft',
      approverComments: []
    },
    {
      id: '6',
      month: 'June',
      period: 'Jun-25',
      submittedBy: 'Sarah Johnson',
      submittedAt: new Date(2025, 5, 17),
      status: 'Approved by Senior Manager',
      approverComments: [{
        reviewer: 'Michael Chen',
        comment: 'Excellent performance this month',
        action: 'Approved',
        reviewedAt: new Date(2025, 5, 20)
      }]
    },
    {
      id: '7',
      month: 'July',
      period: 'Jul-25',
      submittedBy: 'Sarah Johnson',
      submittedAt: new Date(2025, 6, 15),
      status: 'Submitted',
      approverComments: []
    },
    {
      id: '8',
      month: 'August',
      period: 'Aug-25',
      submittedBy: 'Sarah Johnson',
      submittedAt: new Date(2025, 7, 16),
      status: 'Draft',
      approverComments: []
    },
    {
      id: '9',
      month: 'September',
      period: 'Sep-25',
      submittedBy: 'Robert Brown',
      submittedAt: new Date(2025, 8, 17),
      status: 'Approved by Senior Manager',
      approverComments: [{
        reviewer: 'Emily Wilson',
        comment: 'Q3 results are satisfactory',
        action: 'Approved',
        reviewedAt: new Date(2025, 8, 21)
      }]
    },
    {
      id: '10',
      month: 'October',
      period: 'Oct-25',
      submittedBy: 'Robert Brown',
      submittedAt: new Date(2025, 9, 15),
      status: 'Rejected by Senior Manager',
      approverComments: [{
        reviewer: 'Emily Wilson',
        comment: 'Missing documentation for several KPIs',
        action: 'Rejected',
        reviewedAt: new Date(2025, 9, 18)
      }]
    },
    {
      id: '11',
      month: 'November',
      period: 'Nov-25',
      submittedBy: 'Robert Brown',
      submittedAt: new Date(2025, 10, 16),
      status: 'Submitted',
      approverComments: []
    },
    {
      id: '12',
      month: 'December',
      period: 'Dec-25',
      submittedBy: 'Robert Brown',
      submittedAt: new Date(2025, 11, 15),
      status: 'Draft',
      approverComments: []
    }
  ]);

  // Filtering and Pagination Logic
  const filteredMpmActuals = useMemo(() => {
    return mpmActuals.filter(actual =>
      (!selectedPeriod || actual.period === selectedPeriod) &&
      (!selectedStatus || actual.status === selectedStatus)
    );
  }, [mpmActuals, selectedPeriod, selectedStatus]);

  const paginatedMpmActuals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMpmActuals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMpmActuals, currentPage]);

  // Handlers
  const handleSubmitMpmActual = () => {
    if (selectedMpmActual) {
      const updatedActuals = mpmActuals.map(actual =>
        actual.id === selectedMpmActual.id
          ? { ...actual, status: 'Submitted' as MPMActualStatus }
          : actual
      );
      setMpmActuals(updatedActuals);
      setIsSubmitModalOpen(false);
    }
  };

  const handleReviewMpmActual = (action: 'Approved by Senior Manager' | 'Rejected by Senior Manager') => {
    if (selectedMpmActual) {
      const newComment: ApproverComment = {
        reviewer: 'Senior Manager',
        comment: reviewComment,
        action: action === 'Approved by Senior Manager' ? 'Approved' : 'Rejected',
        reviewedAt: new Date()
      };

      const updatedActuals = mpmActuals.map(actual =>
        actual.id === selectedMpmActual.id
          ? {
            ...actual,
            status: action,
            approverComments: [
              ...(actual.approverComments || []),
              newComment
            ]
          }
          : actual
      );
      setMpmActuals(updatedActuals);
      setIsReviewModalOpen(false);
      setReviewComment('');
    }
  };

  // Helper function to get status color classes
  const getStatusColor = (status: MPMActualStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
      case 'Submitted':
        return 'bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'Draft':
        return 'bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200';
      case 'Approved by Senior Manager':
        return 'bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Rejected by Senior Manager':
        return 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Navigate to individual MPM Actual details
  const handleRowClick = (actual: MpmActual) => {
    navigate(`/performance-management/mpm/actual/${actual.id}?month=${actual.month}`);
  };

  return (
    <div className="font-montserrat min-h-screen bg-white dark:bg-gray-900 relative">
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
         flex-1 px-4 lg:px-6 pt-16 pb-12 mt-4 sm:pt-18 lg:pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} w-full
            `}>
          <div className="space-y-6 w-full">
            <Breadcrumb
              items={[]}
              currentPage="MPM Actuals"
              showHomeIcon={true}
            />
            <FilterSection
              handlePeriodChange={setSelectedPeriod}
              selectedPeriod={selectedPeriod}
            />

            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md pb-4">
              <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                  MPM Actuals Table
                </CardTitle>
              </CardHeader>
              <CardContent className='m-0 p-0 overflow-x-scroll'>
                <table className="w-full border-collapse">
                  <thead className="bg-[#1B6131] text-white">
                    <tr>
                      {['Month', 'Submitted By', 'Submitted At', 'Status', 'Actions'].map(header => (
                        <th key={header} className="p-4 text-center">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMpmActuals.map(actual => (
                      <tr
                        key={actual.id}
                        className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20 cursor-pointer"
                        onClick={() => handleRowClick(actual)}
                      >
                        <td className="p-4 text-center">{actual.month}</td>
                        <td className="p-4 text-center">{actual.submittedBy}</td>
                        <td className="p-4 text-center">
                          {actual.submittedAt.toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(actual.status)}`}>
                            {actual.status}
                          </span>
                        </td>
                        <td
                          className="p-4 text-center space-x-2"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking action buttons
                        >
                          {currentRole === 'manager' && actual.status === 'Draft' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMpmActual(actual);
                                setIsSubmitModalOpen(true);
                              }}
                            >
                              Submit
                            </Button>
                          )}
                          {currentRole === 'sm_dept' && actual.status === 'Submitted' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMpmActual(actual);
                                setIsReviewModalOpen(true);
                              }}
                            >
                              Review
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredMpmActuals.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Submit Modal - Positioned with absolute positioning */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-md w-[95%] lg:max-w-lg rounded-lg overflow-y-scroll max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Submit MPM Actual</DialogTitle>
            <DialogDescription>
              Submit your monthly performance management actuals for review
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className='space-y-4'>
            <div className="flex flex-col lg:flex-row gap-4">
              <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitMpmActual}>
                Confirm Submission
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal - Positioned with absolute positioning */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-md w-[95%] lg:max-w-lg rounded-lg overflow-y-scroll max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Review MPM Actual</DialogTitle>
            <DialogDescription>
              Review and take action on the submitted performance management actuals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="review-comments">Review Comments</Label>
              <Input
                id="review-comments"
                placeholder="Enter your review comments"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className='space-y-4'>
            <div className="flex flex-col lg:flex-row gap-4">
              <Button
                variant="destructive"
                onClick={() => handleReviewMpmActual('Rejected by Senior Manager')}
              >
                Reject
              </Button>
              <Button onClick={() => handleReviewMpmActual('Approved by Senior Manager')}>
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MPMActualList;