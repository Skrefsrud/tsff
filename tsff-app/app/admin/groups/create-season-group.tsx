"use client";

import { useState } from "react";
// Replace with your actual server action or API call
import { createSeasonGroup } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateSeasonGroupFormProps {
  seasonId: string; // We already know which Season this group belongs to
}

export function CreateSeasonGroupForm({ seasonId }: CreateSeasonGroupFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createSeasonGroup(formData);
      if (result.error) {
        // If result.error is an object, you could handle it differently
        setError(typeof result.error === "string" ? result.error : "An error occurred.");
      } else {
        setError(null);
        setOpen(false); // Close dialog on success
        // Optionally refresh data or notify the user
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Group</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Enter a name for the new group.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* This hidden input ensures the group is linked to the correct season */}
          <input type="hidden" name="season_id" value={seasonId} />

          <div className="space-y-2">
            <Label htmlFor="group_name">Group Name</Label>
            <Input
              id="group_name"
              name="group_name"
              placeholder="e.g., Group A"
              required
            />
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
