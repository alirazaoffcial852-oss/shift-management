import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { LogOut } from "lucide-react";
import Avatar from "boring-avatars";
import { useAuth } from "@/providers/appProvider";

export const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          size={32}
          name={user?.name}
          variant="beam"
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 border-b">
          <div className="font-medium capitalize">{user && user.name}</div>
        </div>

        <DropdownMenuItem className="text-red-600" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
