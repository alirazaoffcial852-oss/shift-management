"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectUsnShiftsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(
      "/shift-management/project-usn-shifts/usn-shifts/monthly"
    );
  }, [router]);

  return null;
}
