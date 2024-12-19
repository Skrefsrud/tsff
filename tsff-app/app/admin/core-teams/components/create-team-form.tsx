"use client";

import { useState } from "react";
import { createTeam } from "../actions"; // Import your server action
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateTeamForm() {
  const [socialLinks, setSocialLinks] = useState<
    { platform: string; url: string }[]
  >([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([
    "Twitter",
    "Facebook",
    "LinkedIn",
    "Instagram",
    "YouTube",
  ]); // Initial list of platforms
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | Record<string, string> | null>(
    null
  );
  const [isPending, setIsPending] = useState(false);

  const handleAddSocialLink = (platform: string, url: string) => {
    setSocialLinks((prev) => [...prev, { platform, url }]);
    setAvailablePlatforms((prev) => prev.filter((p) => p !== platform)); // Remove selected platform
  };

  const handleRemoveSocialLink = (platform: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.platform !== platform));
    setAvailablePlatforms((prev) => [...prev, platform]); // Add platform back to dropdown
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const socialLinksObject = socialLinks.reduce(
      (acc, { platform, url }) => ({
        ...acc,
        [platform]: url,
      }),
      {}
    );

    formData.set("social_links", JSON.stringify(socialLinksObject));

    try {
      const result = await createTeam(formData);
      if (result.error) {
        if (typeof result.error === "string") {
          setError(result.error); // Handle string errors directly
        } else {
          // Convert validation errors to a Record<string, string> format
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
        <Button variant="outline">Create Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new team. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" type="url" />
          </div>
          <div className="space-y-4">
            <Label>Social Links</Label>
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Input
                  value={link.url}
                  readOnly
                  placeholder={`${link.platform} URL`}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveSocialLink(link.platform)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {availablePlatforms.length > 0 && (
              <div className="flex items-center space-x-4">
                <Select onValueChange={(value) => setSelectedPlatform(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter URL"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleAddSocialLink(selectedPlatform, newLinkUrl);
                    setNewLinkUrl("");
                    setSelectedPlatform("");
                  }}
                  disabled={!selectedPlatform || !newLinkUrl}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Team"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
