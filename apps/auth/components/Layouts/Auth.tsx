import type { Metadata } from "next";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import LanguageSelector from "../language-selector";

export const metadata: Metadata = {
  title: "Shift Management - Signin",
  description: "Shift Management",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-svh lg:grid-cols-12">
      <div className="flex flex-col py-9 sm:py-14 px-6 sm:px-32 gap-9 sm:gap-10 md:gap-36 col-span-5">
        <div className="flex justify-between items-center">
          <span className="flex">
            <Image
              src={"/images/logo.png"}
              width={300}
              height={64}
              alt="Shift Management"
            />
          </span>
          <LanguageSelector />
        </div>
        <div className="flex flex-col justify-center">
          <div>{children}</div>
        </div>
      </div>
      <div className="relative hidden lg:flex rounded-[48px] items-center justify-center col-span-7">
        <Image
          src="/images/login.png"
          alt="Image"
          height={2000}
          width={2000}
          className="absolute inset-0 m-auto h-[96%] w-[96%] object-cover dark:brightness-[0.2] dark:grayscale rounded-[48px]"
        />
      </div>
    </div>
  );
}
