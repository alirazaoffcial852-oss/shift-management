import ResetPasswordForm from "@/components/Forms/ResetPassword/ResetPasswordForm";
import AuthLayout from "@/components/Layouts/Auth";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shift Management - Reset Password",
  description: "Shift Management System SaaS Product",
};

const ResetPassword: React.FC = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
