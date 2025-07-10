"use client"

import { UserCard } from "@/components/user-card";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_USERS: User[] = [
  {
    uid: "user-2",
    displayName: "Jane Smith",
    email: "jane.smith@example.com",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop",
    interestTags: ["Web Development", "UI/UX Design", "JavaScript"],
    bookmarkedEvents: [],
  },
  {
    uid: "user-3",
    displayName: "Sam Wilson",
    email: "sam.wilson@example.com",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop",
    interestTags: ["Data Science", "Python", "Machine Learning"],
    bookmarkedEvents: [],
  },
  {
    uid: "user-4",
    displayName: "Maria Garcia",
    email: "maria.garcia@example.com",
    photoURL: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop",
    interestTags: ["Mobile Development", "iOS", "Swift"],
    bookmarkedEvents: [],
  },
  {
    uid: "user-5",
    displayName: "Kenji Tanaka",
    email: "kenji.tanaka@example.com",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop",
    interestTags: ["Game Development", "C++", "Unity"],
    bookmarkedEvents: [],
  },
  {
    uid: "user-6",
    displayName: "Fatima Al-Fassi",
    email: "fatima.alfassi@example.com",
    photoURL: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100&h=100&auto=format&fit=crop",
    interestTags: ["Cybersecurity", "Networking", "Python"],
    bookmarkedEvents: [],
  },
];

export default function CollaboratorsPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const userInterestSet = new Set(user.interestTags);
  const potentialCollaborators = MOCK_USERS.filter(
    (potentialUser) =>
      potentialUser.uid !== user.uid &&
      potentialUser.interestTags.some(tag => userInterestSet.has(tag))
  );

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Find Collaborators
        </h2>
        <p className="text-muted-foreground">Connect with peers who share your interests.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {potentialCollaborators.map((collaborator) => (
          <UserCard key={collaborator.uid} user={collaborator} />
        ))}
      </div>
    </div>
  );
}
