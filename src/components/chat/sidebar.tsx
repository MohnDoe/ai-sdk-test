"use client"

import { useConversationStore } from "@/app/lib/ai/conversation/store";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ChatSidebar() {
  const { conversations, activeConversationId } = useConversationStore()
  const router = useRouter();

  const handleNewConversation = () => {
    router.push("/conversations/new");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton onClick={handleNewConversation}>
          <Plus /> Nouvelle conversation
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            {conversations
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton asChild isActive={conversation.id === activeConversationId}>
                    <Link href={`/conversations/${conversation.id}`}>{conversation.title ?? "Nouvelle conversation"}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
