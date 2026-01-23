import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import { FormLayoutProps } from "@workspace/ui/types/formLayout";
import ProgressSteps from "./ProgressSteps";

const FormLayout = ({
  children,
  heading,
  steps,
  currentStep = 0,
  isDialog,
}: FormLayoutProps) => {
  return (
    <div
      className={`bg-white rounded-3xl ${!isDialog ? "shadow-md p-4 lg:p-10 mt-10 mb-24 sm:mt-0 sm:mb-8 lg:mx-[30px]" : "p-0 "} `}
    >
      {!isDialog && <SMSBackButton />}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mt-6 lg:mt-10">
        <div className="col-span-1 lg:col-span-6">
          <ProgressSteps
            heading={heading}
            steps={steps}
            currentStep={currentStep}
          />
        </div>
        <div className="col-span-1 lg:col-span-6">{children}</div>
      </div>
    </div>
  );
};

export default FormLayout;
