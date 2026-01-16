import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Shift } from "@/types/shift";
import { Timesheet } from "@/types/timeSheet";
import neoLoxImage from "@/assets/wagon/neolox.png";
import { useTranslations } from "next-intl";

interface TimesheetPDFProps {
  shift?: Shift;
  timesheet?: Timesheet;
  employeeName?: string;
  employeeRoleName?: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 8,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  titleRow: {
    backgroundColor: "#404040",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 8,
    minHeight: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 2,
    fontSize: 8,
    minHeight: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 2,
    fontSize: 8,
    minHeight: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    fontWeight: "bold",
  },
  logoCell: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 2,
    minHeight: 50,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "30%",
  },
  logo: {
    width: 80,
    height: 30,
    objectFit: "contain",
  },
  emptyCell: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 2,
    minHeight: 18,
  },
  textLeft: {
    textAlign: "left",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  textBold: {
    fontWeight: "bold",
  },
});

const TimesheetPDF: React.FC<TimesheetPDFProps> = ({
  shift,
  timesheet,
  employeeName,
  employeeRoleName,
}) => {
  const t = useTranslations("pdf");
  const getValue = (value: any, defaultValue: string = ""): string => {
    if (value === null || value === undefined || value === "")
      return defaultValue;
    return String(value);
  };

  const getRoleDisplayName = (roleName?: string): string => {
    if (!roleName) return t("trainDriver");

    const roleNameUpper = roleName.toUpperCase().trim();

    if (roleNameUpper === "TD") {
      return t("trainDriver");
    }
    if (roleNameUpper === "SAS") {
      return t("shuntingAttendant");
    }

    return roleName;
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("de-DE");
    } catch {
      return "";
    }
  };

  const calculateTotalHours = (
    start: string,
    end: string,
    breakDur: string
  ): string => {
    if (!start || !end) return "";
    try {
      const startParts = start.split(":").map(Number);
      const endParts = end.split(":").map(Number);
      if (startParts.length !== 2 || endParts.length !== 2) return "";

      const [startH, startM] = startParts;
      const [endH, endM] = endParts;
      if (
        startH === undefined ||
        startM === undefined ||
        endH === undefined ||
        endM === undefined
      )
        return "";

      const breakMinutes = parseInt(breakDur || "0");

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const totalMinutes = endMinutes - startMinutes - breakMinutes;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}:${minutes.toString().padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const totalHours = timesheet
    ? calculateTotalHours(
        timesheet.start_time,
        timesheet.end_time,
        timesheet.break_duration
      )
    : "";

  const currentEmployeeRole = shift?.shiftRole?.find(
    (r) =>
      r.employee?.name === employeeName ||
      r.employee_id?.toString() === timesheet?.employee_id?.toString()
  );
  const currentEmployeeRoleName =
    employeeRoleName ||
    (currentEmployeeRole as any)?.role?.short_name ||
    (currentEmployeeRole as any)?.role?.name;

  const otherEmployee = shift?.shiftRole?.find(
    (r) => r.employee?.name !== employeeName
  )?.employee;
  const otherEmployeeRole = shift?.shiftRole?.find(
    (r) => r.employee?.name !== employeeName
  );
  const otherEmployeeRoleName =
    (otherEmployeeRole as any)?.role?.short_name ||
    (otherEmployeeRole as any)?.role?.name;

  const Cell = ({
    children,
    width = "auto",
    align = "left",
    bold = false,
    isHeader = false,
    style = {},
  }: {
    children?: React.ReactNode;
    width?: string;
    align?: "left" | "center" | "right";
    bold?: boolean;
    isHeader?: boolean;
    style?: any;
  }) => {
    const cellStyle = isHeader ? styles.headerCell : styles.cell;
    const textStyle: any = { fontSize: 8 };
    if (align === "center") {
      textStyle.textAlign = "center";
    }
    if (align === "right") {
      textStyle.textAlign = "right";
    }
    if (bold) {
      textStyle.fontWeight = "bold";
    }

    return (
      <View
        style={[
          cellStyle,
          { width },
          align === "center" && styles.textCenter,
          align === "right" && styles.textRight,
          align === "left" && styles.textLeft,
          bold && styles.textBold,
          style,
        ]}
      >
        <Text style={textStyle}>{children || ""}</Text>
      </View>
    );
  };

  const EmptyCell = ({ width = "auto" }: { width?: string }) => (
    <View style={[styles.emptyCell, { width }]} />
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          <View style={[styles.titleRow, { width: "100%" }]}>
            <Text style={styles.titleText}>{t("bautagesbericht")}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Cell width="35%" align="left">
            {t("neoLox")}
          </Cell>
          <Cell width="35%" align="left">
            {getRoleDisplayName(currentEmployeeRoleName)}
          </Cell>
          <View style={styles.logoCell}>
            <Image
              src={(neoLoxImage as any)?.src || neoLoxImage}
              style={styles.logo}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Cell width="35%" align="left">
            {t("costcenterConstructionProject")}
          </Cell>
          <Cell width="35%" align="left">
            {getValue(employeeName, "")}
          </Cell>
          <Cell width="30%" align="right">
            {t("reportnumber")}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell width="35%" align="left">
            {getValue(shift?.bv_project?.name || shift?.project?.name, "")}
          </Cell>
          <Cell width="35%" align="left">
            {getRoleDisplayName(otherEmployeeRoleName)}
          </Cell>
          <Cell width="30%" align="right">
            {getValue(
              (timesheet as any)?.report_number ||
                timesheet?.report_number ||
                timesheet?.id?.toString() ||
                "",
              ""
            )}
          </Cell>
        </View>
        <View style={styles.row}>
          <EmptyCell width="35%" />
          <Cell width="35%" align="left">
            {getValue(otherEmployee?.name, "")}
          </Cell>
          <EmptyCell width="30%" />
        </View>
        <View style={styles.row}>
          <Cell width="35%" align="left" bold>
            {t("bezeichnungBv")}
          </Cell>
          <Cell width="35%" align="left">
            {t("date")}
          </Cell>
          <EmptyCell width="30%" />
        </View>
        <View style={styles.row}>
          <Cell width="35%" align="left">
            {getValue(shift?.bv_project?.name, "")}
          </Cell>
          <Cell width="35%" align="left">
            {getValue(formatDate(shift?.date), "")}
          </Cell>
          <EmptyCell width="30%" />
        </View>

        <View style={styles.row}>
          <Cell width="33.33%" align="left" isHeader>
            {t("costumer")}
          </Cell>
          <Cell width="33.33%" align="left" isHeader>
            {t("logetician")}
          </Cell>
          <Cell width="33.34%" align="left" isHeader>
            {t("contactPersonX")}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell width="33.33%" align="left">
            {getValue(shift?.customer?.name, "")}
          </Cell>
          <Cell width="33.33%" align="left">
            {getValue(shift?.dispatcher?.name, "")}
          </Cell>
          <Cell width="33.34%" align="left">
            {getValue(shift?.shiftDetail?.contact_person_name, "")}
          </Cell>
        </View>

        <View style={styles.row}>
          <Cell width="12%" align="center" isHeader>
            {t("from")}
          </Cell>
          <Cell width="12%" align="center" isHeader>
            {t("to")}
          </Cell>
          <Cell width="15%" align="center" isHeader>
            {t("breakDuration")}
          </Cell>
          <Cell width="15%" align="center" isHeader>
            {t("totalHours")}
          </Cell>
          <Cell width="8%" align="center" isHeader>
            -
          </Cell>
          <Cell width="18%" align="center" isHeader>
            {t("locomotiveNumberPdf")}
          </Cell>
          <Cell width="20%" align="center" isHeader>
            {t("commentsRemarks")}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell width="12%" align="center">
            {getValue(timesheet?.start_time, "")}
          </Cell>
          <Cell width="12%" align="center">
            {getValue(timesheet?.end_time, "")}
          </Cell>
          <Cell width="15%" align="center">
            {getValue(timesheet?.break_duration, "")}
          </Cell>
          <Cell width="15%" align="center">
            {getValue(totalHours, "")}
          </Cell>
          <Cell width="8%" align="center">
            -
          </Cell>
          <Cell width="18%" align="center">
            {getValue(
              shift?.locomotive_id ||
                shift?.locomotive?.name ||
                shift?.locomotive?.id,
              ""
            )}
          </Cell>
          <Cell width="20%" align="left">
            {getValue(timesheet?.notes, "")}
          </Cell>
        </View>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={styles.row}>
            <EmptyCell width="12%" />
            <EmptyCell width="12%" />
            <EmptyCell width="15%" />
            <EmptyCell width="15%" />
            <EmptyCell width="8%" />
            <EmptyCell width="18%" />
            <EmptyCell width="20%" />
          </View>
        ))}

        <View style={styles.row}>
          <Cell width="15%" align="center" isHeader>
            {t("trainNumber")}
          </Cell>
          <Cell width="18%" align="center" isHeader>
            {t("departureTrainStation")}
          </Cell>
          <Cell width="15%" align="center" isHeader>
            {t("noticeOfCompletion")}
          </Cell>
          <Cell width="12%" align="center" isHeader>
            {t("departureTime")}
          </Cell>
          <Cell width="18%" align="center" isHeader>
            {t("arrivalTrainStation")}
          </Cell>
          <Cell width="12%" align="center" isHeader>
            {t("arrivalTime")}
          </Cell>
          <Cell width="10%" align="center" isHeader>
            {t("commentsRemarks")}
          </Cell>
        </View>
        {timesheet?.train_details && timesheet.train_details.length > 0
          ? timesheet.train_details.map((train, index) => (
              <View key={index} style={styles.row}>
                <Cell width="15%" align="center">
                  {getValue(train.train_no, "")}
                </Cell>
                <Cell width="18%" align="left">
                  {getValue(train.departure_location, "")}
                </Cell>
                <Cell width="15%" align="center">
                  {getValue(train.notice_of_completion, "")}
                </Cell>
                <Cell width="12%" align="center">
                  {getValue(train.departure_time, "")}
                </Cell>
                <Cell width="18%" align="left">
                  {getValue(train.arrival_location, "")}
                </Cell>
                <Cell width="12%" align="center">
                  {getValue(train.arrival_time, "")}
                </Cell>
                <Cell width="10%" align="left">
                  {getValue(train.remarks, "")}
                </Cell>
              </View>
            ))
          : shift?.shiftTrain && shift.shiftTrain.length > 0
            ? shift.shiftTrain.map((train, index) => (
                <View key={index} style={styles.row}>
                  <Cell width="15%" align="center">
                    {getValue(train.train_no, "")}
                  </Cell>
                  <Cell width="18%" align="left">
                    {getValue(train.departure_location, "")}
                  </Cell>
                  <Cell width="15%" align="center"></Cell>
                  <Cell width="12%" align="center"></Cell>
                  <Cell width="18%" align="left">
                    {getValue(train.arrival_location, "")}
                  </Cell>
                  <Cell width="12%" align="center"></Cell>
                  <Cell width="10%" align="left"></Cell>
                </View>
              ))
            : null}
        {timesheet?.train_details &&
        timesheet.train_details.length > 0 &&
        timesheet.train_details.length < 6
          ? [1, 2, 3, 4, 5, 6]
              .slice(0, 6 - timesheet.train_details.length)
              .map((i) => (
                <View key={i} style={styles.row}>
                  <EmptyCell width="15%" />
                  <EmptyCell width="18%" />
                  <EmptyCell width="15%" />
                  <EmptyCell width="12%" />
                  <EmptyCell width="18%" />
                  <EmptyCell width="12%" />
                  <EmptyCell width="10%" />
                </View>
              ))
          : shift?.shiftTrain &&
              shift.shiftTrain.length > 0 &&
              shift.shiftTrain.length < 6
            ? [1, 2, 3, 4, 5, 6]
                .slice(0, 6 - shift.shiftTrain.length)
                .map((i) => (
                  <View key={i} style={styles.row}>
                    <EmptyCell width="15%" />
                    <EmptyCell width="18%" />
                    <EmptyCell width="15%" />
                    <EmptyCell width="12%" />
                    <EmptyCell width="18%" />
                    <EmptyCell width="12%" />
                    <EmptyCell width="10%" />
                  </View>
                ))
            : null}

        <View style={styles.row}>
          <Cell width="10%" align="center" isHeader>
            {t("from")}
          </Cell>
          <Cell width="10%" align="center" isHeader>
            {t("to")}
          </Cell>
          <Cell width="80%" align="left" isHeader>
            {t("worksPerformedWorkCarriedOut")}
          </Cell>
        </View>
        {timesheet?.work_performances && timesheet.work_performances.length > 0
          ? timesheet.work_performances.map((wp, index) => {
              const formatDateTime = (dateTimeStr: string) => {
                if (!dateTimeStr) return "";
                try {
                  const date = new Date(dateTimeStr);
                  return date.toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                } catch {
                  return dateTimeStr;
                }
              };
              return (
                <View key={index} style={styles.row}>
                  <Cell width="10%" align="center">
                    {getValue(formatDateTime(wp.from), "")}
                  </Cell>
                  <Cell width="10%" align="center">
                    {getValue(formatDateTime(wp.to), "")}
                  </Cell>
                  <Cell width="80%" align="left">
                    {getValue(wp.work_performance, "")}
                  </Cell>
                </View>
              );
            })
          : timesheet?.notes
            ? timesheet.notes
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => (
                  <View key={index} style={styles.row}>
                    <EmptyCell width="10%" />
                    <EmptyCell width="10%" />
                    <Cell width="80%" align="left">
                      {line.trim()}
                    </Cell>
                  </View>
                ))
            : null}
        {timesheet?.work_performances &&
        timesheet.work_performances.length > 0 &&
        timesheet.work_performances.length < 10
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              .slice(0, 10 - timesheet.work_performances.length)
              .map((i) => (
                <View key={i} style={styles.row}>
                  <EmptyCell width="10%" />
                  <EmptyCell width="10%" />
                  <EmptyCell width="80%" />
                </View>
              ))
          : null}

        <View style={styles.row}>
          <Cell width="10%" align="center" isHeader>
            {t("from")}
          </Cell>
          <Cell width="10%" align="center" isHeader>
            {t("to")}
          </Cell>
          <Cell width="70%" align="left" isHeader>
            {t("obstructionsDifficultiesChangesSpecialEvents")}
          </Cell>
          <Cell width="10%" align="center" isHeader>
            {t("changer")}
          </Cell>
        </View>
        {timesheet?.changes && timesheet.changes.length > 0
          ? timesheet.changes.map((change, index) => {
              const formatDateTime = (dateTimeStr: string) => {
                if (!dateTimeStr) return "";
                try {
                  const date = new Date(dateTimeStr);
                  return date.toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                } catch {
                  return dateTimeStr;
                }
              };
              return (
                <View key={index} style={styles.row}>
                  <Cell width="10%" align="center">
                    {getValue(formatDateTime(change.from), "")}
                  </Cell>
                  <Cell width="10%" align="center">
                    {getValue(formatDateTime(change.to), "")}
                  </Cell>
                  <Cell width="70%" align="left">
                    {getValue(change.changes, "")}
                  </Cell>
                  <Cell width="10%" align="left">
                    {getValue(change.changer, "")}
                  </Cell>
                </View>
              );
            })
          : timesheet?.extra_hours_note
            ? timesheet.extra_hours_note
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => (
                  <View key={index} style={styles.row}>
                    <EmptyCell width="10%" />
                    <EmptyCell width="10%" />
                    <Cell width="70%" align="left">
                      {line.trim()}
                    </Cell>
                    <EmptyCell width="10%" />
                  </View>
                ))
            : null}
        {timesheet?.changes &&
        timesheet.changes.length > 0 &&
        timesheet.changes.length < 10
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              .slice(0, 10 - timesheet.changes.length)
              .map((i) => (
                <View key={i} style={styles.row}>
                  <EmptyCell width="10%" />
                  <EmptyCell width="10%" />
                  <EmptyCell width="70%" />
                  <EmptyCell width="10%" />
                </View>
              ))
          : null}

        <View style={styles.row}>
          <Cell width="50%" align="left" bold>
            {t("nameEmployeeInBlockLetters")}
          </Cell>
          <Cell width="50%" align="left" bold>
            {t("nameSupervisorInBlockLetters")}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell width="50%" align="left">
            {getValue(employeeName, "")}
          </Cell>
          <Cell width="50%" align="left"></Cell>
        </View>
        <View style={styles.row}>
          <Cell width="25%" align="left" bold>
            {t("locationDate")}
          </Cell>
          <Cell width="25%" align="left" bold>
            {t("signature")}
          </Cell>
          <Cell width="25%" align="left" bold>
            {t("locationDate")}
          </Cell>
          <Cell width="25%" align="left" bold>
            {t("signatureCostumer")}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell width="25%" align="left">
            {getValue(
              formatDate(timesheet?.submitted_at || new Date().toISOString()),
              formatDate(new Date().toISOString())
            )}
          </Cell>
          <Cell width="25%" align="left">
            {timesheet?.signature ? (
              <Image
                src={timesheet.signature}
                style={{ width: 100, height: 40, objectFit: "contain" }}
              />
            ) : (
              ""
            )}
          </Cell>
          <Cell width="25%" align="left">
            {getValue(
              formatDate(timesheet?.submitted_at || new Date().toISOString()),
              formatDate(new Date().toISOString())
            )}
          </Cell>
          <Cell width="25%" align="left">
            {timesheet?.supervisor_signature ? (
              <Image
                src={timesheet.supervisor_signature}
                style={{ width: 100, height: 40, objectFit: "contain" }}
              />
            ) : (
              ""
            )}
          </Cell>
        </View>
      </Page>
    </Document>
  );
};

export default TimesheetPDF;
