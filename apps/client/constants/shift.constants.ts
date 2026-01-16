import {
  ArrowRight,
  ClipboardCheck,
  Clock,
  DollarSign,
  Eye,
  List,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";

export const STEPS = [
  {
    title: "Create Shift",
  },
  {
    title: "Shift Information",
  },
  {
    title: "Product Details",
  },
  {
    title: "Notes",
  },
];
export const STATUS_IDENTIFIERS = [
  {
    id: "open",
    colorCode: "border-dashed border-2 border-gray-400 bg-white",
    title: "Open",
  },
  {
    id: "offer",
    colorCode: "border-dashed border-2 border-gray-400 bg-white",
    title: "Offer",
  },
  {
    id: "planned",
    colorCode: "bg-gray-200",
    title: "Planned",
  },
  {
    id: "fixed",
    colorCode: "bg-blue-50",
    title: "Fixed",
  },
  {
    id: "submitted",
    colorCode: "bg-orange-100",
    title: "Submitted",
  },
  {
    id: "approved",
    colorCode: "bg-yellow-100",
    title: "Approved",
  },
  {
    id: "billed",
    colorCode: "bg-green-100",
    title: "Billed",
  },
  {
    id: "rejected",
    colorCode: "bg-red-100",
    title: "Rejected",
  },
];
export const ACTION_ICONS = {
  view: { icon: Eye, color: "text-blue-500" },
  delete: { icon: Trash2, color: "text-red-500" },
  edit: { icon: Pencil, color: "text-orange-500" },
  assign: { icon: UserPlus, color: "text-green-500" },
  fix: { icon: ArrowRight, color: "text-purple-500" },
  timesheet: { icon: Clock, color: "text-cyan-500" },
  bill: { icon: DollarSign, color: "text-emerald-500" },
  approve: { icon: ClipboardCheck, color: "text-indigo-500" },
  wagonList: { icon: List, color: "text-indigo-500" },
};

export const SHIFT_STATUS_OPTIONS = [
  { value: "ALL", label: "All Status" },
  { value: "OPEN", label: "Open" },
  { value: "PLANNED", label: "Planned" },
  { value: "FIXED", label: "Fixed" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "APPROVED", label: "Approved" },
  { value: "BILLED", label: "Billed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "OFFER", label: "Offer" },
];
