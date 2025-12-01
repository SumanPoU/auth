"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Suspense } from "react";

export default function VerificationPage() {
  return (
    <Suspense fallback={<></>}>
      <EmailVerifiedPage />
    </Suspense>
  );
}

function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      toast.success("Email verified successfully! Redirecting to login...");
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      toast.error("Verification failed! Redirecting to verify email...");
      const timer = setTimeout(() => {
        router.push("/verify-email");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="p-8 border border-border">
          {success === "true" ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Email verified!
              </h1>
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified. Redirecting to
                login...
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Verification failed
              </h1>
              <p className="text-sm text-muted-foreground">
                The verification link is invalid or has expired. Redirecting...
              </p>
              <Button asChild className="w-full">
                <Link href="/verify-email">Back to verify email</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
