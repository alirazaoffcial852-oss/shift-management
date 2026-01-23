"use client";

import ProgressSteps from "@workspace/ui/components/custom/ProgressSteps";
import { FormLayoutProps } from "@workspace/ui/types/formLayout";
import Image from "next/image";
import Link from "next/link";
import { getImagePath } from "@/utils/imagePath";

const ConfigurationLayout = ({
  children,
  steps,
  currentStep = 0,
}: FormLayoutProps) => {
  return (
    <div className="p-4 bg-white min-h-screen flex flex-col">
      <div className="w-[250px] flex-shrink-0">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={getImagePath("/images/logo.png")}
            width={1000}
            height={40}
            alt="Shift Management"
            className="w-auto h-auto"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 mt-4 md:mt-10 px-4 md:pl-12 md:pr-8 flex-grow relative">
        <div className="col-span-12 md:col-span-6 md:sticky md:top-0 md:self-start">
          <div className="p-4 sm:p-6 md:p-10 md:mb-0">
            <ProgressSteps
              currentStep={currentStep}
              steps={steps}
              heading={
                <>
                  Let's finish Configuring <br /> your account
                </>
              }
            />
          </div>
        </div>

        {/* Scrollable right side */}
        <div className="col-span-12 md:col-span-6 md:max-h-[calc(100vh-180px)] md:overflow-y-auto scrollbar-hide">
          <div className="px-4 md:pr-4">
            <div className="mt-4 md:mt-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationLayout;
