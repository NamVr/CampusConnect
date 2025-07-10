"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateInterests } from "@/actions/user";

export function EditInterestsDialog({ userInterests, onInterestsUpdate }: { userInterests: string[], onInterestsUpdate: (interests: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState(userInterests);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setInterests(userInterests);
  }, [userInterests, open]);

  const handleAddInterest = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !interests.map(i => i.toLowerCase()).includes(trimmedValue.toLowerCase())) {
      setInterests([...interests, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateInterests(interests);
    setIsSaving(false);

    if (result.success) {
      onInterestsUpdate(interests);
      toast({
        title: "Success!",
        description: "Your interests have been updated.",
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not save your interests. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Interests</DialogTitle>
          <DialogDescription>
            Add or remove tags to get better recommendations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              placeholder="e.g., Machine Learning"
            />
            <Button type="button" onClick={handleAddInterest} variant="secondary">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
            {interests.map((interest) => (
              <Badge key={interest} variant="default" className="flex items-center gap-1">
                {interest}
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="rounded-full hover:bg-primary-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
