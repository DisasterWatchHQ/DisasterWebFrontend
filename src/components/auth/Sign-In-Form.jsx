"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/api/auth/auth";
import { toast } from "sonner";
import { useUser } from "@/provider/UserContext";  // Import useUser hook instead of UserProvider

export function SignInForm() {
  const router = useRouter();
  const { login } = useUser();  // Get login function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        email,
        password
      });
      
      // Use the login function from context
      login(response.user, response.token);
      
      toast.success("Successfully signed in!");
      
      // Clear form
      setEmail("");
      setPassword("");
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}