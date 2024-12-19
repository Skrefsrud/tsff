import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SimpleIcon } from "simple-icons";
import { IconType } from "react-icons";
import { createElement } from "react";
import {
  SiX,
  SiFacebook,
  SiLinkedin,
  SiInstagram,
  SiYoutube,
} from "react-icons/si";

type Team = {
  name: string;
  logo_url?: string;
  social_links: { [platform: string]: string };
};

// Mapping platforms to their respective SimpleIcons or ReactIcons
const socialIcons: Record<string, IconType> = {
  Twitter: SiX,
  Facebook: SiFacebook,
  LinkedIn: SiLinkedin,
  Instagram: SiInstagram,
  YouTube: SiYoutube,
};

export function TeamCard({ name, logo_url, social_links }: Team) {
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
      </CardHeader>
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
    </Card>
  );
}
