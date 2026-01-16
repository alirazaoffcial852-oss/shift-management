"use client";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "h-6" }: LogoProps) => (
  <div className=" flex-shrink-0">
    <Link href="/" className="flex items-center">
      <Image
        src="/images/logo.png"
        width={720}
        height={30}
        alt="Shift Management"
        className={`w-auto ${className}`}
      />
    </Link>
  </div>
);
