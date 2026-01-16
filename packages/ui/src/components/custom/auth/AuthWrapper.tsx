"use client";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  useEffect(() => {
    const handleTokenAuth = async () => {
      // Get token from URL if it exists
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          // Verify token with your backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            // Store token in localStorage
            localStorage.setItem("accessToken", token);

            // Remove token from URL for security
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
          } else {
            // Handle invalid token
            window.location.href = "/sign-in";
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          window.location.href = "/sign-in";
        }
      } else {
        // Check if we have a stored token
        const storedToken = localStorage.getItem("accessToken");
        if (!storedToken) {
          window.location.href = "/sign-in";
        }
      }
    };

    handleTokenAuth();
  }, []);

  return <>{children}</>;
};
