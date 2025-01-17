"use client";

import { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useLiveUpdates } from "@/hooks/useLiveUpdates";
import axios from "axios";

// shadcn components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Share2 as WhatsappIcon,
} from "lucide-react";

// icons
import {
  Bell as BellIcon,
  Loader2 as ReloadIcon,
  Share as ShareIcon,
} from "lucide-react";

export default function DisasterFeed() {
  const { reports, loading, error, filters, updateFilters, refreshReports } =
    useReports();
  const { updates, activeWarnings } = useLiveUpdates();
  const [showAlert, setShowAlert] = useState(false);
  const { toast } = useToast();

  const handleShare = async (reportId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/userReport/share/${reportId}`,
      );
      const shareData = response.data.data;

      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareData.shareUrl);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this report with others",
        });
      }
    } catch (error) {
      console.error("Error sharing report:", error);
      toast({
        title: "Error sharing report",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const filteredReports = (showVerifiedOnly) => {
    return reports.filter(
      (report) =>
        !showVerifiedOnly || report.verification_status === "verified",
    );
  };

  const handleFilterChange = (type, value) => {
    updateFilters({ [type]: value, page: 1 });
  };

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading reports: {error}
      </div>
    );
  }

  const handleSocialShare = (report, platform) => {
    const shareText = `${report.title} - ${report.description}`;
    const shareUrl = window.location.href; // or your specific report URL

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          "_blank",
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Active Warnings Banner */}
      {activeWarnings.length > 0 && (
        <div className="bg-warning/20 p-2">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 px-4">
              {activeWarnings.map((warning, index) => (
                <Badge key={index} variant="warning" className="animate-pulse">
                  {warning.message}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <main className="w-full h-full p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Disaster Feed
              </h1>
              <p className="text-muted-foreground">
                Live updates and verified reports
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAlert(!showAlert)}
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button onClick={refreshReports} disabled={loading}>
                {loading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reports Feed */}
            <div className="md:col-span-3">
              <Tabs
                defaultValue="all"
                onValueChange={(value) =>
                  handleFilterChange("verified_only", value === "verified")
                }
              >
                <TabsList>
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="verified">Verified Only</TabsTrigger>
                </TabsList>

                <div className="mb-4 mt-2">
                  <div className="flex space-x-2">
                    {[
                      "flood",
                      "fire",
                      "earthquake",
                      "landslide",
                      "cyclone",
                    ].map((category) => (
                      <Badge
                        key={category}
                        variant={
                          filters.disaster_category === category
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          handleFilterChange(
                            "disaster_category",
                            filters.disaster_category === category
                              ? ""
                              : category,
                          )
                        }
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="text-center p-4">
                      <ReloadIcon className="animate-spin h-6 w-6 mx-auto" />
                    </div>
                  ) : (
                    filteredReports(false).map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          <CardTitle className="flex justify-between">
                            {report.title}
                            {report.verification_status !== "dismissed" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSocialShare(report, "twitter")
                                  }
                                >
                                  <TwitterIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSocialShare(report, "facebook")
                                  }
                                >
                                  <FacebookIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSocialShare(report, "whatsapp")
                                  }
                                >
                                  <WhatsappIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{report.description}</p>
                          <div className="flex gap-2 mt-4">
                            <Badge>{report.disaster_category}</Badge>
                            <Badge
                              variant={
                                report.verification_status === "verified"
                                  ? "default"
                                  : report.verification_status === "dismissed"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {report.verification_status}
                            </Badge>
                            {report.severity && (
                              <Badge
                                variant={
                                  report.severity === "critical"
                                    ? "destructive"
                                    : report.severity === "high"
                                      ? "warning"
                                      : "default"
                                }
                              >
                                {report.severity}
                              </Badge>
                            )}
                          </div>
                          {report.verification_status === "dismissed" && (
                            <p className="text-sm text-muted-foreground mt-2">
                              This report has been dismissed and cannot be
                              shared.
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                          {new Date(report.timestamp).toLocaleString()}
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="verified" className="space-y-4">
                  {loading ? (
                    <div className="text-center p-4">
                      <ReloadIcon className="animate-spin h-6 w-6 mx-auto" />
                    </div>
                  ) : (
                    filteredReports(true).map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          <CardTitle className="flex justify-between">
                            {report.title}
                            {report.verification_status !== "dismissed" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSocialShare(report, "twitter")
                                  }
                                >
                                  <TwitterIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSocialShare(report, "facebook")
                                  }
                                >
                                  <FacebookIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSocialShare(report, "whatsapp")
                                  }
                                >
                                  <WhatsappIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{report.description}</p>
                          <div className="flex gap-2 mt-4">
                            <Badge>{report.disaster_category}</Badge>
                            <Badge
                              variant={
                                report.verification_status === "verified"
                                  ? "default"
                                  : report.verification_status === "dismissed"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {report.verification_status}
                            </Badge>
                            {report.severity && (
                              <Badge
                                variant={
                                  report.severity === "critical"
                                    ? "destructive"
                                    : report.severity === "high"
                                      ? "warning"
                                      : "default"
                                }
                              >
                                {report.severity}
                              </Badge>
                            )}
                          </div>
                          {report.verification_status === "dismissed" && (
                            <p className="text-sm text-muted-foreground mt-2">
                              This report has been dismissed and cannot be
                              shared.
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                          {new Date(report.timestamp).toLocaleString()}
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Settings Dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Choose which types of alerts you want to receive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
}
