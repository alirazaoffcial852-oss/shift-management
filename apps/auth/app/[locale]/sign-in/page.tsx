import { SignInForm } from "@/components/Forms/SignIn/SignInForm";
import AuthLayout from "@/components/Layouts/Auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shift Management - SignIn",
  description: "Shift Management System SaaS Product",
};

export default function Signin() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
