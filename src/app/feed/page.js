"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReloadIcon, BellIcon, FilterIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Feed() {
  const { toast } = useToast();
  const { reports, loading, error, refreshReports } = useReports();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Simulated real-time updates
  useEffect(() => {
    // Websocket connection would go here
    const interval = setInterval(() => {
      // Simulate new updates
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
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
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reports Feed */}
            <div className="md:col-span-2">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="verified">Verified Only</TabsTrigger>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                </TabsList>

                <div className="mb-4 mt-2">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="cursor-pointer">
                      Floods
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Fires
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Earthquakes
                    </Badge>
                    {/* Add more disaster type filters */}
                  </div>
                </div>

                <TabsContent value="all">
                  {reports.map((report, index) => (
                    <DisasterReportCard
                      key={index}
                      {...report}
                      onShare={() => {}} // Add share functionality
                      onSave={() => {}} // Add save functionality
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Live Updates Chat */}
            <div className="hidden md:block">
              <Card className="h-[calc(100vh-200px)]">
                <CardHeader>
                  <CardTitle className="text-lg">Live Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {updates.map((update, index) => (
                        <div key={index} className="border-b pb-2">
                          <p className="text-sm font-medium">
                            {update.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
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
          {/* Add notification settings options */}
          <AlertDialogFooter>
            <AlertDialogAction>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DisasterReportCard({
  title,
  description,
  date,
  location,
  severity,
  isVerified,
  source,
  onShare,
  onSave,
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            {title}
            {isVerified && (
              <Badge variant="success" className="ml-2">
                Verified
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <Badge
              variant={
                severity === "high"
                  ? "destructive"
                  : severity === "medium"
                    ? "warning"
                    : "default"
              }
            >
              {severity}
            </Badge>
            <span className="text-sm text-muted-foreground">{source}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>{location}</span>
          <span>{new Date(date).toLocaleString()}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onShare}>
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
