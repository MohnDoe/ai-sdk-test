import { useConversationStore } from "@/lib/ai/conversation/store";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Trash } from "lucide-react";

export function ChatHeader({ title }: { title?: string }) {
  const { deleteConversation, activeConversationId } = useConversationStore();

  const handleDeleteActiveConversation = () => {
    deleteConversation(activeConversationId!);
  }

  return (
    <header className="flex shrink items-center gap-4 p-2 border-b">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <h1 className="text-base font-medium">
        {title ?? "Nouvelle conversation"}
      </h1>
      <Button variant="ghost" size="icon" className="ml-auto" onClick={handleDeleteActiveConversation}>
        <Trash />
      </Button>
    </header>
  );
}
