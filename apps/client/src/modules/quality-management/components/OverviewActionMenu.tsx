"use client";

import * as React from "react";

interface OverviewActionMenuProps {
  onAddCustomerFeedback?: () => void;
  onAddEmployeeFeedback?: () => void;
  onAddCompanyFeedback?: () => void;
}

export const OverviewActionMenu: React.FC<OverviewActionMenuProps> = ({
  onAddCustomerFeedback,
  onAddEmployeeFeedback,
  onAddCompanyFeedback,
}) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAddCustomerFeedback = () => {
    onAddCustomerFeedback?.();
    setOpen(false);
  };

  const handleAddEmployeeFeedback = () => {
    onAddEmployeeFeedback?.();
    setOpen(false);
  };

  const handleAddCompanyFeedback = () => {
    onAddCompanyFeedback?.();
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="h-7 w-7 rounded-md border border-[#E6E6E6] leading-none flex items-center justify-center"
      >
        ⋮
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-white border border-[#E6E6E6] rounded-md shadow-lg z-[9999] py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 transition-colors"
            onClick={handleAddCustomerFeedback}
          >
            Customer Feedback
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 transition-colors"
            onClick={handleAddEmployeeFeedback}
          >
            Employee Feedback
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 transition-colors"
            onClick={handleAddCompanyFeedback}
          >
            Company Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default OverviewActionMenu;
