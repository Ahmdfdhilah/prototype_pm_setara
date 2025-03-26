import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
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
  // Loading state with improved shimmer effect
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

  return (
    <div className={`bg-gradient-to-r from-[#e6f3e6] to-[#d4ebd4] dark:from-[#0c2f16] dark:to-[#0a3a1a] mb-8 rounded-lg shadow-sm ${className}`}>
      <div className="mx-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-green-800 dark:text-green-200 tracking-tight">
                {currentPage}
              </h2>
            </div>
            {subtitle && (
              <p className="hidden md:flex text-sm text-green-600 dark:text-green-400 mt-1 max-w-md truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <nav aria-label="breadcrumb" className="w-full sm:w-auto">
          {/* Desktop & Mobile Breadcrumb */}
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
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;