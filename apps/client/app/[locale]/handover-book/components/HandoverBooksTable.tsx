"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { TableColumn } from "@workspace/ui/types/smsTable";
import HandoverBookService from "@/services/handoverBook";
import { toast } from "sonner";
import { Pencil, Trash2, Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  generateRegularHandoverBookPDF,
  generateUSNHandoverBookPDF,
} from "@/utils/pdf/handoverBookPDFGenerator";

interface HandoverBooksTableProps {
  isUSN?: boolean;
}

export default function HandoverBooksTable({
  isUSN = false,
}: HandoverBooksTableProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page: number = 1, search: string = "") => {
    setIsLoading(true);
    try {
      const response = isUSN
        ? await HandoverBookService.getUsnHandoverBooks({
            page,
            limit: 10,
            search: search || undefined,
          })
        : await HandoverBookService.getHandoverBooks({
            page,
            limit: 10,
            search: search || undefined,
          });

      if (response?.data) {
        const responseData = response.data;
        if (responseData.data && Array.isArray(responseData.data.data)) {
          setData(responseData.data.data || []);
          setTotalPages(responseData.data.pagination?.total_pages || 1);
        } else if (Array.isArray(responseData.data)) {
          setData(responseData.data || []);
          setTotalPages(responseData.pagination?.total_pages || 1);
        } else if (Array.isArray(responseData)) {
          setData(responseData || []);
          setTotalPages(1);
        } else {
          setData([]);
          setTotalPages(1);
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          (isUSN
            ? t("failedToFetchUsnHandoverBooks")
            : t("failedToFetchHandoverBooks"))
      );
      setData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchData(1, searchTerm);
    } else {
      setCurrentPage(1);
    }
  }, [isUSN]);

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      if (isUSN) {
        await HandoverBookService.deleteUsnHandoverBook(String(deleteId));
      } else {
        await HandoverBookService.deleteHandoverBook(String(deleteId));
      }
      toast.success(
        isUSN
          ? t("usnHandoverBookDeletedSuccessfully")
          : t("handoverBookDeletedSuccessfully")
      );
      setShowDeleteDialog(false);
      setDeleteId(null);
      fetchData(currentPage, searchTerm);
    } catch (error: any) {
      toast.error(
        error.message ||
          (isUSN
            ? t("failedToDeleteUsnHandoverBook")
            : t("failedToDeleteHandoverBook"))
      );
    }
  };

  const handleEdit = (row: any) => {
    if (isUSN) {
      router.push(`/handover-book/usn/${row.id}/edit`);
    } else {
      router.push(`/handover-book/${row.id}/edit`);
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchData(1, search);
  };

  const handleDownloadPDF = async (row: any) => {
    try {
      if (isUSN) {
        await generateUSNHandoverBookPDF(row, locale);
        toast.success(t("usnHandoverBookPdfDownloadedSuccessfully"));
      } else {
        await generateRegularHandoverBookPDF(row, locale);
        toast.success(t("regularHandoverBookPdfDownloadedSuccessfully"));
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          (isUSN
            ? t("failedToGenerateUsnHandoverBookPdf")
            : t("failedToGenerateHandoverBookPdf"))
      );
    }
  };

  const columns: TableColumn[] = [
    {
      header: t("locomotive_number"),
      accessor: "locomotive_number",
    },
    {
      header: t("train_driver_name"),
      accessor: "train_driver_name",
    },
    {
      header: t("date"),
      accessor: "date",
      render: (value) => (value ? format(new Date(value), "dd.MM.yyyy") : "-"),
    },
    {
      header: t("duty_start_time"),
      accessor: "duty_start_time",
      render: (value) =>
        value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "-",
    },
    {
      header: t("duty_end_time"),
      accessor: "duty_end_time",
      render: (value) =>
        value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "-",
    },
    {
      header: t("location_start"),
      accessor: "location_start",
    },
    {
      header: t("location_end"),
      accessor: "location_end",
    },
  ];

  const actions = [
    {
      label: t("download_pdf"),
      element: (row: any) => (
        <button
          onClick={() => handleDownloadPDF(row)}
          className="flex items-center gap-2 px-3 whitespace-nowrap py-2 text-sm text-green-600 hover:bg-green-50 rounded-md w-full"
        >
          <Download className="h-4 w-4" />
          {t("download_pdf")}
        </button>
      ),
    },
    {
      label: t("edit_handover_book"),
      element: (row: any) => (
        <button
          onClick={() => handleEdit(row)}
          className="flex items-center gap-2 px-3 whitespace-nowrap py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md w-full"
        >
          <Pencil className="h-4 w-4" />
          {t("edit_handover_book")}
        </button>
      ),
    },
    {
      label: t("delete_handover_book"),
      element: (row: any) => (
        <button
          onClick={() => {
            setDeleteId(row.id);
            setShowDeleteDialog(true);
          }}
          className="flex whitespace-nowrap items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full"
        >
          <Trash2 className="h-4 w-4" />
          {t("delete_handover_book")}
        </button>
      ),
    },
  ];

  return (
    <>
      <SMSTable
        columns={columns}
        data={data}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pagination={true}
        isLoading={isLoading}
        search={true}
        onSearchChange={handleSearch}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_handover_book")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_handover_book_confirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("buttons.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
