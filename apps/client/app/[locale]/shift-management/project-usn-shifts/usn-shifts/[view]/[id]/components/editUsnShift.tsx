"use client";
import ShiftInformation from "../../../../components/ShiftInformation";

interface EditUsnShiftProps {
  shift: any;
  returnTo?: string;
}

const EditUsnShift = ({ shift, returnTo }: EditUsnShiftProps) => {
  return (
    <>
      <div className="max-w-[87rem] mx-auto shadow-xl rounded-xl p-6">
        <ShiftInformation
          editMode={true}
          shiftId={shift.id}
          existingShift={shift}
          returnTo={returnTo}
          disableRoutePlanning={false}
        />
      </div>
    </>
  );
};

export default EditUsnShift;
