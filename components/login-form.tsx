"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn, getUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GoogleIcon } from "./icons/google";
import Logo from "./logo";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getUrl()}/auth/oauth?next=/home`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md bg-gradient-to-br from-background/50 to-blue-50/20 backdrop-blur-sm border-border/50 shadow-lg rounded-2xl">
        <CardHeader className="space-y-4 text-center p-8">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Welcome to Audiform
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSocialLogin}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-sm text-destructive-500">{error}</p>}
              <Button
                type="submit"
                variant={"outline"}
                size="lg"
                className="w-full h-12 rounded-xl text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <GoogleIcon className="w-5 h-5 mr-2" />
                )}
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        <p>
          By continuing, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="underline hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
