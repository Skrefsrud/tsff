import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, X } from "lucide-react";

interface TeamInfo {
  name: string;
  leader: string;
  wins: number;
  losses: number;
  logo: string;
}

export function TeamCard({ name, leader, wins, losses, logo }: TeamInfo) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={logo} alt={`${name} logo`} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">Led by {leader}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <Trophy className="mr-2 h-4 w-4 text-green-500" />
            <span className="font-semibold">{wins} Wins</span>
          </div>
          <div className="flex items-center">
            <X className="mr-2 h-4 w-4 text-red-500" />
            <span className="font-semibold">{losses} Losses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
