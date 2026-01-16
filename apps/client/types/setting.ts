export interface TabItem {
  id: string;
  label: string;
  path: string;
  alt: string[];
  requiredPermission?: string | null;
}
