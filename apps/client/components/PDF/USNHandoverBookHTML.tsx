import React from "react";
import { useTranslations } from "next-intl";
import neoLoxImage from "@/assets/wagon/neolox.png";

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

interface USNHandoverBookHTMLProps {
  data?: USNHandoverBookData;
  locale?: string;
}

const USNHandoverBookHTML: React.FC<USNHandoverBookHTMLProps> = ({
  data,
  locale = "en",
}) => {
  const t = useTranslations("pdf");
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr?: string): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getValue = (value: any, defaultValue: string = ""): string => {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    return String(value);
  };

  const startOfShiftChecks =
    data?.usn_handoverbook_checks?.filter(
      (check) => check.section === "START_OF_SHIFT"
    ) || [];
  const endOfShiftChecks =
    data?.usn_handoverbook_checks?.filter(
      (check) => check.section === "END_OF_SHIFT"
    ) || [];

  return (
    <div
      id="handover-book-pdf"
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        padding: "6mm 10mm 20mm 10mm",
        fontFamily: "Arial, sans-serif",
        fontSize: "8.5pt",
        backgroundColor: "#fff",
        color: "#000",
        boxSizing: "border-box",
        overflow: "visible",
        lineHeight: "1.3",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "4px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              lineHeight: "1.3",
              color: "#1976D2",
            }}
          >
            {t("usnHandoverBookForLocomotiveNo")}{" "}
            <span style={{ color: "#000" }}>
              {getValue(data?.locomotive_number)}
            </span>
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <img
            src={(neoLoxImage as any)?.src || neoLoxImage}
            alt="NEO LOX"
            style={{
              height: "40px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "8px",
          border: "0.5px solid #000",
          fontSize: "8pt",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                width: "20%",
                fontWeight: "normal",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("date")}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                width: "30%",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {formatDate(data?.date)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                width: "20%",
                backgroundColor: "#f0f0f0",
                fontWeight: "normal",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("nameFirstName")}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                width: "30%",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {getValue(data?.train_driver_name)}
              </span>
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                backgroundColor: "#f0f0f0",
                fontWeight: "normal",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("trainDriver")}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("start")}: {formatTime(data?.duty_start_time)} {t("end")}:{" "}
                {formatTime(data?.duty_end_time)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
              }}
            ></td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
              }}
            ></td>
          </tr>
          <tr>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                fontWeight: "normal",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Duty Time
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("start")}: {formatTime(data?.duty_start_time)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("end")}: {formatTime(data?.duty_end_time)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
              }}
            ></td>
          </tr>
          <tr>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                fontWeight: "normal",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Location
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("start")}: {getValue(data?.location_start)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("end")}: {getValue(data?.location_end)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
              }}
            ></td>
          </tr>
          <tr>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                fontWeight: "normal",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("operatingDaysOrHours")}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("start")}: {getValue(data?.operating_start)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
                color: "#000",
                wordWrap: "break-word",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("end")}: {getValue(data?.operating_end)}
              </span>
            </td>
            <td
              style={{
                border: "0.5px solid #000",
                padding: "4px 5px",
              }}
            ></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: "8px", fontSize: "8pt" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "6px",
          }}
        >
          <div style={{ flex: 1 }}>
            <strong style={{ color: "#1976D2" }}>
              {t("fuelLevelShiftStart")}
            </strong>{" "}
            <span style={{ color: "#000" }}>
              {getValue(data?.fuel_level_start)} / 8
              {data?.fuel_level_start === 8 && t("fullTank")}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ color: "#1976D2" }}>{t("fuelLevelShiftEnd")}</strong>{" "}
            <span style={{ color: "#000" }}>
              {getValue(data?.fuel_level_end)} / 8
              {data?.fuel_level_end === 8 && t("fullTank")}
            </span>
          </div>
        </div>
        <div>
          <strong style={{ color: "#1976D2" }}>{t("cleanlinessCheck")}</strong>
          <div
            style={{
              marginTop: "4px",
              display: "flex",
              gap: "15px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                margin: 0,
                textDecoration: "none",
              }}
            >
              <input
                type="checkbox"
                checked={data?.clean_swept || false}
                readOnly
                style={{
                  margin: 0,
                  width: "12px",
                  height: "12px",
                  textDecoration: "none",
                  marginTop: "10px",
                }}
              />
              <span style={{ textDecoration: "none" }}>{t("swept")}</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                margin: 0,
                textDecoration: "none",
              }}
            >
              <input
                type="checkbox"
                checked={data?.clean_trash_emptied || false}
                readOnly
                style={{
                  margin: 0,
                  width: "12px",
                  height: "12px",
                  textDecoration: "none",
                  marginTop: "10px",
                }}
              />
              <span style={{ textDecoration: "none" }}>{t("trashEmptied")}</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                margin: 0,
                textDecoration: "none",
              }}
            >
              <input
                type="checkbox"
                checked={data?.clean_cockpit_cleaning || false}
                readOnly
                style={{
                  margin: 0,
                  width: "12px",
                  height: "12px",
                  textDecoration: "none",
                  marginTop: "10px",
                }}
              />
              <span style={{ textDecoration: "none" }}>{t("cockpitCleaning")}</span>
            </label>
          </div>
        </div>
      </div>

      {startOfShiftChecks.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <h2
            style={{
              fontSize: "10pt",
              fontWeight: "bold",
              marginBottom: "6px",
              color: "#1976D2",
              lineHeight: "1.3",
            }}
          >
            {t("typeOfWorkStartOfShift")}
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0.5px solid #000",
              fontSize: "8pt",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("typeOfWorkStartOfShift")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "15%",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("inspection")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "25%",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("ifNotOkDescribe")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "20%",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("reportedTo")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "15%",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("status")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {startOfShiftChecks.map((check, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.work_type)}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={check.is_ok || false}
                          readOnly
                          style={{
                            width: "12px",
                            height: "12px",
                            margin: 0,
                            marginTop: "1px",
                            cursor: "default",
                            accentColor: "#000",
                            textDecoration: "none",
                            verticalAlign: "middle",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "7pt",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            lineHeight: "1.2",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          {t("ok")}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!check.is_ok || false}
                          readOnly
                          style={{
                            width: "12px",
                            height: "12px",
                            margin: 0,
                            marginTop: "1px",
                            cursor: "default",
                            accentColor: "#000",
                            textDecoration: "none",
                            verticalAlign: "middle",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "7pt",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            lineHeight: "1.2",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          {t("notOk")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.description_if_not_ok)}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.reported_to)}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.usn_handoverbook_coolant_oil_values && (
        <div style={{ marginBottom: "15px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0.5px solid #000",
              fontSize: "8pt",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("workType")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("check")}
                  </span>
                </th>
                <th
                  colSpan={5}
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("coolantLevelLubricantHydrostaticsGearboxEngineOil")}
                  </span>
                </th>
              </tr>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("checkCoolantLevelLubricantHydrostaticsGearboxEngineOil")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    I.O.
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    C %
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    S %
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    H %
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    GÖ %
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    MÖ %
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("checkCoolantLevelLubricantHydrostaticsGearboxEngineOil")}
                  </span>
                </td>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    I.O.
                  </span>
                </td>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getValue(
                      data.usn_handoverbook_coolant_oil_values.coolant_percent
                    )}
                  </span>
                </td>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getValue(
                      data.usn_handoverbook_coolant_oil_values.lubricant_percent
                    )}
                  </span>
                </td>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getValue(
                      data.usn_handoverbook_coolant_oil_values
                        .hydraulics_percent
                    )}
                  </span>
                </td>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getValue(
                      data.usn_handoverbook_coolant_oil_values
                        .transmission_oil_percent
                    )}
                  </span>
                </td>
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px 5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getValue(
                      data.usn_handoverbook_coolant_oil_values
                        .engine_oil_percent
                    )}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {endOfShiftChecks.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <h2
            style={{
              fontSize: "10pt",
              fontWeight: "bold",
              marginBottom: "6px",
              color: "#1976D2",
              lineHeight: "1.3",
            }}
          >
            {t("typeOfWorkEndOfShift")}
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0.5px solid #000",
              fontSize: "8pt",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("typeOfWorkEndOfShift")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "15%",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("inspection")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "25%",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("ifNotOkDescribe")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "20%",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("reportedTo")}
                  </span>
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "3px 4px",
                    textAlign: "center",
                    fontWeight: "normal",
                    width: "15%",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {t("status")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {endOfShiftChecks.map((check, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.work_type)}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={check.is_ok || false}
                          readOnly
                          style={{
                            width: "12px",
                            height: "12px",
                            margin: 0,
                            marginTop: "1px",
                            cursor: "default",
                            accentColor: "#000",
                            textDecoration: "none",
                            verticalAlign: "middle",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "7pt",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            lineHeight: "1.2",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          {t("ok")}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!check.is_ok || false}
                          readOnly
                          style={{
                            width: "12px",
                            height: "12px",
                            margin: 0,
                            marginTop: "1px",
                            cursor: "default",
                            accentColor: "#000",
                            textDecoration: "none",
                            verticalAlign: "middle",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "7pt",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            lineHeight: "1.2",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          {t("notOk")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.description_if_not_ok)}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.reported_to)}
                    </span>
                  </td>
                  <td
                    style={{
                      border: "0.5px solid #000",
                      padding: "4px 5px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {getValue(check.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.other_remarks && (
        <div style={{ marginBottom: "15px" }}>
          <h2
            style={{
              fontSize: "10pt",
              fontWeight: "bold",
              marginBottom: "6px",
              color: "#1976D2",
              lineHeight: "1.3",
            }}
          >
            {t("otherRemarks")}
          </h2>
          <div
            style={{
              border: "0.5px solid #000",
              padding: "4px 5px",
              minHeight: "40px",
              fontSize: "8pt",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {getValue(data.other_remarks)}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          fontSize: "9pt",
          minHeight: "120px",
          paddingBottom: "15px",
        }}
      >
        <div style={{ flex: 1, paddingRight: "20px" }}>
          <div style={{ marginBottom: "6px", lineHeight: "1.4" }}>
            <strong>{t("created")}</strong> {formatDate(new Date().toISOString())}
          </div>
          <div style={{ marginBottom: "6px", lineHeight: "1.4" }}>
            <strong>{t("checked")}</strong> {formatDate(new Date().toISOString())}
          </div>
          <div style={{ lineHeight: "1.4" }}>
            <strong>{t("released")}</strong> {formatDate(new Date().toISOString())}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "9pt",
            }}
          >
            {t("signature")}:
          </div>
          {data?.signature ? (
            <img
              src={data.signature}
              alt="Signature"
              style={{
                width: "220px",
                height: "90px",
                border: "0.5px solid #000",
                objectFit: "contain",
                backgroundColor: "#fff",
                display: "block",
                maxWidth: "100%",
                maxHeight: "90px",
              }}
            />
          ) : (
            <div
              style={{
                width: "220px",
                height: "90px",
                border: "0.5px solid #000",
                backgroundColor: "#fff",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default USNHandoverBookHTML;
