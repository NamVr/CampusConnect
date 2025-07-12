"use server";

import { revalidatePath } from "next/cache";

export async function updateInterests(interests: string[]) {
  // In a real app, you would update the user's interests in Firestore.
  console.log("Updating interests to:", interests);

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/collaborators");


  return { success: true };
}

export async function addQuestionToHistory(userId: string, question: string, answer: string) {
    // In a real app, you would save the question to Firestore.
    // We are simulating this by logging and using a delay.
    // The actual storage to localStorage is now handled on the client-side
    // where this function is called, to avoid server/client context issues.
    console.log(`Adding question for user ${userId}:`, { question, answer });
    await new Promise(resolve => setTimeout(resolve, 500));
    revalidatePath("/profile");
    return { success: true };
}
