import { STATUS, EXTENDED_STATUS, FORMMODE } from "../shared/global";

export type TranslationFunction = (key: string, values?: Record<string, any>) => string;

export interface BaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export interface EntityDialogProps extends BaseDialogProps {
  type: FORMMODE | "add" | "edit";
  id?: string | number;
  refetch?: () => void;
}

export interface ConfirmDialogProps extends BaseDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

export interface BaseFormProps {
  onClose?: () => void;
  onSubmit?: (success: boolean) => void;
  refetch?: () => void;
  isDialog?: boolean;
}

export interface EntityFormProps<T = any> extends BaseFormProps {
  useComponentAs: FORMMODE;
  id?: number;
  initialData?: T;
}

export interface TableActionCallbacks<T = any> {
  onDelete?: (id: number) => void;
  onStatusUpdate?: (id: number, status: STATUS | EXTENDED_STATUS) => void;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
}

export interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
}

export interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  className?: string;
}

export interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

export interface PermissionGuardProps {
  permissions: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface PageProps {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export interface BulkActionButtonProps {
  selectedIds: number[] | string[];
  onAction: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  label: string;
  variant?: "default" | "destructive" | "outline";
}
