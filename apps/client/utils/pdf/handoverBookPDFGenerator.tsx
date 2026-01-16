import React from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { NextIntlClientProvider } from "next-intl";
import RegularHandoverBookHTML from "@/components/PDF/RegularHandoverBookHTML";
import USNHandoverBookHTML from "@/components/PDF/USNHandoverBookHTML";
import { getMessages } from "@workspace/translations/utils";

interface RegularHandoverBookData {
  id?: number;
  locomotive_number?: string;
  train_driver_name?: string;
  date?: string;
  duty_start_time?: string;
  duty_end_time?: string;
  location_start?: string;
  location_end?: string;
  operating_start?: string;
  operating_end?: string;
  fuel_level_start?: number;
  fuel_level_end?: number;
  clean_swept?: boolean;
  clean_trash_emptied?: boolean;
  clean_cockpit_cleaning?: boolean;
  other_remarks?: string;
  signature?: string;
  shift?: {
    id?: number;
    date?: string;
    start_time?: string;
    end_time?: string;
  };
  handoverbook_checks?: Array<{
    id?: number;
    section?: string;
    work_type?: string;
    is_ok?: boolean;
    description_if_not_ok?: string;
    reported_to?: string;
    status?: string;
  }>;
  handoverbook_coolant_oil_values?: {
    id?: number;
    coolant_percent?: string;
    lubricant_percent?: string;
    hydraulics_percent?: string;
    transmission_oil_percent?: string;
    engine_oil_percent?: string;
  };
}

interface USNHandoverBookData {
  id?: number;
  locomotive_number?: string;
  train_driver_name?: string;
  date?: string;
  duty_start_time?: string;
  duty_end_time?: string;
  location_start?: string;
  location_end?: string;
  operating_start?: string;
  operating_end?: string;
  fuel_level_start?: number;
  fuel_level_end?: number;
  clean_swept?: boolean;
  clean_trash_emptied?: boolean;
  clean_cockpit_cleaning?: boolean;
  other_remarks?: string;
  signature?: string;
  usn_shift?: {
    id?: number;
    date?: string;
    start_time?: string;
    end_time?: string;
  };
  usn_handoverbook_checks?: Array<{
    id?: number;
    section?: string;
    work_type?: string;
    is_ok?: boolean;
    description_if_not_ok?: string;
    reported_to?: string;
    status?: string;
  }>;
  usn_handoverbook_coolant_oil_values?: {
    id?: number;
    coolant_percent?: string;
    lubricant_percent?: string;
    hydraulics_percent?: string;
    transmission_oil_percent?: string;
    engine_oil_percent?: string;
  };
}

const getPDFFileName = (
  data: RegularHandoverBookData | USNHandoverBookData,
  isUSN: boolean = false
): string => {
  const prefix = isUSN ? "USN_Handover_Book" : "Regular_Handover_Book";
  const locomotiveNumber = data?.locomotive_number || "unknown";
  const date = data?.date
    ? new Date(data.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
  return `${prefix}_${locomotiveNumber}_${date}.pdf`;
};

const renderComponentToHTML = (
  component: React.ReactElement
): Promise<HTMLDivElement> => {
  return new Promise((resolve, reject) => {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "210mm";
      tempDiv.style.height = "auto";
      tempDiv.style.overflow = "visible";
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);
      root.render(component);

      setTimeout(() => {
        const images = tempDiv.querySelectorAll("img");
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          setTimeout(() => resolve(tempDiv), 200);
          return;
        }

        const checkComplete = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setTimeout(() => resolve(tempDiv), 200);
          }
        };

        images.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.onload = checkComplete;
            img.onerror = checkComplete;
            // Timeout after 5 seconds per image
            setTimeout(() => checkComplete(), 5000);
          }
        });
      }, 300);
    } catch (error) {
      reject(error);
    }
  });
};

export const generateRegularHandoverBookPDF = async (
  data?: RegularHandoverBookData,
  locale: string = "en"
): Promise<void> => {
  try {
    if (!data) {
      console.error("No data provided for PDF generation");
      return;
    }

    const fileName = getPDFFileName(data, false);

    const messages = await getMessages(locale);

    const htmlElement = await renderComponentToHTML(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <RegularHandoverBookHTML data={data} locale={locale} />
      </NextIntlClientProvider>
    );

    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      removeContainer: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById("handover-book-pdf");
        if (clonedElement) {
          clonedElement.style.width = "210mm";
          clonedElement.style.backgroundColor = "#ffffff";
          clonedElement.style.maxHeight = "297mm";
          clonedElement.style.overflow = "visible";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;

    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      finalWidth = imgWidth * scale;
      finalHeight = pageHeight;
    }

    pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);

    document.body.removeChild(htmlElement);

    pdf.save(fileName);
  } catch (error) {
    console.error("❌ Error generating Regular Handover Book PDF:", error);
    throw error;
  }
};

export const generateUSNHandoverBookPDF = async (
  data?: USNHandoverBookData,
  locale: string = "en"
): Promise<void> => {
  try {
    if (!data) {
      console.error("No data provided for PDF generation");
      return;
    }

    const fileName = getPDFFileName(data, true);

    const messages = await getMessages(locale);

    const htmlElement = await renderComponentToHTML(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <USNHandoverBookHTML data={data} locale={locale} />
      </NextIntlClientProvider>
    );

    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      removeContainer: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById("handover-book-pdf");
        if (clonedElement) {
          clonedElement.style.width = "210mm";
          clonedElement.style.backgroundColor = "#ffffff";
          clonedElement.style.maxHeight = "297mm";
          clonedElement.style.overflow = "visible";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;

    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      finalWidth = imgWidth * scale;
      finalHeight = pageHeight;
    }

    pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);

    document.body.removeChild(htmlElement);

    pdf.save(fileName);
  } catch (error) {
    console.error("❌ Error generating USN Handover Book PDF:", error);
    throw error;
  }
};
