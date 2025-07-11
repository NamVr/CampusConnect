"use server";

import { revalidatePath } from "next/cache";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function updateInterests(interests: string[]) {
  // The actual update now happens on the client via the useAuth hook
  // This action just serves to revalidate paths
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/collaborators");

  return { success: true };
}

export async function addQuestionToHistory(userId: string, question: string, answer: string) {
    if (!userId || !question || !answer) {
        return { success: false, error: "Missing required fields." };
    }
    try {
        await addDoc(collection(db, "questions"), {
            userId,
            question,
            answer,
            createdAt: serverTimestamp(),
        });
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Error adding question to history:", error);
        return { success: false, error: "Failed to save question." };
    }
}
