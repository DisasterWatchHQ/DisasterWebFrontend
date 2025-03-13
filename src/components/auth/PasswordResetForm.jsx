import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { forgotPassword } from "@/api/auth/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PasswordResetForm({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    workId: "",
    department: "",
  });

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

    if (!formData.email || !formData.workId || !formData.department) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      await forgotPassword(formData);
      toast.success(
        "Password reset instructions have been sent to the administrator.",
      );
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to send password reset request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workId">Work ID</Label>
        <Input
          id="workId"
          type="text"
          placeholder="Enter your Work ID"
          value={formData.workId}
          onChange={(e) => setFormData({ ...formData, workId: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) =>
            setFormData({ ...formData, department: value })
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending Request..." : "Send Reset Request"}
      </Button>
    </form>
  );
}
