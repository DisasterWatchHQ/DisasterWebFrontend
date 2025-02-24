import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/user/dash";
import { useUser } from "@/provider/UserContext";

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
      };

      if (severityChange) {
        updateData.severity_change = severityChange;
      }

      const response = await api.post(
        `/warning/${warning._id}/updates`,
        updateData,
      );

      onUpdate && onUpdate(response.data);
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
        status: "resolved",
        resolved_by: user._id,
        resolution_notes: "Warning resolved through dashboard",
        resolved_at: new Date(),
      };

      const response = await api.post(
        `/warning/${warning._id}/resolve`,
        resolutionData,
      );

      onUpdate && onUpdate(response.data);
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
