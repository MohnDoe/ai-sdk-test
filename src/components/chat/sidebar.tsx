"use client"

import { useConversationStore } from "@/app/lib/ai/conversation/store";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Ellipsis, Pen, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function ChatSidebar() {
  const { conversations, activeConversationId, deleteConversation } = useConversationStore()
  const router = useRouter();

  const handleNewConversation = () => {
    router.push("/conversations/new");
  }

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenuButton onClick={handleNewConversation}>
          <Plus /> Nouvelle conversation
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarMenu>
            {conversations
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton asChild isActive={conversation.id === activeConversationId}>
                    <Link href={`/conversations/${conversation.id}`}>{conversation.title ?? "Nouvelle conversation"}</Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover className="data-[state=open]:bg-accent rounded-sm">
                        <Ellipsis />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-24 rounded-lg"
                      side="right" align="start"
                    >
                      <DropdownMenuItem>
                        <Pen />
                        <span>Remame</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => deleteConversation(conversation.id)}>
                        <Trash />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
