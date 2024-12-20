"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Team } from "@/types/types";

import { IconType } from "react-icons";
import { createElement } from "react";
import {
  SiX,
  SiFacebook,
  SiLinkedin,
  SiInstagram,
  SiYoutube,
} from "react-icons/si";

import { EditTeamForm } from "./edit-team-fom";

import { useState } from "react";

// Mapping platforms to their respective SimpleIcons or ReactIcons
const socialIcons: Record<string, IconType> = {
  Twitter: SiX,
  Facebook: SiFacebook,
  LinkedIn: SiLinkedin,
  Instagram: SiInstagram,
  YouTube: SiYoutube,
};

export function TeamCard({ id, name, logo_url, social_links }: Team) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card className="w-64 h-42 flex flex-col justify-between items-start border rounded-lg shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          {logo_url ? (
            <AvatarImage src={logo_url} alt={`${name} logo`} />
          ) : (
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-4xl">{name}</CardTitle>
        </div>
        <Button onClick={() => setEditOpen(true)}>Edit</Button>
      </CardHeader>
      <Separator />
      <CardContent className="w-full text-left flex-grow">
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(social_links).map(([platform, url]) => {
            const IconComponent = socialIcons[platform] || null;
            return (
              <Button key={platform} variant="outline" size="icon" asChild>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on ${platform}`}
                >
                  {IconComponent
                    ? createElement(IconComponent, { className: "h-4 w-4" })
                    : platform}
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
      {editOpen && (
        <EditTeamForm
          initialData={{ id, name, logo_url, social_links }}
          onClose={() => setEditOpen(false)}
        />
      )}
    </Card>
  );
}
