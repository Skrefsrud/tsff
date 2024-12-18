"use client";

import { Button } from "@/components/ui/button";

interface RevalidateButtonProps {
  userId: string | any;
}

export default function RevalidateButton({ userId }: RevalidateButtonProps) {
  async function handleRevalidate() {
    console.log("Revalidating user cache for userId:", userId);
    try {
      const res = await fetch(`/api/user/${userId}/revalidate`, {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Revalidation failed:", error);
        return;
      }

      console.log("Revalidation successful");
    } catch (error) {
      console.error("Error calling revalidation endpoint:", error);
    }
  }

  return <Button onClick={handleRevalidate}>Revalidate!</Button>;
}
