import { Wagon } from "@/types/wagon";
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
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2pt solid #000",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#666",
  },
  formSection: {
    marginBottom: 15,
    border: "1pt solid #000",
    padding: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    textDecoration: "underline",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  col: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    marginRight: 5,
  },
  value: {
    fontSize: 8,
    borderBottom: "1pt dotted #666",
    minHeight: 12,
    paddingBottom: 2,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: "1pt solid #000",
    marginRight: 3,
    textAlign: "center",
    fontSize: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: "1pt solid #000",
    marginRight: 3,
    textAlign: "center",
    fontSize: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 3,
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  table: {
    border: "1pt solid #000",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottom: "1pt solid #000",
    padding: 3,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
    borderRight: "1pt solid #000",
    padding: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
    minHeight: 20,
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    textAlign: "center",
    borderRight: "1pt solid #000",
    padding: 2,
    justifyContent: "center",
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  signatureBox: {
    width: 200,
    height: 80,
    border: "1pt solid #000",
    padding: 5,
  },
  signatureLabel: {
    fontSize: 8,
    marginBottom: 5,
    textAlign: "center",
  },
  signatureImage: {
    width: 180,
    height: 60,
    objectFit: "contain",
    marginTop: 5,
  },
  watermark: {
    position: "absolute",
    top: 50,
    right: 50,
    fontSize: 8,
    color: "#ccc",
    transform: "rotate(45deg)",
  },
});

type TranslationFunction = (key: string) => string;

export function WagonPreparationPDF({
  wagon,
  t,
}: {
  wagon: Wagon;
  t: TranslationFunction;
}) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "___________";
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const formatTime = (timeString: string | undefined) => {
    return timeString || "__:__";
  };

  const renderCheckbox = (checked: boolean) => (
    <Text style={checked ? styles.checkboxChecked : styles.checkbox}>
      {checked ? "✓" : ""}
    </Text>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>blp</Text>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {t("protocolOfOperationalAndTechnicalTrainPreparation")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("protokollDerBetrieblichTechnischenZugvorbereitung")}
          </Text>
        </View>
        <View style={styles.formSection}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("trainPreparationForTrain")}{" "}
                <Text style={styles.value}>
                  {wagon.shiftTrain?.train_no || "___"}
                </Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("locomotive")}{" "}
                <Text style={styles.value}>
                  {(wagon as any).locomotive || "___________"}
                </Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("in")}{" "}
                <Text style={styles.value}>
                  {wagon.location || "___________"}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("track")}{" "}
                <Text style={styles.value}>{wagon.rail_number || "___"}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            {t("technicalWagonPreparation")}
          </Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("date")}:{" "}
                <Text style={styles.value}>
                  {formatDate(wagon.tech_prep_date)}
                </Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("from")}:{" "}
                <Text style={styles.value}>
                  {formatTime(wagon.tech_prep_from_time)}
                </Text>{" "}
                {t("oClock")}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("to")}:{" "}
                <Text style={styles.value}>
                  {formatTime(wagon.tech_prep_to_time)}
                </Text>{" "}
                {t("oClock")}
              </Text>
            </View>
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>{t("accordingToVdv754")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.vdv_level_3a || false)}
              <Text style={styles.label}>{t("level3a")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.vdv_level_3b || false)}
              <Text style={styles.label}>{t("level3b")}</Text>
            </View>
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>{t("accordingToAvv")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.avv_zp || false)}
              <Text style={styles.label}>{t("zp")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.avv_wu || false)}
              <Text style={styles.label}>{t("wu")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.avv_wsu || false)}
              <Text style={styles.label}>{t("wsu")}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("restrictions")}</Text>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.tech_prep_restrictions_no || false)}
              <Text style={styles.label}>{t("no")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.tech_prep_restrictions_yes || false)}
              <Text style={styles.label}>{t("seeRemarks")}</Text>
            </View>
          </View>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            {t("brakeTechnicalPreparation")}
          </Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("date")}:{" "}
                <Text style={styles.value}>{formatDate(wagon.brake_date)}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("from")}:{" "}
                <Text style={styles.value}>
                  {formatTime(wagon.brake_from_time)}
                </Text>{" "}
                {t("oClock")}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>
                {t("to")}:{" "}
                <Text style={styles.value}>
                  {formatTime(wagon.brake_to_time)}
                </Text>{" "}
                {t("oClock")}
              </Text>
            </View>
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>{t("with")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.with_locomotive || false)}
              <Text style={styles.label}>{t("trainLocomotive")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.with_shunting_locomotive || false)}
              <Text style={styles.label}>{t("shuntingLocomotive")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.with_brake_testing_facilities || false)}
              <Text style={styles.label}>{t("brakeTestingEquipment")}</Text>
            </View>
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>{t("accordingToVdv757")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.vdv_757_full_breaking_test || false)}
              <Text style={styles.label}>{t("fullBrakeTest")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.vdv_757_simplified_breaking_test || false)}
              <Text style={styles.label}>{t("simplifiedBrakeTest")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.vdv_757_none || false)}
              <Text style={styles.label}>{t("withoutBrakeTest")}</Text>
            </View>
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>{t("function")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.function_auditor_level_3 || false)}
              <Text style={styles.label}>{t("inspectorLevel3")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.function_auditor_level_4 || false)}
              <Text style={styles.label}>{t("inspectorLevel4")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.function_wagon_auditor || false)}
              <Text style={styles.label}>{t("wagonInspector")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.function_wagon_master || false)}
              <Text style={styles.label}>{t("wagonMaster")}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t("restrictions")}</Text>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.brake_prep_restrictions_no || false)}
              <Text style={styles.label}>{t("no")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.brake_prep_restrictions_yes || false)}
              <Text style={styles.label}>{t("seeRemarks")}</Text>
            </View>
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>
                {t("theTrainContainsWagonsWith")}
              </Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.dangerous_goods || false)}
              <Text style={styles.label}>{t("dangerousGoods")}</Text>
            </View>
            <View style={styles.checkboxRow}>
              {renderCheckbox(wagon.extraordinary_shipments || false)}
              <Text style={styles.label}>{t("extraordinaryShipments")}</Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          <Text style={[styles.sectionTitle, { margin: 5 }]}>
            {t("wagonNumber")}
          </Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>{t("wagonNumberHeader")}</Text>
            <Text style={styles.tableHeaderCell}>{t("type")}</Text>
            <Text style={styles.tableHeaderCell}>
              {t("lengthOverBufferHeader")}
            </Text>
            <Text style={styles.tableHeaderCell}>{t("emptyAxles")}</Text>
            <Text style={styles.tableHeaderCell}>{t("loadedAxles")}</Text>
            <Text style={styles.tableHeaderCell}>{t("loadWeight")}</Text>
            <Text style={styles.tableHeaderCell}>{t("totalWeightHeader")}</Text>
            <Text style={styles.tableHeaderCell}>{t("pHeader")}</Text>
            <Text style={styles.tableHeaderCell}>{t("gHeader")}</Text>
            <Text style={styles.tableHeaderCell}>{t("remarksHeader")}</Text>
          </View>
          {wagon.wagonItems && wagon.wagonItems.length > 0
            ? wagon.wagonItems.map((item, index) => (
                <View key={item.id || index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {item.wagon_number || ""}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.type_of_wagon || ""}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.length_over_buffer || ""}
                  </Text>
                  <Text style={styles.tableCell}>{item.empty_axles || ""}</Text>
                  <Text style={styles.tableCell}>
                    {item.loaded_axles || ""}
                  </Text>
                  <Text style={styles.tableCell}>{item.load_weight || ""}</Text>
                  <Text style={styles.tableCell}>
                    {item.total_weight || ""}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.braking_weight_p || ""}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.braking_weight_g || ""}
                  </Text>
                  <Text style={styles.tableCell}>{item.remarks || ""}</Text>
                </View>
              ))
            : Array.from({ length: 8 }).map((_, index) => (
                <View key={index} style={styles.tableRow}>
                  {Array.from({ length: 11 }).map((_, cellIndex) => (
                    <Text key={cellIndex} style={styles.tableCell}></Text>
                  ))}
                </View>
              ))}
        </View>
        <View style={{ marginTop: 20, fontSize: 7, color: "#666" }}>
          <Text>
            {t("company")} {wagon.company || "_______________"}
          </Text>
          <Text>
            {t("createdOn")} {new Date().toLocaleDateString("en-US")} {t("at")}{" "}
            {new Date().toLocaleTimeString("en-US")}
          </Text>
        </View>
        {wagon.signature && wagon.signature.trim() !== "" && (
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>{t("signature")}</Text>
              <Image src={wagon.signature} style={styles.signatureImage} />
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
