import { Download } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Wagon } from "@/types/wagon";
import { WagonPreparationPDF } from "./WagonPreparationPDF";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";

type TranslationFunction = (key: string) => string;

export const getColumns = (t?: TranslationFunction) => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    { header: translate("common.company", "Company"), accessor: "company" },
    {
      header: translate("common.customer", "Customer"),
      accessor: "shiftTrain.shift.customer.name",
      render: (value: any, row: Wagon) => {
        const customerName = row?.shiftTrain?.shift?.customer?.name;
        const customerId = row?.shiftTrain?.shift?.customer_id;
        return (
          customerName ||
          (customerId
            ? `${translate("common.customer", "Customer")} #${customerId}`
            : translate("common.n_a", "N/A"))
        );
      },
    },
    {
      header: translate("common.date", "Date"),
      accessor: "shiftTrain.shift.date",
      render: (value?: string) => {
        if (!value) return translate("common.n_a", "N/A");
        try {
          return format(new Date(value), "dd/MM/yyyy");
        } catch {
          return value;
        }
      },
    },
    {
      header: translate("common.train_number", "Train Number"),
      accessor: "shiftTrain.train_no",
      render: (value?: string) => value || translate("common.n_a", "N/A"),
    },
    {
      header: translate("common.departure_location", "Departure Location"),
      accessor: "shiftTrain.departure_location",
      render: (value?: string) => value || translate("common.n_a", "N/A"),
    },
    {
      header: translate("common.arrival_location", "Arrival Location"),
      accessor: "shiftTrain.arrival_location",
      render: (value?: string) => value || translate("common.n_a", "N/A"),
    },
    {
      header: translate("components.sidebar.location", "Location"),
      accessor: "location",
    },
    {
      header: translate("common.rail_number", "Rail Number"),
      accessor: "rail_number",
    },
    {
      header: translate("common.labels.status", "Status"),
      accessor: "status",
      render: (value?: string) =>
        value === "ACTIVE"
          ? translate("common.active", "active")
          : translate("common.archive", "archive"),
    },
    {
      header: translate("common.brake_preparation", "Brake Preparation"),
      accessor: "brake_prep_restrictions_no",
      render: (value?: boolean) =>
        value === false
          ? translate("common.no", "No")
          : translate("common.yes", "Yes"),
    },
    {
      header: translate("common.tech_preparation", "Tech Preparation"),
      accessor: "tech_prep_restrictions_no",
      render: (value?: boolean) =>
        value === false
          ? translate("common.no", "No")
          : translate("common.yes", "Yes"),
    },
    {
      header: translate("common.dangerous_goods", "Dangerous Goods"),
      accessor: "dangerous_goods",
      render: (value?: boolean) =>
        value === false
          ? translate("common.no", "No")
          : translate("common.yes", "Yes"),
    },
  ];
};

const handleDownloadPDF = async (
  wagon: Wagon,
  t?: TranslationFunction,
  tPdf?: TranslationFunction
) => {
  try {
    console.log("wagon", wagon);
    if (!tPdf) {
      throw new Error("PDF translations are required");
    }
    const blob = await pdf(
      <WagonPreparationPDF wagon={wagon} t={tPdf} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const trainNo =
      wagon.shiftTrain?.train_no ||
      (wagon as any).locomotive ||
      wagon.id ||
      "download";
    link.download = `wagon_preparation_${trainNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMsg = t
      ? t("common.failed_to_generate_pdf")
      : "Failed to generate PDF. Please try again.";
    alert(errorMsg);
  }
};

export const getActions = (
  t?: TranslationFunction,
  tPdf?: TranslationFunction
) => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    {
      label: translate("common.download_pdf", "Download PDF"),
      element: (wagon: Wagon) => (
        <Button
          className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors bg-white text-black"
          onClick={() => handleDownloadPDF(wagon, t, tPdf)}
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="text-sm">
              {translate("common.download_pdf", "Download PDF")}
            </span>
          </span>
        </Button>
      ),
    },
  ];
};
