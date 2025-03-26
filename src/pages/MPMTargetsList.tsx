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

type MPMTargetStatus = 'Pending' | 'Draft' | 'Submitted' | 'Approved by Senior Manager' | 'Rejected by Senior Manager';

type ApproverComment = {
  reviewer: string;
  comment: string;
  action: 'Approved' | 'Rejected';
  reviewedAt: Date;
};

type MpmTarget = {
  id: string;
  year: string;
  period: string;
  submittedBy: string;
  submittedAt: Date;
  status: MPMTargetStatus;
  approverComments?: ApproverComment[];
};

const MPMTargetList: React.FC = () => {
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
  const [selectedMpmTarget, setSelectedMpmTarget] = useState<MpmTarget | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const [mpmTargets, setMpmTargets] = useState<MpmTarget[]>([
    {
      id: '1',
      year: '2025',
      period: '2025',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 0, 15),
      status: 'Approved by Senior Manager',
      approverComments: [{
        reviewer: 'Jane Smith',
        comment: 'Targets look good, approved',
        action: 'Approved',
        reviewedAt: new Date(2025, 0, 18)
      }]
    },
    {
      id: '2',
      year: '2026',
      period: '2026',
      submittedBy: 'John Doe',
      submittedAt: new Date(2025, 1, 16),
      status: 'Draft',
      approverComments: []
    },
    {
      id: '3',
      year: '2024',
      period: '2024',
      submittedBy: 'Sarah Johnson',
      submittedAt: new Date(2024, 2, 17),
      status: 'Submitted',
      approverComments: []
    },
    {
      id: '4',
      year: '2027',
      period: '2027',
      submittedBy: 'Robert Brown',
      submittedAt: new Date(2025, 3, 15),
      status: 'Rejected by Senior Manager',
      approverComments: [{
        reviewer: 'Emily Wilson',
        comment: 'Need more detailed justification for targets',
        action: 'Rejected',
        reviewedAt: new Date(2025, 3, 18)
      }]
    }
  ]);

  // Filtering and Pagination Logic
  const filteredMpmTargets = useMemo(() => {
    return mpmTargets.filter(target =>
      (!selectedPeriod || target.period === selectedPeriod) &&
      (!selectedStatus || target.status === selectedStatus)
    );
  }, [mpmTargets, selectedPeriod, selectedStatus]);

  const paginatedMpmTargets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMpmTargets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMpmTargets, currentPage]);

  // Handlers
  const handleSubmitMpmTarget = () => {
    if (selectedMpmTarget) {
      const updatedTargets = mpmTargets.map(target =>
        target.id === selectedMpmTarget.id
          ? { ...target, status: 'Submitted' as MPMTargetStatus }
          : target
      );
      setMpmTargets(updatedTargets);
      setIsSubmitModalOpen(false);
    }
  };

  const handleReviewMpmTarget = (action: 'Approved by Senior Manager' | 'Rejected by Senior Manager') => {
    if (selectedMpmTarget) {
      const newComment: ApproverComment = {
        reviewer: 'Senior Manager',
        comment: reviewComment,
        action: action === 'Approved by Senior Manager' ? 'Approved' : 'Rejected',
        reviewedAt: new Date()
      };

      const updatedTargets = mpmTargets.map(target =>
        target.id === selectedMpmTarget.id
          ? {
            ...target,
            status: action,
            approverComments: [
              ...(target.approverComments || []),
              newComment
            ]
          }
          : target
      );
      setMpmTargets(updatedTargets);
      setIsReviewModalOpen(false);
      setReviewComment('');
    }
  };

  const getStatusColor = (status: MPMTargetStatus) => {
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

  // Navigate to individual MPM Target details
  const handleRowClick = (target: MpmTarget) => {
    navigate(`/performance-management/mpm/target/${target.id}`);
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
            flex-1 
            px-2 
            sm:px-4 
            lg:px-6 
            pt-16 
            pb-12
            sm:pt-18 
            lg:pt-20 
            transition-all 
            duration-300 
            ease-in-out 
            ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
            w-full
            `}>
          <div className="space-y-6 w-full">
            <Breadcrumb
              items={[]}
              currentPage="MPM Targets List"
              showHomeIcon={true}
            />
            <FilterSection
              handlePeriodChange={setSelectedPeriod}
              selectedPeriod={selectedPeriod}
            />

            <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md pb-4">
              <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                  MPM Targets Table
                </CardTitle>
              </CardHeader>
              <CardContent className='mt-2 p-0'>
                <table className="w-full border-collapse">
                  <thead className="bg-[#1B6131] text-white">
                    <tr>
                      {['Year', 'Submitted By', 'Submitted At', 'Status', 'Actions'].map(header => (
                        <th key={header} className="p-4 text-center">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMpmTargets.map(target => (
                      <tr
                        key={target.id}
                        className="hover:bg-[#E4EFCF]/50 dark:hover:bg-[#1B6131]/20 cursor-pointer"
                        onClick={() => handleRowClick(target)}
                      >
                        <td className="p-4 text-center">{target.year}</td>
                        <td className="p-4 text-center">{target.submittedBy}</td>
                        <td className="p-4 text-center">
                          {target.submittedAt.toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(target.status)}`}>
                            {target.status}
                          </span>
                        </td>
                        <td
                          className="p-4 text-center space-x-2"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking action buttons
                        >
                          {currentRole === 'manager' && target.status === 'Draft' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMpmTarget(target);
                                setIsSubmitModalOpen(true);
                              }}
                            >
                              Submit
                            </Button>
                          )}
                          {currentRole === 'sm_dept' && target.status === 'Submitted' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMpmTarget(target);
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
                  totalPages={Math.ceil(filteredMpmTargets.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Submit Modal - Positioned with absolute positioning */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[425px] z-50">
          <DialogHeader>
            <DialogTitle>Submit MPM Target</DialogTitle>
            <DialogDescription>
              Submit your yearly performance management targets for review
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitMpmTarget}>
              Confirm Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal - Positioned with absolute positioning */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[425px] z-50">
          <DialogHeader>
            <DialogTitle>Review MPM Target</DialogTitle>
            <DialogDescription>
              Review and take action on the submitted performance management targets
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

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => handleReviewMpmTarget('Rejected by Senior Manager')}
            >
              Reject
            </Button>
            <Button onClick={() => handleReviewMpmTarget('Approved by Senior Manager')}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MPMTargetList;