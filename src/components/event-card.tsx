"use client";

import type { Event } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Bookmark, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function handleBookmark(eventId: string, isBookmarked: boolean) {
  // This would be a server action call
  console.log(`Toggling bookmark for event ${eventId}`);
  return { success: !isBookmarked };
}


export function EventCard({ event, isBookmarked: initialIsBookmarked }: { event: Event, isBookmarked: boolean }) {
  const { toast } = useToast();

  const handleBookmarkClick = async () => {
    // In a real app, you'd use a server action here and handle loading/error states
    // For now, we just show a toast.
    const success = await handleBookmark(event.id, initialIsBookmarked);
    if (success) {
      toast({
        title: "Success!",
        description: `Event ${initialIsBookmarked ? 'unbookmarked' : 'bookmarked'}.`,
      });
      // In a real app, you would revalidate the path or update the state.
    } else {
      toast({
        variant: 'destructive',
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };


  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="event conference students"
          />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="text-lg font-headline leading-tight">{event.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2 text-sm">
            <Calendar className="h-4 w-4" />
            {new Date(event.date).toLocaleDateString("en-US", {
              year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
        <div className="flex flex-wrap gap-2 pt-4">
          {event.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" asChild>
          <a href={event.eventURL} target="_blank" rel="noopener noreferrer">Details</a>
        </Button>
        <Button variant={initialIsBookmarked ? "default" : "secondary"} onClick={handleBookmarkClick}>
          <Bookmark className="mr-2 h-4 w-4" />
          {initialIsBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
      </CardFooter>
    </Card>
  );
}
