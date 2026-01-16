import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useTranslations } from "next-intl";

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

interface USNHandoverBookPDFProps {
  data?: USNHandoverBookData;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderBottom: "2 solid #000",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottom: "1 solid #e0e0e0",
    paddingBottom: 5,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 10,
  },
  value: {
    width: "60%",
    fontSize: 10,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderBottom: "2 solid #000",
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1 solid #e0e0e0",
  },
  tableCell: {
    fontSize: 9,
    flex: 1,
  },
  signatureContainer: {
    marginTop: 20,
    padding: 10,
    border: "1 solid #000",
    minHeight: 100,
  },
  signatureImage: {
    width: 150,
    height: 60,
    objectFit: "contain",
  },
  checkbox: {
    fontSize: 12,
    marginRight: 5,
  },
  textCenter: {
    textAlign: "center",
  },
});

const USNHandoverBookPDF: React.FC<USNHandoverBookPDFProps> = ({ data }) => {
  const t = useTranslations("pdf");
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getValue = (value: any, defaultValue: string = "-"): string => {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    return String(value);
  };

  const getBooleanValue = (value?: boolean): string => {
    if (value === true) return t("yes");
    if (value === false) return t("no");
    return "-";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{t("usnShiftHandoverBook")}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("basicInformation")}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t("locomotiveNumber")}</Text>
            <Text style={styles.value}>
              {getValue(data?.locomotive_number)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("trainDriverName")}</Text>
            <Text style={styles.value}>
              {getValue(data?.train_driver_name)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("date")}</Text>
            <Text style={styles.value}>{formatDate(data?.date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("dutyStartTime")}</Text>
            <Text style={styles.value}>
              {formatDateTime(data?.duty_start_time)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("dutyEndTime")}</Text>
            <Text style={styles.value}>
              {formatDateTime(data?.duty_end_time)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("locationStart")}</Text>
            <Text style={styles.value}>{getValue(data?.location_start)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("locationEnd")}</Text>
            <Text style={styles.value}>{getValue(data?.location_end)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("operatingTimes")}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t("operatingStart")}</Text>
            <Text style={styles.value}>{getValue(data?.operating_start)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("operatingEnd")}</Text>
            <Text style={styles.value}>{getValue(data?.operating_end)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("fuelLevels")}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t("fuelLevelStart")}</Text>
            <Text style={styles.value}>
              {getValue(data?.fuel_level_start, "-")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("fuelLevelEnd")}</Text>
            <Text style={styles.value}>
              {getValue(data?.fuel_level_end, "-")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("cleaningStatus")}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t("swept")}</Text>
            <Text style={styles.value}>
              {getBooleanValue(data?.clean_swept)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("trashEmptied")}</Text>
            <Text style={styles.value}>
              {getBooleanValue(data?.clean_trash_emptied)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("cockpitCleaning")}</Text>
            <Text style={styles.value}>
              {getBooleanValue(data?.clean_cockpit_cleaning)}
            </Text>
          </View>
        </View>

        {data?.usn_handoverbook_coolant_oil_values && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("coolantOilValues")}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{t("coolantPercent")}</Text>
              <Text style={styles.value}>
                {getValue(
                  data.usn_handoverbook_coolant_oil_values.coolant_percent
                )}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("lubricantPercent")}</Text>
              <Text style={styles.value}>
                {getValue(
                  data.usn_handoverbook_coolant_oil_values.lubricant_percent
                )}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("hydraulicsPercent")}</Text>
              <Text style={styles.value}>
                {getValue(
                  data.usn_handoverbook_coolant_oil_values.hydraulics_percent
                )}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("transmissionOilPercent")}</Text>
              <Text style={styles.value}>
                {getValue(
                  data.usn_handoverbook_coolant_oil_values
                    .transmission_oil_percent
                )}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("engineOilPercent")}</Text>
              <Text style={styles.value}>
                {getValue(
                  data.usn_handoverbook_coolant_oil_values.engine_oil_percent
                )}
              </Text>
            </View>
          </View>
        )}

        {data?.usn_handoverbook_checks &&
          data.usn_handoverbook_checks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("checks")}</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>{t("section")}</Text>
                  <Text style={styles.tableHeaderCell}>{t("workType")}</Text>
                  <Text style={styles.tableHeaderCell}>{t("status")}</Text>
                  <Text style={styles.tableHeaderCell}>{t("description")}</Text>
                  <Text style={styles.tableHeaderCell}>{t("reportedTo")}</Text>
                </View>
                {data.usn_handoverbook_checks.map((check, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {getValue(check.section)}
                    </Text>
                    <Text style={styles.tableCell}>
                      {getValue(check.work_type)}
                    </Text>
                    <Text style={styles.tableCell}>
                      {check.is_ok ? t("ok") : t("notOk")}
                    </Text>
                    <Text style={styles.tableCell}>
                      {getValue(check.description_if_not_ok)}
                    </Text>
                    <Text style={styles.tableCell}>
                      {getValue(check.reported_to)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {data?.other_remarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("otherRemarks")}</Text>
            <Text style={styles.value}>{getValue(data.other_remarks)}</Text>
          </View>
        )}

        {data?.signature && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("signature")}</Text>
            <View style={styles.signatureContainer}>
              <Image src={data.signature} style={styles.signatureImage} />
            </View>
          </View>
        )}

        {data?.usn_shift && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("usnShiftInformation")}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{t("shiftDate")}</Text>
              <Text style={styles.value}>
                {formatDate(data.usn_shift.date)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("startTime")}</Text>
              <Text style={styles.value}>
                {formatDateTime(data.usn_shift.start_time)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("endTime")}</Text>
              <Text style={styles.value}>
                {formatDateTime(data.usn_shift.end_time)}
              </Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default USNHandoverBookPDF;
