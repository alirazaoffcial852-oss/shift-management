"use client";
import { Company } from "@/types/configuration";
import { CompanyCard } from "./CompanyCard";

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyList({ companies, onEdit, onDelete }: CompanyListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} onEdit={() => onEdit(company)} onDelete={() => onDelete(company)} />
        ))}
      </div>
    </div>
  );
}
