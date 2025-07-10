"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { askGemini } from '@/ai/flows/ask-gemini-flow';
import { didYouMeanSuggestions } from '@/ai/flows/did-you-mean';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, User, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { addQuestionToHistory } from '@/actions/user';
import type { Question } from '@/types';


type Suggestion = string;

export default function AskPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [askedQuery, setAskedQuery] = useState('');

  const handleAsk = async () => {
    if (!query.trim() || !user) return;
    setLoading(true);
    setAnswer('');
    setSuggestions([]);
    setAskedQuery(query);

    try {
      const [askResult, suggestionsResult] = await Promise.all([
        askGemini({ userQuery: query }),
        didYouMeanSuggestions({ userQuery: query }),
      ]);
      
      setAnswer(askResult.answer);
      setSuggestions(suggestionsResult.suggestions);

      // Save question to our simulated DB (localStorage)
      const newQuestion: Question = {
        id: new Date().toISOString(),
        userId: user.uid,
        question: query,
        answer: askResult.answer,
        createdAt: new Date().toISOString(),
      };
      const history = JSON.parse(localStorage.getItem('questionHistory') || '[]');
      history.unshift(newQuestion);
      localStorage.setItem('questionHistory', JSON.stringify(history));
      
      // Notify server to revalidate paths
      await addQuestionToHistory(user.uid, query, askResult.answer);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    // Optional: automatically submit the new query
    // setQuery(suggestion);
    // handleAsk();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Ask Gemini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your technical question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px] text-base"
              disabled={loading}
            />
            <Button onClick={handleAsk} disabled={loading || !query.trim()} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Answer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {askedQuery && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar>
              <AvatarImage src={user?.photoURL ?? undefined} />
              <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-lg">{askedQuery}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !answer && <div className="flex items-center space-x-2 text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" /> <span>Generating answer...</span></div>}
            {answer && (
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {answer}
                </ReactMarkdown>
              </div>
            )}

            {suggestions.length > 0 && (
              <Alert className="mt-6 bg-primary/5 border-primary/20">
                <Lightbulb className="h-4 w-4 text-primary/80" />
                <AlertTitle className="font-headline text-primary">You might also want to ask:</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(s)} className="text-left">
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors">
                          {s}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
