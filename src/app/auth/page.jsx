"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/Sign-In-Form";
import { SignUpForm } from "@/components/auth/Sign-Up-Form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogInIcon, UserPlusIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSignUpSuccess = () => {
    setActiveTab("signin");
  };

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />

      {/* Password Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <PasswordResetForm onClose={() => setIsResetDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Side - Branding Section */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex" style={{
            backgroundImage: "url('/bg1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <div className="absolute inset-0 bg-zinc-900 opacity-80" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link
              href="/"
              className="flex items-center hover:text-gray-300 transition-colors mr-4"
              aria-label="Go back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              <span>DisasterWatch</span>
            </div>
          </div>
          <div className="relative z-20 mt-auto space-y-4">
            <blockquote className="space-y-2">
              <p className="text-lg italic">
                &ldquo;Stay informed and prepared with real-time disaster
                monitoring and emergency resources.&rdquo;
              </p>
            </blockquote>
            <div className="flex space-x-2">
              <Link href="/">
                <Button
                  variant="outline"
                  className="text-white border-white/50 hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Back Button */}
        <Link
          href="/"
          className="absolute left-4 top-4 text-gray-700 hover:text-gray-900 transition-colors lg:hidden"
          aria-label="Go back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Right Side - Authentication Forms */}
        <div className="lg:p-8 w-full">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Card className="p-6 shadow-lg">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="signin"
                    className="flex items-center gap-2"
                  >
                    <LogInIcon className="h-4 w-4" /> Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="flex items-center gap-2"
                  >
                    <UserPlusIcon className="h-4 w-4" /> Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <SignInForm />
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
                </TabsContent>
              </Tabs>
            </Card>

            {/* Additional Links */}
            <div className="text-center text-sm text-muted-foreground">
              <button
                onClick={() => setIsResetDialogOpen(true)}
                className="underline hover:text-primary"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
