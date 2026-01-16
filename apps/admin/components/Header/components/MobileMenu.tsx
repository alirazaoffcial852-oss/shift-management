import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

export const MobileMenu = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0 absolute right-4"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
    </SheetTrigger>
    <SheetContent side="right">
      <div className="flex flex-col items-center justify-center h-full">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">John Doe</h2>
      </div>
    </SheetContent>
  </Sheet>
);
