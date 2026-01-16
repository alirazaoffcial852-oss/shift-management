//@ts-nocheck
import ClientService from "@/services/client";
import { Edit2Icon, Trash2, BanIcon, UnlockIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Client } from "@workspace/ui/types/client";

export const COLUMNS = [
  { header: "Sr#", accessor: "__index__", className: "w-[100px]" },
  { header: "Client's Name", accessor: "name", className: "capitalize" },
  { header: "Email", accessor: "email" },
];

export const ACTIONS = [
  {
    label: "Edit",
    element: (client: Client) => (
      <Link href={`/clients/${client.id}/edit`} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors">
        <span className="flex items-center gap-2">
          <Edit2Icon className="w-4 h-4 text-gray-800" />
          <span className="text-sm text-gray-800">Edit</span>
        </span>
      </Link>
    ),
  },
  {
    label: "Delete",
    element: (client: Client, { onDelete }: { onDelete: (id: number) => void }) => (
      <ActionButton
        item={{ ...client, id: client.id ?? 0 }}
        customConfig={{
          show: true,
          title: "Delete Client",
          description: `Are you sure you want to delete the client <b>(${client.name})</b>? This will remove all of its data. This action cannot be undone.`,
          confirmText: "Delete",
          buttonText: "Delete",
          variant: "destructive",
          icon: Trash2,
          style: "hover:bg-red-50 text-red-600",
        }}
        services={{
          deleteClient: async (id: number) => {
            try {
              let responce = await ClientService.deleteClient(id.toString());
              onDelete(id);
              toast(responce?.message);
            } catch (error) {
              toast.error((error as any)?.data?.message || "An error occurred");
              throw error;
            }
          },
        }}
      />
    ),
  },
  {
    label: "Ban",
    element: (
      client: Client,
      {
        onStatusUpdate,
      }: {
        onStatusUpdate: (id: number, status: "CAN_LOGIN" | "CAN_NOT_LOGIN") => void;
      }
    ) => (
      <ActionButton
        item={{ ...client, id: client.id ?? 0 }}
        customConfig={{
          show: client.status === "CAN_LOGIN",
          title: "Ban Client",
          description: `Are you sure you want to Ban the client <b>(${client.name})</b>?`,
          confirmText: "Ban",
          buttonText: "Ban",
          variant: "destructive",
          icon: BanIcon,
          style: "hover:bg-red-50 text-red-600",
        }}
        services={{
          blockClient: async (id: number) => {
            try {
              let responce = await ClientService.blockClient(id.toString());
              onStatusUpdate(id, "CAN_NOT_LOGIN");
              toast(responce?.message);
            } catch (error) {
              toast.error((error as any)?.data?.message || "An error occurred");
              throw error;
            }
          },
        }}
      />
    ),
  },
  {
    label: "Un Ban",
    element: (
      client: Client,
      {
        onStatusUpdate,
      }: {
        onStatusUpdate: (id: number, status: "CAN_LOGIN" | "CAN_NOT_LOGIN") => void;
      }
    ) => (
      <ActionButton
        item={{ ...client, id: client.id ?? 0 }}
        customConfig={{
          show: client.status !== "CAN_LOGIN",
          title: "Un Ban Client",
          description: `Are you sure you want to Un Ban the client <b>(${client.name})</b>?`,
          confirmText: "Un Ban",
          buttonText: "Un Ban",
          variant: "destructive",
          icon: UnlockIcon,
          style: "hover:bg-red-50 text-blue-600",
        }}
        services={{
          unBlockClient: async (id: number) => {
            try {
              let responce = await ClientService.unBlockClient(id.toString());
              onStatusUpdate(id, "CAN_LOGIN");
              toast(responce?.message);
            } catch (error) {
              toast.error((error as any)?.data?.message || "An error occurred");
              throw error;
            }
          },
        }}
      />
    ),
  },
  {
    label: "suspend account ",
    element: (
      client: Client,
      {
        onStatusUpdate,
      }: {
        onStatusUpdate: (id: number, status: "CAN_LOGIN" | "CAN_NOT_LOGIN" | "SUSPEND_DUE_TO_PAYMENT") => void;
      }
    ) => (
      <ActionButton
        item={{ ...client, id: client.id ?? 0 }}
        customConfig={{
          show: client.status === "CAN_LOGIN",
          title: "suspend account",
          description: `Are you sure you want to suspend account of  the client <b>(${client.name})</b>?`,
          confirmText: "suspend account ",
          buttonText: "suspend account ",
          variant: "destructive",
          icon: UnlockIcon,
          style: "hover:bg-red-50 text-blue-600",
        }}
        services={{
          suspendClient: async (id: number) => {
            try {
              let responce = await ClientService.suspendClient(id.toString());
              onStatusUpdate(id, "SUSPEND_DUE_TO_PAYMENT");
              toast(responce?.message);
            } catch (error) {
              toast.error((error as any)?.data?.message || "An error occurred");
              throw error;
            }
          },
        }}
      />
    ),
  },
];
