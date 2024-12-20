"use client";

import { useState } from "react";
import { updateTeam } from "../actions";
import { Team } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function EditTeamForm({
  initialData,
  onClose,
}: {
  initialData: Team;
  onClose: () => void;
}) {
  const [socialLinks, setSocialLinks] = useState(
    Object.entries(initialData.social_links || {}).map(([platform, url]) => ({
      platform,
      url,
    }))
  );
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>(
    ["Twitter", "Facebook", "LinkedIn", "Instagram", "YouTube"].filter(
      (platform) =>
        !Object.keys(initialData.social_links || {}).includes(platform)
    )
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");

  const [formData, setFormData] = useState<Team>(initialData);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSocialLink = (platform: string, url: string) => {
    setSocialLinks((prev) => [...prev, { platform, url }]);
    setAvailablePlatforms((prev) => prev.filter((p) => p !== platform));
  };

  const handleRemoveSocialLink = (platform: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.platform !== platform));
    setAvailablePlatforms((prev) => [...prev, platform]);
  };

  const normalizeUrl = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Normalize and append social links
      const socialLinksObject = socialLinks.reduce((acc, { platform, url }) => {
        acc[platform] = normalizeUrl(url);
        return acc;
      }, {} as Record<string, string>);

      formData.set("social_links", JSON.stringify(socialLinksObject));

      await updateTeam(formData);
      onClose(); // Close dialog on success
    } catch (err) {
      console.error("Failed to update team", err);
      setError("Failed to update team. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden input for ID */}
          <input type="hidden" name="id" value={initialData.id} />

          {/* Team Name */}
          <div>
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Logo URL */}
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              name="logo_url"
              value={formData.logo_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, logo_url: e.target.value }))
              }
            />
          </div>

          {/* Social Links */}
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
                <Select
                  onValueChange={(value) => setSelectedPlatform(value)}
                  value={selectedPlatform}
                >
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

          {/* Error and Submit */}
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
