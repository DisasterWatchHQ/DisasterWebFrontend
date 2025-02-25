import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WarningDetailDialog({ warning, open, onOpenChange }) {
  if (!warning) return null;

  console.log("Warning Data:", warning); // Keep this for debugging

  const formatLocation = (location) => {
    try {
      if (!location?.address) return "Location details not available";
      const { city, district, province, details } = location.address;
      let formatted =
        `${district || ""}, ${city || ""}, ${province || ""}`.trim();
      if (details) formatted += ` - ${details}`;
      return formatted;
    } catch (error) {
      console.error("Error formatting location:", error);
      return "Location format error";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {warning.title}
            <Badge variant="warning">{warning.disaster_category}</Badge>
            {warning.severity && (
              <Badge
                variant={
                  warning.severity === "critical"
                    ? "destructive"
                    : warning.severity === "high"
                      ? "warning"
                      : "default"
                }
              >
                {warning.severity}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {warning.description && (
              <div className="prose dark:prose-invert max-w-none">
                <p>{warning.description}</p>
              </div>
            )}

            {warning.affected_locations?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Affected Locations</h3>
                <div className="space-y-2">
                  {warning.affected_locations.map((location, index) => (
                    <div key={index} className="border rounded p-2">
                      <p>{formatLocation(location)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {warning.expected_duration && (
              <div>
                <h3 className="font-semibold mb-2">Duration</h3>
                <p className="text-sm text-muted-foreground">
                  Started: {new Date(warning.created_at).toLocaleString()}
                  {warning.expected_duration.end_time && (
                    <>
                      <br />
                      Expected End:{" "}
                      {new Date(
                        warning.expected_duration.end_time,
                      ).toLocaleString()}
                    </>
                  )}
                </p>
              </div>
            )}

            {warning.updates?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Updates</h3>
                <div className="space-y-2">
                  {warning.updates.map((update, index) => (
                    <div key={index} className="border rounded p-3">
                      <p>{update.update_text}</p>
                      {update.severity_change && (
                        <Badge
                          variant={
                            update.severity_change === "critical"
                              ? "destructive"
                              : update.severity_change === "high"
                                ? "warning"
                                : "default"
                          }
                          className="mt-2"
                        >
                          Severity changed to: {update.severity_change}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(update.updated_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(warning.created_at).toLocaleString()}</p>
              {warning.status && (
                <Badge
                  variant={warning.status === "active" ? "warning" : "default"}
                  className="mt-2"
                >
                  {warning.status}
                </Badge>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 
