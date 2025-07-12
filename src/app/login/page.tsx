"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    const provider = new GoogleAuthProvider()
    // Explicitly setting the authDomain can sometimes resolve stubborn auth issues.
    provider.setCustomParameters({
      auth_domain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    });
    try {
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
      console.error("Error during Google sign-in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-start text-left">
           <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline">CampusConnect AI</h1>
           </div>
          <h2 className="text-4xl font-bold tracking-tight mb-4 font-headline text-primary">
            Welcome to the future of campus life.
          </h2>
          <p className="text-muted-foreground text-lg">
            Connect with peers, discover events, and unlock your potential with the power of AI.
          </p>
           <Image
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&h=400&auto=format&fit=crop"
              width="500"
              height="500"
              alt="Campus"
              data-ai-hint="university campus"
              className="mt-8 rounded-xl object-cover"
            />
        </div>

        <Card className="w-full max-w-sm mx-auto">
          <CardHeader className="text-center">
             <div className="flex items-center justify-center gap-2 mb-4 md:hidden">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold font-headline">CampusConnect AI</h1>
             </div>
            <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
            <CardDescription>
              Use your Google account to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 text-center text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 64.5C308.6 106.5 280.4 96 248 96c-88.8 0-160 72-160 160s71.2 160 160 160c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.8z"></path></svg>
              )}
              Sign in with Google
            </Button>
          </CardContent>
           <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              One-click access. No extra password needed.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
