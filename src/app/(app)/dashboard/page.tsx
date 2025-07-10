"use client"

import { EventCard } from "@/components/event-card";
import { useAuth } from "@/hooks/use-auth";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_EVENTS: Event[] = [
  {
    id: "event-1",
    title: "AI in Healthcare Hackathon",
    description: "Join us for a weekend of innovation, creating AI solutions to revolutionize healthcare.",
    date: "2024-10-26T09:00:00Z",
    eventURL: "#",
    tags: ["Machine Learning", "Healthcare"],
    image: "https://images.unsplash.com/photo-1588200908342-23b585c03e26?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    id: "event-2",
    title: "Full-Stack Web Dev Workshop",
    description: "A comprehensive workshop covering React, Node.js, and everything in between.",
    date: "2024-11-05T10:00:00Z",
    eventURL: "#",
    tags: ["Web Development", "JavaScript"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    id: "event-3",
    title: "Data Science Conclave",
    description: "Hear from industry experts about the latest trends in data science and big data.",
    date: "2024-11-12T11:00:00Z",
    eventURL: "#",
    tags: ["Data Science", "Python"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    id: "event-4",
    title: "Intro to Quantum Computing",
    description: "A beginner-friendly session on the principles of quantum computing.",
    date: "2024-11-18T14:00:00Z",
    eventURL: "#",
    tags: ["Physics", "Computer Science"],
    image: "https://images.unsplash.com/photo-1635070045099-2f2c39513333?q=80&w=600&h=400&auto=format&fit=crop",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userInterestSet = new Set(user.interestTags);
  const recommendedEvents = MOCK_EVENTS.filter(event =>
    event.tags.some(tag => userInterestSet.has(tag))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Welcome back, {user.displayName?.split(" ")[0]}!
        </h2>
        <p className="text-muted-foreground">Here are some events matching your interests.</p>
      </div>

      {recommendedEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendedEvents.map((event) => (
            <EventCard key={event.id} event={event} isBookmarked={user.bookmarkedEvents.includes(event.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-center p-12 min-h-[400px]">
          <h3 className="text-xl font-semibold tracking-tight">No events match your interests yet</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Try updating your interests to discover new events.
          </p>
          <Button asChild>
            <Link href="/profile">Update Interests</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
