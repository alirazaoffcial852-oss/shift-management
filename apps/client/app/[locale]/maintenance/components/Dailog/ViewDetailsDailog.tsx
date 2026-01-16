"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface Completion {
  id: number;
  created_at: string;
}

interface ActionData {
  id: number;
  locomotive_id: number;
  status: string;
  action_name: string;
  cycle_indicator_days: number;
  yellow_threshold_days: number;
  red_threshold_days: number;
  current_state: string;
  created_at: string;
  updated_at: string;
  reason_id: number;
  completions: Completion[];
}

interface ActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: "add" | "edit";
  id?: string;
  actionsForSelectedLocomotive: ActionData[];
}

const ViewDetailsDialog: React.FC<ActionDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  type,
  id,
  actionsForSelectedLocomotive,
}) => {
  const taction = useTranslations("pages.maintenance");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] px-6 sm:px-[50px] md:px-[100px] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 py-4">
          <DialogTitle className="w-full mx-auto text-center text-[28px] sm:text-[36px] mb-4 sm:mb-[76px] mt-[16px]">
            {taction("locomotiveActionDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 white">
              <tr>
                {[
                  taction("id"),
                  taction("actionName"),
                  taction("status"),
                  taction("currentState"),
                  taction("cycleDays"),
                  taction("yellow"),
                  taction("red"),
                  taction("createdAt"),
                  taction("updatedAt"),
                  taction("reasonId"),
                  taction("completions"),
                ].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-6 py-3 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {actionsForSelectedLocomotive.map((action) => (
                <tr
                  key={action.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {action.id}
                  </td>
                  <td className="px-6 py-4">{action.action_name}</td>
                  <td className="px-6 py-4">{action.status}</td>
                  <td className="px-6 py-4">{action.current_state}</td>
                  <td className="px-6 py-4">{action.cycle_indicator_days}</td>
                  <td className="px-6 py-4">{action.yellow_threshold_days}</td>
                  <td className="px-6 py-4">{action.red_threshold_days}</td>
                  <td className="px-6 py-4">
                    {new Date(action.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(action.updated_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{action.reason_id}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {action.completions.length > 0 ? (
                        action.completions.map((comp) => (
                          <span
                            key={comp.id}
                            className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded"
                          >
                            #{comp.id} —{" "}
                            {new Date(comp.created_at).toLocaleString()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          {taction("noCompletions")}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsDialog;
