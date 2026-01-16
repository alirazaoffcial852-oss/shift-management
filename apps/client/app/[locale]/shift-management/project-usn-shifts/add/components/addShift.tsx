"use client";
import ShiftTabs from "./shiftTabs";
import ShiftInformation from "../../components/ShiftInformation";

interface AddProjectUSNShiftProps {
  selectedDate?: string | null;
  returnTo?: string;
}

const AddProjectUSNShift = ({
  selectedDate,
  returnTo,
}: AddProjectUSNShiftProps) => {
  return (
    <>
      <div className="max-w-[87rem] mx-auto shadow-xl rounde-xl p-6">
        <ShiftTabs />
        <ShiftInformation selectedDate={selectedDate} returnTo={returnTo} />
      </div>
    </>
  );
};

export default AddProjectUSNShift;
