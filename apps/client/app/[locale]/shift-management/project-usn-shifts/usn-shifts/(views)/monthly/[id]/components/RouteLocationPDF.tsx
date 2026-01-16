import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 18,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  docHeader: {
    marginBottom: 8,
  },
  docTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  docSubtitle: {
    fontSize: 9,
    color: "#333",
  },
  headerContainer: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  logoCellLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  logoCellRight: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  logoImage: {
    width: 140,
    height: 50,
    objectFit: "contain",
  },
  headerInfoRow: {
    flexDirection: "row",
    borderColor: "#000",
    borderTopWidth: 0,
  },
  headerInfoLeft: {
    flex: 3,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  headerInfoRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0,
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    width: 50,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
  },
  infoValue: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  infoValueMid: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  metaCellLabelText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  metaCellValueText: {
    fontSize: 8,
  },
  referenceText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 12,
  },
  tableHeaderPrimary: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f5f5f5",
  },
  headerCell: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerGroup: {
    flexDirection: "column",
    borderRightWidth: 1,
    borderColor: "#000",
  },
  headerGroupTitle: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerGroupRow: {
    flexDirection: "row",
  },
  headerGroupCell: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 7,
    justifyContent: "center",
    minHeight: 18,
    textAlign: "center",
  },
  tableCellLeftAlign: {
    textAlign: "left",
  },
  footer: {
    marginTop: 12,
    fontSize: 7,
    color: "#444",
  },
});

type TableRowData = Record<string, string>;

interface WagonBrakeManualDetails {
  empty_braking_weight?: string | number;
  full_braking_weight?: string | number;
  conversion_weight?: string | number;
}

interface WagonBrakeAutoDetails {
  maximum_braking_weight?: string | number;
}

interface WagonData {
  id: number;
  wagon_id: number;
  action: string;
  wagon: {
    wagon_number: string | number;
    status: string;
    location: string;
    wagon_type: string;
    maximun_capacity_of_load_weight: number;
    rail: string;
    position: string;
    has_damage: boolean;
    weight_of_the_wagon_itself?: number;
    weight_of_load?: number;
    empty_axles?: number;
    loaded_axles?: number;
    length_over_buffer?: string;
    brake_manual_details?: WagonBrakeManualDetails;
    brake_auto_details?: WagonBrakeAutoDetails;
    braking_type?: string;
    parking_brake?: boolean;
    has_automatic_brake?: boolean;
    has_rent?: boolean;
    wagon_rents?: Array<
      | {
          amount?: number;
          from?: string;
          to?: string;
        }
      | Record<string, unknown>
    >;
  };
}

type TranslationFunction = (key: string) => string;

interface RouteLocationPDFProps {
  locationType: "start" | "end";
  locationName: string;
  wagons: WagonData[];
  droppedWagons?: WagonData[];
  leftWagons?: WagonData[];
  routeInfo: {
    trainNo: string;
    purpose: string;
    startLocation: string;
    endLocation: string;
    date?: string;
  };
  t: TranslationFunction;
}

export function RouteLocationPDF({
  locationType,
  locationName,
  wagons,
  droppedWagons,
  leftWagons,
  routeInfo,
  t,
}: RouteLocationPDFProps) {
  const documentTitle =
    locationType === "start"
      ? t("startLocationDocument")
      : t("endLocationDocument");

  const targetRows =
    locationType === "end" && droppedWagons ? droppedWagons : wagons;

  const buildDate = routeInfo.date ? new Date(routeInfo.date) : new Date();

  const columns: Array<{
    key: keyof TableRowData;
    label: string;
    flex: number;
    align?: "left" | "center";
  }> = [
    { key: "index", label: t("lfdNr"), flex: 0.5 },
    { key: "wagonSegment1", label: "1-2", flex: 0.55 },
    { key: "wagonSegment2", label: "3-4", flex: 0.5 },
    { key: "wagonSegment3", label: "5-8", flex: 0.75 },
    { key: "wagonSegment4", label: "9-11", flex: 0.65 },
    { key: "wagonSegment5", label: "12", flex: 0.45 },
    { key: "wagonType", label: t("typeOfWag"), flex: 0.85 },
    { key: "axlesEmpty", label: t("empty"), flex: 0.55 },
    { key: "axlesLoaded", label: t("loaded"), flex: 0.6 },
    { key: "lengthOverBuffer", label: t("lengthOverBuffer"), flex: 0.9 },
    { key: "weightOfWagon", label: t("weightOfWagonInT"), flex: 0.85 },
    { key: "weightOfLoad", label: t("weightOfLoadInT"), flex: 0.85 },
    { key: "totalWeight", label: t("totalWeightInT"), flex: 0.85 },
    { key: "brakeG", label: t("g"), flex: 0.6 },
    { key: "brakeP", label: t("p"), flex: 0.6 },
    { key: "startLocation", label: t("startLocation"), flex: 1 },
    { key: "arrivalLocation", label: t("arrivalLocation"), flex: 1 },
    { key: "kl", label: t("kl"), flex: 0.45 },
    { key: "lking", label: t("lkng"), flex: 0.5 },
    { key: "br", label: t("br"), flex: 0.45 },
    { key: "km", label: t("kmHalt"), flex: 0.65 },
    { key: "remarks", label: t("remarks"), flex: 1.5, align: "left" },
  ];

  const columnMap = columns.reduce<Record<string, (typeof columns)[number]>>(
    (accumulator, column) => {
      accumulator[column.key] = column;
      return accumulator;
    },
    {}
  );

  const createEmptyRow = (message: string): TableRowData => {
    const row = {} as TableRowData;
    columns.forEach((column) => {
      row[column.key] = column.key === "remarks" ? message : "";
    });
    return row;
  };

  const headerStructure: Array<
    | { type: "column"; key: keyof TableRowData }
    | { type: "group"; label: string; keys: Array<keyof TableRowData> }
  > = [
    { type: "column", key: "index" },
    {
      type: "group",
      label: t("wagennumber"),
      keys: [
        "wagonSegment1",
        "wagonSegment2",
        "wagonSegment3",
        "wagonSegment4",
        "wagonSegment5",
      ],
    },
    { type: "column", key: "wagonType" },
    {
      type: "group",
      label: t("axles"),
      keys: ["axlesEmpty", "axlesLoaded"],
    },
    { type: "column", key: "lengthOverBuffer" },
    { type: "column", key: "weightOfWagon" },
    { type: "column", key: "weightOfLoad" },
    { type: "column", key: "totalWeight" },
    {
      type: "group",
      label: t("brakingWeight"),
      keys: ["brakeG", "brakeP"],
    },
    { type: "column", key: "startLocation" },
    { type: "column", key: "arrivalLocation" },
    { type: "column", key: "kl" },
    { type: "column", key: "lking" },
    { type: "column", key: "br" },
    { type: "column", key: "km" },
    { type: "column", key: "remarks" },
  ];

  const splitWagonNumber = (wagonNumber?: string | number): string[] => {
    if (wagonNumber === undefined || wagonNumber === null) {
      return ["", "", "", "", ""];
    }
    const normalized = wagonNumber
      .toString()
      .replace(/\D/g, "")
      .padStart(12, "0")
      .slice(-12);
    const padded = normalized.padEnd(12, "0");
    return [
      padded.slice(0, 2),
      padded.slice(2, 4),
      padded.slice(4, 8),
      padded.slice(8, 11),
      padded.slice(11),
    ];
  };

  const toNumber = (value: unknown): number | undefined => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const toStringValue = (value: unknown): string => {
    if (value === undefined || value === null) {
      return "";
    }
    return `${value}`;
  };

  const buildRowData = (
    rowIndex: number,
    wagonAction?: WagonData
  ): TableRowData => {
    const wagon = wagonAction?.wagon;
    const wagonSegments = splitWagonNumber(wagon?.wagon_number);
    const capacity = toNumber(wagon?.maximun_capacity_of_load_weight);
    const wagonWeight = toNumber(wagon?.weight_of_the_wagon_itself);
    const loadWeight = toNumber(wagon?.weight_of_load);
    const totalWeight =
      wagonWeight !== undefined && loadWeight !== undefined
        ? wagonWeight + loadWeight
        : undefined;
    const remarksParts: string[] = [];

    if (wagonAction?.action) {
      remarksParts.push(`${t("action")}: ${wagonAction.action}`);
    }

    if (wagon?.status) {
      remarksParts.push(`${t("status")}: ${wagon.status.replace(/_/g, " ")}`);
    }

    if (wagon?.has_damage) {
      remarksParts.push(t("damageReported"));
    }

    if (wagon?.rail) {
      remarksParts.push(`${t("rail")}: ${wagon.rail}`);
    }

    if (wagon?.position) {
      remarksParts.push(`${t("position")}: ${wagon.position}`);
    }

    const formattedCapacity = capacity !== undefined ? capacity.toString() : "";

    const startLocationValue =
      wagonAction == null
        ? ""
        : locationType === "start"
          ? locationName || routeInfo.startLocation || ""
          : wagon?.location || routeInfo.startLocation || "";

    const arrivalLocationValue =
      wagonAction == null
        ? ""
        : locationType === "end"
          ? locationName || routeInfo.endLocation || ""
          : routeInfo.endLocation || "";

    const brakeManual = wagon?.brake_manual_details;
    const brakeAuto = wagon?.brake_auto_details;

    const brakeGValue =
      toStringValue(brakeManual?.empty_braking_weight) ||
      toStringValue(brakeAuto?.maximum_braking_weight);

    const brakePValue = toStringValue(brakeManual?.full_braking_weight);

    const klValue = wagon?.braking_type ? wagon.braking_type : "";
    const lkingValue =
      wagon?.parking_brake !== undefined
        ? wagon.parking_brake
          ? t("yes")
          : t("no")
        : "";
    const brValue =
      wagon?.has_automatic_brake !== undefined
        ? wagon.has_automatic_brake
          ? t("auto")
          : t("manual")
        : "";

    if (wagon?.has_rent) {
      const rentDetails = Array.isArray(wagon.wagon_rents)
        ? wagon.wagon_rents[0] || {}
        : {};
      const rentSummaryParts: string[] = [`${t("rent")}: ${t("yes")}`];
      if ("amount" in rentDetails && rentDetails.amount !== undefined) {
        rentSummaryParts.push(`${t("amount")}: ${rentDetails.amount}`);
      }
      if ("from" in rentDetails && rentDetails.from) {
        rentSummaryParts.push(
          `${t("from")}: ${new Date(rentDetails.from as string).toLocaleDateString()}`
        );
      }
      if ("to" in rentDetails && rentDetails.to) {
        rentSummaryParts.push(
          `${t("to")}: ${new Date(rentDetails.to as string).toLocaleDateString()}`
        );
      }
      remarksParts.push(rentSummaryParts.join(" "));
    }

    return {
      index: (rowIndex + 1).toString(),
      wagonSegment1: wagonSegments[0] ?? "",
      wagonSegment2: wagonSegments[1] ?? "",
      wagonSegment3: wagonSegments[2] ?? "",
      wagonSegment4: wagonSegments[3] ?? "",
      wagonSegment5: wagonSegments[4] ?? "",
      wagonType: wagon?.wagon_type ?? "",
      axlesEmpty: toStringValue(wagon?.empty_axles),
      axlesLoaded: toStringValue(wagon?.loaded_axles),
      lengthOverBuffer: toStringValue(wagon?.length_over_buffer),
      weightOfWagon:
        wagonWeight !== undefined ? wagonWeight.toString() : formattedCapacity,
      weightOfLoad: loadWeight !== undefined ? loadWeight.toString() : "",
      totalWeight:
        totalWeight !== undefined ? totalWeight.toString() : formattedCapacity,
      brakeG: brakeGValue,
      brakeP: brakePValue,
      startLocation: startLocationValue,
      arrivalLocation: arrivalLocationValue,
      kl: klValue,
      lking: lkingValue,
      br: brValue,
      km: "",
      remarks: remarksParts.join(" | "),
    };
  };

  const composeRows = (rows?: WagonData[]): TableRowData[] =>
    (rows ?? []).map((item, index) => buildRowData(index, item));

  const mainRowsData = composeRows(targetRows);
  const hasMainRows = mainRowsData.length > 0;
  const mainRows = hasMainRows
    ? mainRowsData
    : [createEmptyRow(t("noWagonsListed"))];
  const hasLeftWagons = Boolean(leftWagons && leftWagons.length > 0);
  const leftRows = hasLeftWagons ? composeRows(leftWagons) : [];

  const formattedDate = buildDate.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const leftLogo = {
    src: "/wagon/wagon-list/2.png",
    align: "flex-start" as const,
  };
  const rightLogo = {
    src: "/wagon/wagon-list/1.png",
    align: "flex-end" as const,
  };

  const renderHeaderRow = (prefix: string) => (
    <View style={styles.tableHeaderPrimary}>
      {headerStructure.map((item, structureIndex) => {
        const isLastStructure = structureIndex === headerStructure.length - 1;

        if (item.type === "column") {
          const column = columnMap[item.key];
          const headerStyles: any[] = [
            styles.headerCell,
            { flex: column ? column.flex : 0 },
          ];

          if (isLastStructure) {
            headerStyles.push({ borderRightWidth: 0 });
          }

          return (
            <View
              key={`${prefix}-header-${String(item.key)}`}
              style={headerStyles}
            >
              <Text>{column ? column.label : ""}</Text>
            </View>
          );
        }

        const groupFlex = item.keys.reduce((sum, key) => {
          const column = columnMap[key];
          return sum + (column ? column.flex : 0);
        }, 0);

        const groupStyles: any[] = [styles.headerGroup, { flex: groupFlex }];

        if (isLastStructure) {
          groupStyles.push({ borderRightWidth: 0 });
        }

        return (
          <View
            key={`${prefix}-header-group-${item.label}`}
            style={groupStyles}
          >
            <View style={styles.headerGroupTitle}>
              <Text>{item.label}</Text>
            </View>
            <View style={styles.headerGroupRow}>
              {item.keys.map((key, keyIdx) => {
                const subColumn = columnMap[key];
                const cellStyles: any[] = [
                  styles.headerGroupCell,
                  { flex: subColumn ? subColumn.flex : 0 },
                ];

                if (keyIdx === item.keys.length - 1) {
                  cellStyles.push({ borderRightWidth: 0 });
                }

                return (
                  <View
                    key={`${prefix}-header-sub-${String(key)}`}
                    style={cellStyles}
                  >
                    <Text>{subColumn ? subColumn.label : ""}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderDataRows = (rows: TableRowData[], prefix: string) =>
    rows.map((row, rowIdx) => (
      <View key={`${prefix}-row-${rowIdx}`} style={styles.tableRow}>
        {columns.map((column, colIdx) => {
          const cellStyles: any[] = [styles.tableCell, { flex: column.flex }];

          if (column.align === "left") {
            cellStyles.push(styles.tableCellLeftAlign);
          }

          if (colIdx === columns.length - 1) {
            cellStyles.push({ borderRightWidth: 0 });
          }

          return (
            <View key={`${prefix}-${rowIdx}-${column.key}`} style={cellStyles}>
              <Text>{row[column.key] || ""}</Text>
            </View>
          );
        })}
      </View>
    ));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.logoCellLeft}>
              <Image
                src={leftLogo.src}
                style={[styles.logoImage, { alignSelf: leftLogo.align }]}
              />
            </View>
            <View style={styles.logoCellRight}>
              <Image
                src={rightLogo.src}
                style={[styles.logoImage, { alignSelf: rightLogo.align }]}
              />
            </View>
          </View>
          <View style={styles.headerInfoRow}>
            <View style={styles.headerInfoLeft}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Text style={styles.metaCellLabelText}>{t("train")}:</Text>
                </View>
                <View style={styles.infoValue}>
                  <Text style={styles.metaCellValueText}>
                    {routeInfo.trainNo || ""}
                  </Text>
                </View>
                <View style={styles.infoLabel}>
                  <Text style={styles.metaCellLabelText}>{t("on")}:</Text>
                </View>
                <View style={styles.infoValueMid}>
                  <Text style={styles.metaCellValueText}>{formattedDate}</Text>
                </View>
              </View>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <View style={styles.infoLabel}>
                  <Text style={styles.metaCellLabelText}>{t("from")}:</Text>
                </View>
                <View style={styles.infoValue}>
                  <Text style={styles.metaCellValueText}>
                    {routeInfo.startLocation || ""}
                  </Text>
                </View>
                <View style={styles.infoLabel}>
                  <Text style={styles.metaCellLabelText}>{t("to")}:</Text>
                </View>
                <View style={styles.infoValueMid}>
                  <Text style={styles.metaCellValueText}>
                    {routeInfo.endLocation || ""}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.headerInfoRight}>
              <Text style={styles.referenceText}>{t("referenz")}:</Text>
            </View>
          </View>
        </View>

        <View style={styles.docHeader}>
          <Text style={styles.docTitle}>{documentTitle}</Text>
          <Text style={styles.docSubtitle}>
            {t("routePlanningWagonReport")}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {locationType === "start"
            ? t("firstWagonActions")
            : t("droppedWagons")}
        </Text>

        <View style={styles.tableContainer}>
          {renderHeaderRow("main")}
          {renderDataRows(mainRows, "main")}
        </View>

        {hasLeftWagons && (
          <>
            <Text style={styles.sectionTitle}>{t("leftWagons")}</Text>
            <View style={styles.tableContainer}>
              {renderHeaderRow("left")}
              {renderDataRows(leftRows, "left")}
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text>
            {t("generated")}{" "}
            {new Date().toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            {new Date().toLocaleTimeString("de-DE")}
          </Text>
          <Text>
            {t("documentType")} {documentTitle}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
