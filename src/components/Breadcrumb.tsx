import { useState } from 'react';
import { ChevronRight, Home, MoreHorizontal, FolderIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
  subtitle?: string;
  showHomeIcon?: boolean;
  className?: string;
  isLoading?: boolean;
}

const Breadcrumb = ({
  items = [],
  currentPage,
  subtitle,
  showHomeIcon = true,
  className = "",
  isLoading = false,
}: BreadcrumbProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading state 
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 mb-8 overflow-hidden">
        <div className="mx-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-green-200/50 dark:bg-green-700/50 rounded-md mb-2" />
            <div className="h-5 w-36 bg-green-200/50 dark:bg-green-700/50 rounded-md" />
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-green-200/50 dark:bg-green-700/50 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Render for desktop (full breadcrumb)
  const DesktopBreadcrumb = () => (
    <ol className="flex items-center flex-wrap sm:flex-nowrap gap-2 text-sm">
      {showHomeIcon && (
        <li className="flex items-center shrink-0">
          <Link
            to="/"
            className="flex items-center text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500 dark:text-green-600 opacity-70 shrink-0" />
        </li>
      )}

      {items.map((item, index) => (
        <li key={item.path} className="flex items-center shrink-0">
          <Link
            to={item.path}
            className={`
              text-green-700 dark:text-green-300 
              hover:text-green-900 dark:hover:text-green-100 
              transition-colors whitespace-nowrap
              ${index === items.length - 1 ? 'font-semibold' : ''}
            `}
          >
            {item.label}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500 dark:text-green-600 opacity-70 shrink-0" />
        </li>
      ))}

      <li
        aria-current="page"
        className="text-green-900 dark:text-green-100 font-semibold tracking-tight whitespace-nowrap"
      >
        {currentPage}
      </li>
    </ol>
  );

  // Render for mobile (truncated breadcrumb)
  const MobileBreadcrumb = () => {
    if (items.length <= 1) {
      return <DesktopBreadcrumb />;
    }

    return (
      <ol className="flex items-center flex-wrap sm:flex-nowrap gap-2 text-sm">
        {showHomeIcon && (
          <li className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-green-500 dark:text-green-600 opacity-70 shrink-0" />
          </li>
        )}

        {/* More dialog */}
        <li className="flex items-center shrink-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[95%] max-w-[500px] rounded-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderIcon className="w-5 h-5 text-green-600" />
                  Navigation Path
                </DialogTitle>
  
              </DialogHeader>
              
              <Separator className="my-2" />
              
              <div className="grid gap-2 py-4 max-h-[60vh] overflow-y-auto">
                {items.map((item) => {
                  const ItemIcon = item.icon || FolderIcon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 py-2 px-4 rounded-md 
                        text-green-700 dark:text-green-300 
                        hover:bg-green-100 dark:hover:bg-green-900 
                        transition-colors group"
                    >
                      <ItemIcon className="w-5 h-5 text-green-500 group-hover:text-green-700 transition-colors" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
              
              <Separator className="my-2" />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500 dark:text-green-600 opacity-70 shrink-0" />
        </li>

        <li
          aria-current="page"
          className="text-green-900 dark:text-green-100 font-semibold tracking-tight whitespace-nowrap"
        >
          {currentPage}
        </li>
      </ol>
    );
  };

  return (
    <div className={`bg-gradient-to-r from-[#e6f3e6] to-[#d4ebd4] dark:from-[#0c2f16] dark:to-[#0a3a1a] mb-8 rounded-lg shadow-sm ${className}`}>
      <div className="mx-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <div>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 tracking-tight">
              {currentPage}
            </h2>
            {subtitle && (
              <p className="hidden md:flex text-sm text-green-600 dark:text-green-400 mt-1 max-w-md truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <nav aria-label="breadcrumb" className="w-full sm:w-auto">
          {/* Responsive Breadcrumb */}
          <div className="block sm:hidden">
            <MobileBreadcrumb />
          </div>
          <div className="hidden sm:block">
            <DesktopBreadcrumb />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;