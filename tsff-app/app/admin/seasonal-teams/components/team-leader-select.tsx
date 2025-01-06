"use client";

import { useState } from "react";
import useSWR from "swr";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface User {
  id: string;
  name: string;
}

interface TeamLeaderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  });

export default function TeamLeaderSelect({
  value,
  onChange,
}: TeamLeaderSelectProps) {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = useSWR("/api/users", fetcher);

  
  console.log("error: ",error)

  if (error) return <div>Failed to load users.</div>;
  if (isLoading) return <div>Loading...</div>;

  
  console.log("the data: " ,data)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.users.find((user: User) => user.id === value)?.name
            : "Select team leader..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search team leader..." />
          <CommandEmpty>No team leader found.</CommandEmpty>
          <CommandGroup>
            {data.users.map((user: User) => (
              <CommandItem
                key={user.id}
                onSelect={() => {
                  onChange(user.id === value ? "" : user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === user.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
