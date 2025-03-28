import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/provider/UserContext";
import { warningApi } from "@/lib/warningApi";

export const WarningActions = ({ warning, onUpdate }) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [severityChange, setSeverityChange] = useState("");
  const { user, isLoggedIn } = useUser();

  const handleAddUpdate = async () => {
    if (!isLoggedIn || !user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const updateData = {
        update_text: updateText,
        updated_by: user._id,
        updated_at: new Date(),
        severity_change: severityChange || undefined,
      };

      const response = await warningApi.protected.addUpdate(
        warning._id,
        updateData,
      );

      onUpdate && onUpdate(response);
      setIsUpdateOpen(false);
      setUpdateText("");
      setSeverityChange("");
    } catch (error) {
      console.error("Error adding update:", error);
    }
  };

  const handleResolveWarning = async () => {
    if (!isLoggedIn || !user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const resolutionData = {
        resolution_notes: "Warning resolved through dashboard",
      };

      const response = await warningApi.protected.resolveWarning(
        warning._id,
        resolutionData,
      );

      onUpdate && onUpdate(response);
    } catch (error) {
      console.error("Error resolving warning:", error);
    }
  };

  return (
    <div className="space-x-2">
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Update</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Warning Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Update details..."
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              required
            />
            <Select onValueChange={setSeverityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Change severity (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUpdate} disabled={!updateText.trim()}>
              Submit Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {warning.status !== "resolved" && (
        <Button
          variant="destructive"
          onClick={handleResolveWarning}
          disabled={!isLoggedIn}
        >
          Resolve Warning
        </Button>
      )}
    </div>
  );
};
