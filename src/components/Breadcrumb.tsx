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
  bgColor?: string;
  textColor?: string;
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
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#e0f3e4] to-[#c4e6d0] dark:from-[#163b20] dark:to-[#1a4d2a] mb-8 animate-pulse">
        <div className="mx-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-32 bg-gray-300/20 rounded" />
          <div className="h-4 w-48 bg-gray-300/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-[#e6f3e6] to-[#d4ebd4] dark:from-[#0c2f16] dark:to-[#0a3a1a] mb-8 ${className}`}>
      <div className="mx-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0d4d23] dark:text-[#4caf50] tracking-tight">
            {currentPage}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#2c7a3b] dark:text-[#5bc660] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            {showHomeIcon && (
              <li className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center text-[#1B6131] dark:text-[#46B749] hover:text-[#0d4d23] dark:hover:text-[#4caf50] transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-4 h-4 mx-2 text-[#2c7a3b] dark:text-[#5bc660] opacity-70" />
              </li>
            )}

            {items.map((item, index) => (
              <li key={item.path} className="flex items-center">
                <Link
                  to={item.path}
                  className="text-[#1B6131] dark:text-[#46B749] hover:text-[#0d4d23] dark:hover:text-[#4caf50] transition-colors"
                >
                  {item.label}
                </Link>
                {index < items.length && (
                  <ChevronRight className="w-4 h-4 mx-2 text-[#2c7a3b] dark:text-[#5bc660] opacity-70" />
                )}
              </li>
            ))}

            <li
              aria-current="page"
              className="text-[#004d40] dark:text-[#46B749] font-semibold tracking-tight"
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