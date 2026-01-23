import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";

interface SMSTableSkeletonProps {
  columns?: number;
  rows?: number;
  showSearch?: boolean;
  showActions?: boolean;
  className?: string;
}

export function SMSTableSkeleton({
  columns = 5,
  rows = 10,
  showSearch = true,
  showActions = true,
  className,
}: SMSTableSkeletonProps) {
  const totalColumns = showActions ? columns + 1 : columns;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mt-4 md:mt-6 !pb-1 !mb-4">
      <div className="rounded-lg overflow-x-auto">
        {showSearch && (
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full max-w-sm rounded-full" />
            </div>
          </div>
        )}

        <Table className={className}>
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="bg-muted">
              {Array.from({ length: totalColumns }).map((_, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    "font-medium whitespace-nowrap",
                    index === 0 && "rounded-l-xl",
                    index === totalColumns - 1 && "rounded-r-xl"
                  )}
                >
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="transition-colors">
                {Array.from({ length: totalColumns }).map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="whitespace-nowrap">
                    {cellIndex === totalColumns - 1 && showActions ? (
                      <Skeleton className="h-5 w-5 rounded-full" />
                    ) : (
                      <Skeleton
                        className={cn(
                          "h-4",
                          cellIndex === 0 ? "w-8" : "w-24"
                        )}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center gap-2 py-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
