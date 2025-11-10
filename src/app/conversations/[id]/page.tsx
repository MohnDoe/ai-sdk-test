"use client";

import { useConversationStore } from "@/app/lib/ai/conversation/store";
import { Chat } from "@/components/chat/chat";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

export default function ConversationPage(props: PageProps<`/conversations/[id]`>) {
  const { id } = use(props.params);
  const router = useRouter();
  const { conversations, setActiveConversationId, isReady } = useConversationStore();
  const [isLoading, setIsLoading] = useState(true);


  const activeConversation = useMemo(() => conversations.find((c) => c.id === id), [id, conversations]);

  useEffect(() => {
    if (isReady) {
      if (activeConversation) {
        setActiveConversationId(activeConversation.id);
        setIsLoading(false);
      }
      else {
        router.push("/conversations/new")
      }
    }
  }, [activeConversation, router, setActiveConversationId, isReady])

  return isLoading ? <>Chargement</> : <Chat conversation={activeConversation!} />;
}
