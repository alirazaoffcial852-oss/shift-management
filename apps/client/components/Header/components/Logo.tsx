import Link from "next/link";
import Image from "next/image";
import { useCompany } from "@/providers/appProvider";
import logo from "@/public/images/logo.png";
import logomark from "@/public/images/Logomark.png";

interface LogoProps {
  className?: string;
  shouldShowIcon?: boolean;
}

export const Logo = ({
  className = "h-6",
  shouldShowIcon = true,
}: LogoProps) => {
  const { company } = useCompany();

  const companyLogo =
    company && company.configuration.logo
      ? logo
      : shouldShowIcon
        ? logo
        : logomark;

  return (
    <div className="flex-shrink-0">
      <Link href="/" className="flex items-center">
        <Image
          src={
            companyLogo
              ? companyLogo
              : shouldShowIcon
                ? "/images/logo.png"
                : "/images/Logomark.png"
          }
          width={720}
          height={30}
          alt="Shift Management"
          className={`w-auto ${className} max-h-10`}
          priority
        />
      </Link>
    </div>
  );
};
