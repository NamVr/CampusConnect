import type { User } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg font-headline">{user.displayName}</h3>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {user.interestTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <Button className="w-full">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
