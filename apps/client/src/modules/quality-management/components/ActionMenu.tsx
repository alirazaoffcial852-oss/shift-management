"use client";

import * as React from "react";

interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete }) => {
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

  const handleEdit = () => {
    onEdit?.();
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-7 w-7 rounded-md border border-[#E6E6E6] leading-none"
      >
        ⋯
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-32 bg-white border border-[#E6E6E6] rounded-md shadow-md z-20"
        >
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-50"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-50 text-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;


