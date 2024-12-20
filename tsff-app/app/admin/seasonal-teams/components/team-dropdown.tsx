"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import TeamInfoModal from "./team-info-modal";

interface Team {
  id: string;
  name: string;
}

export default function TeamDropdown({ teams }: { teams: Team[] }) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Select Team <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          {teams.map((team) => (
            <Button
              key={team.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleTeamClick(team)}
            >
              {team.name}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
      {selectedTeam && (
        <TeamInfoModal
          team={selectedTeam}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
