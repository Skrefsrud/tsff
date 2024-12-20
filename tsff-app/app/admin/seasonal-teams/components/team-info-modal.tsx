"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeamLeaderSelect from "./team-leader-select";

interface User {
  id: string;
  name: string;
}

interface SeasonDivision {
  id: string;
  name: string;
}

interface TeamInfoModalProps {
  team: {
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamInfoModal({
  team,
  isOpen,
  onClose,
}: TeamInfoModalProps) {
  const [teamLeader, setTeamLeader] = useState<string>("");
  const [seasonDivision, setSeasonDivision] = useState<string>("");
  const [seasonDivisions, setSeasonDivisions] = useState<SeasonDivision[]>([]);

  useEffect(() => {
    // Fetch season divisions from the database
    const fetchSeasonDivisions = async () => {
      // Replace this with your actual API call
      const response = await fetch("/api/season-divisions");
      const data = await response.json();
      setSeasonDivisions(data);
    };

    fetchSeasonDivisions();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-leader" className="text-right">
              Team Leader
            </Label>
            <div className="col-span-3">
              <TeamLeaderSelect
                value={teamLeader}
                onChange={(value) => setTeamLeader(value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="season-division" className="text-right">
              Season Division
            </Label>
            <Select
              value={seasonDivision}
              onValueChange={(value) => setSeasonDivision(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a season division" />
              </SelectTrigger>
              <SelectContent>
                {seasonDivisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
