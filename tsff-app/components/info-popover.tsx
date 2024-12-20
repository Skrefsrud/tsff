"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface InfoPopoverProps {
  headerText: string;
  infoText: string;
}

export function InfoPopover({ headerText, infoText }: InfoPopoverProps) {
  return (
    <div className="flex items-center space-x-2">
      <h2 className="text-lg font-semibold">{headerText}</h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Show more information</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <p className="text-sm text-muted-foreground">{infoText}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
