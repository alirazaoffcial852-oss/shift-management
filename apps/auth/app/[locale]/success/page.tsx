"use client";
import { SUCCESS_CONFIGS } from "@/constants/successConfigs";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const SuccessPage = () => {
  const router = useRouter();
  const params = useParams();

  const { locale } = params;

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const t = useTranslations("pages.auth");
  const tCommon = useTranslations("common.buttons");

  const config = SUCCESS_CONFIGS[type as string];
  if (!config) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-10 text-center px-4">
        <Image
          src="/images/success.svg"
          alt="Success"
          width={300}
          height={300}
          priority
        />
        <div className="flex flex-col gap-5">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-[#3E8258]">
              {config.title}
            </h1>
            <p className="text-lg text-gray-600">
              {type === "forgotPassword"
                ? t("forgotPasswordSuccess")
                : t("resetPasswordSuccess")}
            </p>
          </div>
          <SMSButton
            text={tCommon("backToSignIn")}
            fullWidth
            className="rounded-full"
            onClick={() => router.push(`/${locale}/sign-in`)}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
