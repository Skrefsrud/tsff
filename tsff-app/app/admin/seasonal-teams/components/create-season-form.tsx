"use client";

import { useState } from "react";
import { createSeason } from "../actions"; // Import your server action
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

export function CreateSeasonForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | Record<string, string> | null>(
    null
  );
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createSeason(formData);
      if (result.error) {
        if (typeof result.error === "string") {
          setError(result.error); // Handle string errors directly
        } else {
          const formattedError = Object.fromEntries(
            Object.entries(result.error).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(", ") : value,
            ])
          );
          setError(formattedError);
        }
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
        <Button variant="outline">Create New Season</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Season</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new season. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_label">Year Label</Label>
            <Input
              id="year_label"
              name="year_label"
              placeholder="e.g., 2023/2024"
              required
            />
          </div>
          {error && (
            <div className="text-red-500">
              {typeof error === "string"
                ? error
                : Object.entries(error).map(([field, msg]) => (
                    <p key={field}>{`${field}: ${msg}`}</p>
                  ))}
            </div>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Season"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
