"use client";
import { Company } from "@/types/configuration";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Phone,
  MapPin,
  Train,
  Mail,
  Trash,
} from "lucide-react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { IMAGE_URL } from "@/constants/env.constants";
import { usePermission } from "@/hooks/usePermission";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const tActions = useTranslations("actions");
  const t = useTranslations("components.sidebar");
  const { hasPermission } = usePermission();

  const handleEdit = useCallback(() => {
    onEdit(company);
  }, [company, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(company);
  }, [company, onDelete]);
  console.log(company, "company in company card");
  return (
    <Card className="w-full bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-1 relative">
      <div className="absolute top-0 right-0 p-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={5}
            className="w-40"
          >
            {hasPermission("company.update") && (
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                {tActions("edit")}
              </DropdownMenuItem>
            )}
            {hasPermission("company.delete") && (
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-500 cursor-pointer"
              >
                <Trash className="mr-2 h-4 w-4" />
                {tActions("delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-4 pt-0">
        <div className="flex gap-6 items-start">
          <div className="w-20 mt-2">
            {company.configuration.logo && (
              <img
                src={IMAGE_URL + company.configuration.logo}
                alt={company.name}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            )}
            {company.configuration.has_locomotive && (
              <div className="flex items-center gap-1 text-blue-700 p-2 bg-blue-50 rounded-md mt-4 justify-center">
                <span className="text-[10px]">{t("locomotive")}</span>
                <Train className="h-4 w-4 mr-0 mt-1 flex-shrink-0" />
              </div>
            )}
          </div>
          <div>
            {" "}
            <div className="space-y-3 mt-2">
              {company.name && (
                <div className="flex items-start text-gray-600">
                  <p className="text-md font-semibold capitalize ">
                    {company.name}
                  </p>
                </div>
              )}
              {company.configuration.address && (
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm">{company.configuration.address}</p>
                </div>
              )}

              {company.configuration.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">{company.configuration.phone}</p>
                </div>
              )}

              {company?.configuration.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">{company?.configuration.email}</p>
                </div>
              )}
            </div>
            {company.roles && company.roles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">{t("Roles")}</p>
                <div className="flex flex-wrap gap-1">
                  {company.roles.map((role, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
