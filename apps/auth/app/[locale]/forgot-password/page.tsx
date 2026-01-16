import React from "react";
import AuthLayout from "@/components/Layouts/Auth";
import { ForgotPasswordForm } from "@/components/Forms/ForgotPassword/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shift Management - Forgot Password",
  description: "Shift Management System SaaS Product",
};

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
