"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { EditInterestsDialog } from "@/components/edit-interests-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// This is now a client-side "fetcher" function.
// In a real app, this would be a server action or an API call.
async function getRecentQuestions(userId: string): Promise<Question[]> {
  console.log(`Fetching questions for user ${userId}`);
  // In a real app, you would fetch from Firestore here.
  // For now, let's simulate a fetch and use localStorage to persist questions.
  await new Promise(resolve => setTimeout(resolve, 500)); 
  const history = localStorage.getItem('questionHistory');
  if (history) {
    const allQuestions: Question[] = JSON.parse(history);
    return allQuestions.filter(q => q.userId === userId).slice(0, 5);
  }
  return [];
}


export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setQuestionsLoading(true);
      getRecentQuestions(user.uid)
        .then(setQuestions)
        .finally(() => setQuestionsLoading(false));
    }
  }, [user]);

  const onInterestsUpdate = (newInterests: string[]) => {
    if (user) {
        updateUser({ ...user, interestTags: newInterests });
    }
  };


  if (authLoading || !user) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.photoURL ?? ""} />
              <AvatarFallback className="text-3xl">{user.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline">{user.displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline text-lg">Your Interests</CardTitle>
              <EditInterestsDialog 
                userInterests={user.interestTags}
                onInterestsUpdate={onInterestsUpdate}
              />
            </div>
            <CardDescription>These tags help us recommend events and collaborators.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.interestTags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Recent Questions</CardTitle>
            <CardDescription>Your last few conversations with the AI.</CardDescription>
          </CardHeader>
          <CardContent>
            {questionsLoading ? (
                 <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : questions.length > 0 ? (
                <ul className="space-y-4">
                {questions.map((q) => (
                    <li key={q.id} className="flex gap-4">
                    <div className="bg-primary/10 rounded-full size-8 flex items-center justify-center shrink-0">
                        <MessageSquare className="size-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">{q.question}</p>
                        <p className="text-sm text-muted-foreground">
                        Asked on {new Date(q.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>You haven't asked any questions yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
