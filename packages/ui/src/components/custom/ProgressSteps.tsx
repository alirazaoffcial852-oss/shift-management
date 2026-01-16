import { ProgressStepsProps } from "@workspace/ui/types/progressStep";
import { Check } from "lucide-react";

const ProgressSteps = ({
  currentStep = 0,
  steps,
  heading,
}: ProgressStepsProps) => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-[44px] font-semibold mb-4 md:mb-12 text-left leading-tight md:!leading-[53px]">
        {heading}
      </h1>

      {steps && (
        <div className="flex flex-col items-start">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 sm:space-x-3 mt-4 sm:mt-[32px]"
            >
              <div
                className={`rounded-full w-5 sm:w-6 h-6 sm:h-8 flex items-center justify-center text-base sm:text-[22px] font-medium
                ${index < currentStep ? "text-gray-500" : index === currentStep ? "text-black" : "text-gray-500"}`}
              >
                {index + 1}.
              </div>

              <div className="flex flex-col items-start">
                <span
                  className={`text-base sm:text-lg md:text-[22px] font-medium flex items-center 
                  ${index < currentStep ? "text-gray-500" : index === currentStep ? "text-black" : "text-gray-500"}`}
                >
                  {step.title}
                  {index < currentStep && (
                    <span className="ml-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-[#019800] rounded-full">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressSteps;
