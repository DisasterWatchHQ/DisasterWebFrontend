"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { createUser } from "@/api/auth/auth";

export function SignUpForm({ onSignUpSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workId, setWorkId] = useState("");
  const [associatedDepartment, setAssociatedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Hospital",
    "Clinic",
    "Fire Department",
    "Shelter",
    "Police Station",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
  
    if (!name || !email || !password || !workId || !associatedDepartment) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }
  
    try {
      const userData = {
        name,
        email,
        password,
        workId,
        associated_department: associatedDepartment,
      };
      const response = await createUser(userData);
  
      toast.success("Registration successful! You can now sign in.");
      onSignUpSuccess && onSignUpSuccess();
  
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setWorkId("");
      setAssociatedDepartment("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Work ID"
          value={workId}
          onChange={(e) => setWorkId(e.target.value)}
          required
        />
        <Select
          onValueChange={(value) => setAssociatedDepartment(value)}
          value={associatedDepartment}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
      <Toaster />
    </>
  );
}
