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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Share2 as WhatsappIcon,
} from "lucide-react";
import { WarningDetailDialog } from "@/components/warning/WarningDetailDialog";
import { Loader2 as ReloadIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function DisasterFeed() {
  const { reports, loading, error, filters, updateFilters, refreshReports } =
    useReports();
  const { updates, activeWarnings } = useLiveUpdates();
  const [selectedWarning, setSelectedWarning] = useState(null);

  const filteredReports = (showVerifiedOnly) => {
    return reports.filter((report) => {
      const verificationMatch =
        !showVerifiedOnly || report.verification_status === "verified";
      const categoryMatch =
        !filters.disaster_category ||
        report.disaster_category === filters.disaster_category;
      const districtMatch =
        !filters.district || report.district === filters.district;

      return verificationMatch && categoryMatch && districtMatch;
    });
  };

  const handleFilterChange = (type, value) => {
    updateFilters({ [type]: value, page: 1 });
  };

  const clearFilters = () => {
    updateFilters({
      disaster_category: "",
      district: "",
      verified_only: false,
      page: 1,
    });
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
      default:
        break;
    }
  };

  const renderReportCard = (report) => (
    <Card key={report.id}>
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
          {report.district && (
            <Badge variant="outline">{report.district}</Badge>
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
            This report has been dismissed and cannot be shared.
          </p>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {new Date(report.timestamp).toLocaleString()}
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen w-full bg-background">
      {activeWarnings.length > 0 && (
        <div className="bg-warning/20 p-2">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 px-4">
              {activeWarnings.map((warning) => (
                <Badge
                  key={warning.id}
                  variant="warning"
                  className="animate-pulse flex items-center gap-2 cursor-pointer hover:bg-warning/30"
                  onClick={() => setSelectedWarning(warning)}
                >
                  <span className="font-bold">
                    {warning.disaster_category.toUpperCase()}:
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
                  {warning.affected_locations && (
                    <span className="text-xs">
                      ({warning.affected_locations[0].address.district})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <WarningDetailDialog
        warning={selectedWarning}
        open={!!selectedWarning}
        onOpenChange={(open) => !open && setSelectedWarning(null)}
      />

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
              <Button onClick={refreshReports} disabled={loading}>
                {loading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="text-center p-4">
                      <ReloadIcon className="animate-spin h-6 w-6 mx-auto" />
                    </div>
                  ) : filteredReports(false).length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      No reports found matching the selected filters
                    </div>
                  ) : (
                    filteredReports(false).map((report) =>
                      renderReportCard(report),
                    )
                  )}
                </TabsContent>

                <TabsContent value="verified" className="space-y-4">
                  {loading ? (
                    <div className="text-center p-4">
                      <ReloadIcon className="animate-spin h-6 w-6 mx-auto" />
                    </div>
                  ) : filteredReports(true).length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      No verified reports found matching the selected filters
                    </div>
                  ) : (
                    filteredReports(true).map((report) =>
                      renderReportCard(report),
                    )
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
