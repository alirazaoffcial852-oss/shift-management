"use client";
import ViewHolidayForm from "../../../components/HolidaysForm";

const EditHoliday = ({ id }: { id: string }) => {
  return <ViewHolidayForm useComponentAs="EDIT" id={Number(id)} />;
};

export default EditHoliday;
