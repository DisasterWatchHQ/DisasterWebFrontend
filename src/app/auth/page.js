"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogInIcon, UserPlusIcon } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  
  const handleSignUpSuccess = () => {
      setActiveTab("signin");
    };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Side - Branding Section */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
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
            <Button
              variant="outline"
              className="text-white border-white/50 hover:bg-white/10"
            >
              Learn More
            </Button>
            <Button className="bg-primary-foreground text-primary hover:bg-primary/90">
              Get Started
            </Button>
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
                <TabsTrigger value="signin" className="flex items-center gap-2">
                  <LogInIcon className="h-4 w-4" /> Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
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

            {/* Social Login Options */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                </svg>
                Facebook
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.25 17.57c-2.56 0-4.42-2.11-4.42-4.73s1.86-4.73 4.42-4.73c1.26 0 2.31.45 3.11 1.23l-1.26 1.23c-.34-.33-.95-.73-1.85-.73-1.58 0-2.87 1.31-2.87 2.93s1.29 2.93 2.87 2.93c1.83 0 2.52-1.32 2.63-2.01h-2.63v-1.61h4.36c.04.23.07.46.07.7 0 2.64-1.77 4.52-4.43 4.52z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </Card>

          {/* Additional Links */}
          <div className="text-center text-sm text-muted-foreground">
            <Link
              href="/forgot-password"
              className="underline hover:text-primary"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
