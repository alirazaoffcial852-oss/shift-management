"use client";

import { useState } from "react";

interface PaginationOptions {
  initialPage?: number;
  totalPages?: number;
}

export const usePagination = ({
  initialPage = 1,
  totalPages = 10,
}: PaginationOptions) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return {
    currentPage,
    totalPages,
    setCurrentPage,
  };
};
