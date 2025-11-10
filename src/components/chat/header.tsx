import { Separator } from "@radix-ui/react-separator";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function ChatHeader({ title }: { title?: string }) {
  return (
    <header className="flex shrink-0 items-center gap-4 p-2 border-b">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <h1 className="text-base font-medium">
        {title ?? "Nouvelle conversation"}
      </h1>
      <Button variant="ghost" size="icon" className="ml-auto">
        <Trash />
      </Button>
    </header>
  );
}
