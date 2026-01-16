"use client";

import * as React from "react";
import { StarRating } from "@workspace/ui/components/custom/StarRating";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import RoleService from "@/services/role";
import EmployeeService from "@/services/employee";
import { toast } from "sonner";
import { useAuth, useCompany } from "@/providers/appProvider";
import { useTranslations } from "next-intl";

interface EmployeeFeedbackFormProps {
  trainDriverName?: string;
  shantingAttendantName?: string;
  onSave?: (data: EmployeeFeedbackData) => void;
}

interface EmployeeFeedbackData {
  userRole: string;
  roleId: number;
  employee: string;
  employeeId: number;
  overallRating: number;
  expertiseRating: number;
  speedRating: number;
  punctualityRating: number;
  makeAllSame: boolean;
  addNote: boolean;
  notes: string;
}

interface Role {
  id: number;
  name: string;
  short_name: string;
  act_as: string;
  has_train_driver: boolean;
}

interface Employee {
  id: number;
  user_id: number;
  role_id: number;
  company_id: number;
  name?: string;
  email?: string;
  phone: string;
  status: string;
}

export default function EmployeeFeedbackForm({
  trainDriverName = "Train Driver Name",
  shantingAttendantName = "Shanting Attendant Name",
  onSave,
}: EmployeeFeedbackFormProps) {
  const t = useTranslations("pages.qualityManagement");
  const tCommon = useTranslations("common.buttons");

  // Get user and company from context
  const { user } = useAuth();
  const { company } = useCompany();

  // State for roles and employees from API
  const [allRoles, setAllRoles] = React.useState<Role[]>([]);
  const [allEmployees, setAllEmployees] = React.useState<Employee[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = React.useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = React.useState(true);

  // Selected states
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);

  // Rating states - stored per employee when makeAllSame is false
  // Format: { employeeId: { expertise, speed, punctuality, overall, notes } }
  const [employeeRatings, setEmployeeRatings] = React.useState<
    Record<
      number,
      {
        expertiseRating: number;
        speedRating: number;
        punctualityRating: number;
        overallRating: number;
        notes: string;
      }
    >
  >({});

  // Current displayed ratings (for UI)
  const [expertiseRating, setExpertiseRating] = React.useState(0);
  const [speedRating, setSpeedRating] = React.useState(0);
  const [punctualityRating, setPunctualityRating] = React.useState(0);
  const [overallRating, setOverallRating] = React.useState(0);
  const [makeAllSame, setMakeAllSame] = React.useState(false);
  const [addNote, setAddNote] = React.useState(true);
  const [notes, setNotes] = React.useState("");

  // Fetch all roles on component mount
  React.useEffect(() => {
    const fetchRoles = async () => {
      if (!user?.clientId || !company?.id) {
        console.log("No clientId available, skipping roles fetch");
        setIsLoadingRoles(false);
        return;
      }

      try {
        setIsLoadingRoles(true);
        const response = await RoleService.getAllRoles(
          Number(user.clientId),
          1,
          100,
          Number(company.id),
          "EMPLOYEE"
        );
        const roles = response?.data?.data || [];
        setAllRoles(roles);

        // Auto-select first role if available
        if (roles.length > 0) {
          setSelectedRole(roles[0]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error(t("loadingRoles"));
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [user?.clientId, company?.id]);

  // Fetch all employees on component mount
  React.useEffect(() => {
    const fetchEmployees = async () => {
      if (!company?.id) {
        console.log("No company ID available, skipping employees fetch");
        setIsLoadingEmployees(false);
        return;
      }

      try {
        setIsLoadingEmployees(true);
        const response = await EmployeeService.getAllEmployees(
          1,
          100,
          Number(company.id),
          "ACTIVE"
        );
        const employees = response?.data?.data || [];
        setAllEmployees(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error(t("loadingEmployees"));
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [company?.id]);

  // Filter employees by selected role
  const filteredEmployees = React.useMemo(() => {
    if (!selectedRole) return [];
    return allEmployees.filter((emp) => emp.role_id === selectedRole.id);
  }, [allEmployees, selectedRole]);

  // Auto-select first employee when role changes
  React.useEffect(() => {
    if (filteredEmployees.length > 0 && filteredEmployees[0]) {
      setSelectedEmployee(filteredEmployees[0]);
    } else {
      setSelectedEmployee(null);
    }
  }, [filteredEmployees]);

  // Load ratings when employee changes (only trigger on employee change, not on employeeRatings update)
  React.useEffect(() => {
    if (selectedEmployee) {
      const savedRatings = employeeRatings[selectedEmployee.id];
      if (savedRatings) {
        setExpertiseRating(savedRatings.expertiseRating);
        setSpeedRating(savedRatings.speedRating);
        setPunctualityRating(savedRatings.punctualityRating);
        setNotes(savedRatings.notes);
      } else {
        // If makeAllSame is true and we have other employee ratings, use those
        if (makeAllSame && filteredEmployees.length > 0) {
          // Try to get ratings from first employee in the list
          const firstEmpId = filteredEmployees[0]?.id;
          if (firstEmpId) {
            const sharedRatings = employeeRatings[firstEmpId];
            if (sharedRatings) {
              setExpertiseRating(sharedRatings.expertiseRating);
              setSpeedRating(sharedRatings.speedRating);
              setPunctualityRating(sharedRatings.punctualityRating);
              setNotes(sharedRatings.notes);
              return;
            }
          }
        }
        // Reset to default if no saved ratings
        setExpertiseRating(0);
        setSpeedRating(0);
        setPunctualityRating(0);
        setNotes("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee]);

  // Auto-calculate overall rating when individual ratings change
  React.useEffect(() => {
    const calculatedRating =
      (expertiseRating + speedRating + punctualityRating) / 3;
    setOverallRating(calculatedRating);
  }, [expertiseRating, speedRating, punctualityRating]);

  // Handler for when a User Role is clicked
  const handleRoleClick = (role: Role) => {
    setSelectedRole(role);
  };

  // Handler for when an Employee is clicked
  const handleEmployeeClick = (employee: Employee) => {
    // Save current employee's ratings before switching (for individual mode)
    if (!makeAllSame && selectedEmployee) {
      setEmployeeRatings((prev) => ({
        ...prev,
        [selectedEmployee.id]: {
          expertiseRating,
          speedRating,
          punctualityRating,
          overallRating,
          notes,
        },
      }));
    }
    setSelectedEmployee(employee);
  };

  // Update ratings handler - saves to employeeRatings state
  const updateRatings = React.useCallback(
    (
      newExpertise?: number,
      newSpeed?: number,
      newPunctuality?: number,
      newNotes?: string
    ) => {
      const updatedExpertise = newExpertise ?? expertiseRating;
      const updatedSpeed = newSpeed ?? speedRating;
      const updatedPunctuality = newPunctuality ?? punctualityRating;
      const updatedNotes = newNotes ?? notes;

      if (!makeAllSame && selectedEmployee) {
        // Save for current employee only
        setEmployeeRatings((prev) => ({
          ...prev,
          [selectedEmployee.id]: {
            expertiseRating: updatedExpertise,
            speedRating: updatedSpeed,
            punctualityRating: updatedPunctuality,
            overallRating:
              (updatedExpertise + updatedSpeed + updatedPunctuality) / 3,
            notes: updatedNotes,
          },
        }));
      } else if (makeAllSame && selectedRole && filteredEmployees.length > 0) {
        // Save for all employees in the role
        const currentRatings = {
          expertiseRating: updatedExpertise,
          speedRating: updatedSpeed,
          punctualityRating: updatedPunctuality,
          overallRating:
            (updatedExpertise + updatedSpeed + updatedPunctuality) / 3,
          notes: updatedNotes,
        };

        setEmployeeRatings((prev) => {
          const updated = { ...prev };
          filteredEmployees.forEach((emp) => {
            updated[emp.id] = { ...currentRatings };
          });
          return updated;
        });
      }
    },
    [
      makeAllSame,
      selectedEmployee,
      selectedRole,
      filteredEmployees,
      expertiseRating,
      speedRating,
      punctualityRating,
      notes,
    ]
  );

  // Custom handlers for rating changes
  const handleExpertiseChange = React.useCallback(
    (value: number) => {
      setExpertiseRating(value);
      updateRatings(value, undefined, undefined, undefined);
    },
    [updateRatings]
  );

  const handleSpeedChange = React.useCallback(
    (value: number) => {
      setSpeedRating(value);
      updateRatings(undefined, value, undefined, undefined);
    },
    [updateRatings]
  );

  const handlePunctualityChange = React.useCallback(
    (value: number) => {
      setPunctualityRating(value);
      updateRatings(undefined, undefined, value, undefined);
    },
    [updateRatings]
  );

  const handleNotesChange = React.useCallback(
    (value: string) => {
      setNotes(value);
      updateRatings(undefined, undefined, undefined, value);
    },
    [updateRatings]
  );

  // Handler for makeAllSame checkbox change
  const handleMakeAllSameChange = (checked: boolean) => {
    setMakeAllSame(checked);

    if (checked) {
      // When enabling makeAllSame, apply current ratings to all employees in the role
      if (selectedRole && filteredEmployees.length > 0) {
        const currentRatings = {
          expertiseRating,
          speedRating,
          punctualityRating,
          overallRating,
          notes,
        };

        const allEmployeeRatings: Record<number, typeof currentRatings> = {};
        filteredEmployees.forEach((emp) => {
          allEmployeeRatings[emp.id] = { ...currentRatings };
        });

        setEmployeeRatings((prev) => ({
          ...prev,
          ...allEmployeeRatings,
        }));
      }
    }
  };

  const handleSave = () => {
    if (!selectedRole) {
      toast.error(t("pleaseSelectRoleError"));
      return;
    }

    if (filteredEmployees.length === 0) {
      toast.error(t("noEmployeesForRole"));
      return;
    }

    // If makeAllSame is true, save ratings for all employees
    // If makeAllSame is false, save only current employee's ratings
    if (makeAllSame) {
      // Save ratings for all employees in the role
      filteredEmployees.forEach((emp) => {
        const empRatings = employeeRatings[emp.id] || {
          expertiseRating,
          speedRating,
          punctualityRating,
          overallRating,
          notes,
        };

        const data: EmployeeFeedbackData = {
          userRole: selectedRole.name,
          roleId: selectedRole.id,
          employee: emp.name || `Employee ${emp.id}`,
          employeeId: emp.id,
          overallRating: empRatings.overallRating,
          expertiseRating: empRatings.expertiseRating,
          speedRating: empRatings.speedRating,
          punctualityRating: empRatings.punctualityRating,
          makeAllSame: true,
          addNote,
          notes: empRatings.notes,
        };
        onSave?.(data);
      });

      toast.success(
        t("feedbackSavedForAll", { count: filteredEmployees.length })
      );
    } else {
      // Save only current employee's ratings
      if (!selectedEmployee) {
        toast.error(t("pleaseSelectEmployee"));
        return;
      }

      const empRatings = employeeRatings[selectedEmployee.id] || {
        expertiseRating,
        speedRating,
        punctualityRating,
        overallRating,
        notes,
      };

      const data: EmployeeFeedbackData = {
        userRole: selectedRole.name,
        roleId: selectedRole.id,
        employee: selectedEmployee.name || `Employee ${selectedEmployee.id}`,
        employeeId: selectedEmployee.id,
        overallRating: empRatings.overallRating,
        expertiseRating: empRatings.expertiseRating,
        speedRating: empRatings.speedRating,
        punctualityRating: empRatings.punctualityRating,
        makeAllSame: false,
        addNote,
        notes: empRatings.notes,
      };
      onSave?.(data);
      toast.success(
        t("feedbackSaved", {
          name: selectedEmployee.name || `Employee ${selectedEmployee.id}`,
        })
      );
    }
  };

  return (
    <div className="w-full mx-auto py-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 912px) {
          .rating-grid {
            grid-template-columns: 1fr !important;
          }
          .rating-item-with-padding {
            padding-left: 0px !important;
          }
          .rating-speed {
            margin-top: 0px !important;
          }
        }
      `,
        }}
      />
      {/* Header - Centered, Semi Bold, #2D2E33 */}
      <div className="mb-6">
        <h2
          className="text-center font-semibold leading-[100%]"
          style={{
            fontSize: "28px",
            color: "#2D2E33",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {t("giveFeedbackToEmployee")}
        </h2>
      </div>

      {/* User Roles */}
      <div className="mb-5">
        <span
          className="font-semibold block mb-3"
          style={{
            fontSize: "20px",
            color: "#2D2E33",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {t("userRoles")}
        </span>
        <div className="flex flex-wrap gap-3" style={{ paddingLeft: "120px" }}>
          {isLoadingRoles ? (
            <div className="text-gray-500 text-sm">{t("loadingRoles")}</div>
          ) : allRoles.length === 0 ? (
            <div className="text-gray-500 text-sm">{t("noRolesAvailable")}</div>
          ) : (
            allRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
                  selectedRole?.id === role.id
                    ? "bg-[#3E8258] text-white shadow-md scale-105 hover:bg-[#3E8258]"
                    : "bg-white border-2 border-gray-300 text-black hover:bg-[#3E8258] hover:text-white hover:border-[#3E8258]"
                }`}
                style={{
                  minWidth: "120px",
                  opacity: 1,
                  visibility: "visible",
                  color: selectedRole?.id === role.id ? "" : "#374151",
                  fontWeight: 500,
                }}
              >
                {role.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Employees */}
      <div className="mb-6">
        <span
          className="font-semibold block mb-3"
          style={{
            fontSize: "20px",
            color: "#2D2E33",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {t("employees")}
        </span>
        <div className="flex flex-wrap gap-3" style={{ paddingLeft: "120px" }}>
          {isLoadingEmployees ? (
            <div className="text-gray-500 text-sm">{t("loadingEmployees")}</div>
          ) : !selectedRole ? (
            <div className="text-gray-500 text-sm">{t("pleaseSelectRole")}</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-gray-500 text-sm">
              {t("noEmployeesFound", { role: selectedRole.name })}
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => handleEmployeeClick(emp)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${
                  selectedEmployee?.id === emp.id
                    ? "bg-[#3E8258] text-white shadow-md scale-105 hover:bg-[#3E8258]"
                    : "bg-white border-2 border-gray-300 text-black hover:bg-[#3E8258] hover:text-white hover:border-[#3E8258]"
                }`}
                style={{
                  minWidth: "150px",
                  opacity: 1,
                  visibility: "visible",
                  color: selectedEmployee?.id === emp.id ? "" : "#374151",
                  fontWeight: 500,
                }}
              >
                {emp.name || `Employee ${emp.id}`}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Overall Rating */}
      {/* <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="font-semibold leading-[100%]"
            style={{
              fontSize: "20px",
              color: "#2D2E33",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            Overall Rating:
          </span>
          <span
            className="font-semibold leading-[100%]"
            style={{
              fontSize: "20px",
              color: "#FFA500",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {overallRating.toFixed(1)}
          </span>
        </div>
        <StarRating value={overallRating} size={22} />
      </div> */}
      {/* Overall Rating (Improved UI) */}
      <div className=" mb-6">
        <div className="flex items-center gap-4">
          <span
            className="font-semibold leading-[100%]"
            style={{
              fontSize: "20px",
              color: "#2D2E33",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {t("overallRating")}:
          </span>

          <div className="flex items-center gap-2">
            <span
              className="font-semibold"
              style={{
                fontSize: "20px",
                color: "#FFA500",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              {overallRating.toFixed(1)}
            </span>
            <StarRating value={overallRating} size={22} />
          </div>
        </div>
      </div>

      {/* Rating Categories - 2 Column Grid Layout */}
      <div className="mb-6">
        <div className="rating-grid grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Expertise */}
          <div
            className="rating-item-with-padding flex items-center gap-3"
            style={{ paddingLeft: "120px" }}
          >
            <span
              className="font-semibold"
              style={{
                fontSize: "20px",
                color: "#000000",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              {t("expertise")}
            </span>
            <StarRating
              value={expertiseRating}
              size={22}
              onChange={handleExpertiseChange}
            />
          </div>

          {/* Punctuality */}
          <div className="flex items-center gap-3">
            <span
              className="font-semibold"
              style={{
                fontSize: "20px",
                color: "#000000",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              {t("punctuality")}
            </span>
            <StarRating
              value={punctualityRating}
              size={22}
              onChange={handlePunctualityChange}
            />
          </div>

          {/* Speed */}
          <div
            className="rating-item-with-padding rating-speed flex items-center gap-3"
            style={{ paddingLeft: "120px", marginTop: "24px" }}
          >
            <span
              className="font-semibold"
              style={{
                fontSize: "20px",
                color: "#000000",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              {t("speed")}
            </span>
            <StarRating
              value={speedRating}
              size={22}
              onChange={handleSpeedChange}
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={makeAllSame}
              onChange={(e) => handleMakeAllSameChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              style={{
                accentColor: "#3E8258",
              }}
            />
            <span
              className="font-normal"
              style={{
                fontSize: "16px",
                color: "#2D2E33",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
              }}
            >
              {t("makeAllRatingSame")}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addNote}
              onChange={(e) => setAddNote(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              style={{
                accentColor: "#3E8258",
              }}
            />
            <span
              className="font-normal"
              style={{
                fontSize: "16px",
                color: "#2D2E33",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
              }}
            >
              {t("addNote")}
            </span>
          </label>
        </div>
      </div>

      {/* Notes Section */}
      {addNote && (
        <div className="mb-6 w-full">
          <span
            className="font-semibold block mb-3"
            style={{
              fontSize: "16px",
              color: "#818285",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            {t("notes")}:
          </span>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={t("notesPlaceholder")}
            className="w-full min-w-0 h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#818285] placeholder:font-normal box-border"
            style={{
              fontSize: "16px",
              color: "#2D2E33",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
            }}
          />
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
        <SMSButton
          text={tCommon("save")}
          className="bg-black rounded-full min-w-[120px]"
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
