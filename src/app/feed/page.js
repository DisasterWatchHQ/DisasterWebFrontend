"use client";
import { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useLiveUpdates } from "@/hooks/useLiveUpdates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Share2 as WhatsappIcon,
  Loader2,
} from "lucide-react";
import { WarningDetailDialog } from "@/components/warning/WarningDetailDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Kegalle",
  "Ratnapura",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
];

const VERIFICATION_STATUSES = [
  { value: "all", label: "All Reports" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "dismissed", label: "Dismissed" },
];

export default function DisasterFeed() {
  const { toast } = useToast();
  const {
    reports,
    loading,
    error,
    filters,
    updateFilters,
    refreshReports,
    pagination,
  } = useReports();
  const {
    activeWarnings,
    loading: warningsLoading,
    error: warningsError,
  } = useLiveUpdates();
  const [selectedWarning, setSelectedWarning] = useState(null);

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  const handleVerificationFilter = (status) => {
    updateFilters({
      verification_status: status === "all" ? "" : status,
      page: 1,
    });
  };

  const handleFilterChange = (type, value) => {
    updateFilters({
      [type]: value,
      page: 1,
    });
  };

  const clearFilters = () => {
    updateFilters({
      disaster_category: "",
      district: "",
      verification_status: "",
      verified_only: false,
      page: 1,
    });
  };

  const handleRefresh = async () => {
    try {
      await refreshReports();
      toast({
        title: "Feed Updated",
        description: "Latest reports have been loaded.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to refresh reports.",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (report, platform) => {
    const shareText = `${report.title} - ${report.description}`;
    const shareUrl = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText,
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl,
          )}`,
          "_blank",
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          "_blank",
        );
        break;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-destructive text-lg mb-4">
          Error loading reports: {error}
        </div>
        <Button onClick={refreshReports}>Try Again</Button>
      </div>
    );
  }

  const renderReportCard = (report) => (
    <Card key={report.id || report._id}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {report.title}
          {report.verification_status !== "dismissed" && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSocialShare(report, "twitter")}
              >
                <TwitterIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSocialShare(report, "facebook")}
              >
                <FacebookIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSocialShare(report, "whatsapp")}
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
          {report.location?.address?.district && (
            <Badge variant="outline">{report.location.address.district}</Badge>
          )}
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
          {report.verification?.severity && (
            <Badge
              variant={
                report.verification.severity === "critical"
                  ? "destructive"
                  : report.verification.severity === "high"
                    ? "warning"
                    : "default"
              }
            >
              {report.verification.severity}
            </Badge>
          )}
        </div>
        {report.verification_status === "dismissed" && (
          <p className="text-sm text-muted-foreground mt-2">
            This report has been dismissed and cannot be shared.
          </p>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {new Date(report.date_time).toLocaleString()}
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen w-full bg-background">
      {warningsError && (
        <div className="bg-destructive/20 p-2 text-center text-sm">
          Error loading warnings. Please refresh the page.
        </div>
      )}
      {!warningsError && warningsLoading ? (
        <div className="bg-warning/20 p-2">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading warnings...
          </div>
        </div>
      ) : (
        /* Warning display */
        activeWarnings?.length > 0 && (
          <div className="bg-warning/20 p-2">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 px-4">
                {activeWarnings.map((warning) => (
                  <Badge
                    key={warning._id}
                    variant="warning"
                    className="animate-pulse flex items-center gap-2 cursor-pointer hover:bg-warning/30"
                    onClick={() => setSelectedWarning(warning)}
                  >
                    <span className="font-bold">
                      {warning.disaster_category?.toUpperCase()}:
                    </span>
                    <span>{warning.title}</span>
                    {warning.severity && (
                      <span
                        className={`ml-2 px-1 py-0.5 text-xs rounded ${
                          warning.severity === "critical"
                            ? "bg-destructive text-destructive-foreground"
                            : warning.severity === "high"
                              ? "bg-warning text-warning-foreground"
                              : "bg-warning-foreground/10"
                        }`}
                      >
                        {warning.severity}
                      </span>
                    )}
                    {warning.affected_locations?.[0]?.address?.district && (
                      <span className="text-xs">
                        ({warning.affected_locations[0].address.district})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )
      )}
      
      <WarningDetailDialog
        warning={selectedWarning}
        open={!!selectedWarning}
        onOpenChange={(open) => {
          if (!open) setSelectedWarning(null);
        }}
      />

      <main className="w-full h-full p-6">
        <div className="max-w-6xl mx-auto space-y-6">
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
              <Select
                value={filters.verification_status || "all"}
                onValueChange={(value) => handleVerificationFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Verification Status" />
                </SelectTrigger>
                <SelectContent>
                  {VERIFICATION_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleRefresh} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <Tabs
                value={filters.verified_only ? "verified" : "all"}
                onValueChange={(value) => {
                  handleFilterChange("verified_only", value === "verified");
                  handleFilterChange("verification_status", "");
                }}
              >
                <TabsList>
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="verified">Verified Only</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
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
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Select
                            value={filters.district || "all"}
                            onValueChange={(value) =>
                              handleFilterChange(
                                "district",
                                value === "all" ? "" : value,
                              )
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Districts</SelectItem>
                              {DISTRICTS.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center p-4">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      No {filters.verified_only ? "verified " : ""}reports found
                      matching the selected filters
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-6">
                        {reports.map((report) => renderReportCard(report))}
                      </div>

                      {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                          <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
