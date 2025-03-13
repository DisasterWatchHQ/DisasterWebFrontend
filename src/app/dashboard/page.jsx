"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { WarningActions } from "@/components/warning/WarningActions";
import CreateWarningDialog from "@/components/report/CreateWarningDialog";
import { warningApi } from "@/lib/warningApi";
import { reportApi } from "@/lib/reportApi";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    pendingCount: 0,
    verifiedToday: 0,
    activeIncidents: 0,
    avgVerificationTime: 0,
  });
  const [pendingReports, setPendingReports] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    weeklyTrends: [],
    reportTypes: [],
    responseTime: [],
  });
  const [reportStats, setReportStats] = useState({
    byStatus: [],
    byCategory: [],
    bySeverity: [],
    recentTrends: [],
  });
  const { toast } = useToast();
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  const fetchActiveWarnings = async () => {
    try {
      const response = await warningApi.public.getActiveWarnings();
      setActiveWarnings(response.data);
    } catch (error) {
      console.error("Error fetching active warnings:", error);
    }
  };

  const fetchPendingReports = async () => {
    try {
      const response = await reportApi.public.getFeedReports({
        verification_status: "pending",
        limit: 5,
      });

      if (!response.data?.reports) {
        console.error("Unexpected response format:", response);
        return;
      }

      const formattedReports = response.data.reports
        .filter((report) => report.verification_status === "pending")
        .map((report) => ({
          title: report.title,
          id: report.id || report._id,
          type: report.disaster_category,
          location: `${report.location.address.district}, ${report.location.address.city}`,
          timestamp: new Date(report.date_time).toLocaleString(),
          urgency: report.verification?.severity || "Medium",
          verification_status: report.verification_status,
        }));

      setPendingReports(formattedReports);
    } catch (error) {
      console.error("Error fetching pending reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending reports",
        variant: "destructive",
      });
    }
  };

  const fetchVerificationStats = async () => {
    try {
      const response = await reportApi.protected.getVerificationStats();
      setDashboardStats({
        pendingCount: response.pendingCount,
        verifiedToday: response.verifiedToday,
        activeIncidents: response.activeIncidents,
        avgVerificationTime: Math.round(response.avgVerificationTime),
      });
    } catch (error) {
      console.error("Error fetching verification stats:", error);
    }
  };

  const fetchReportStats = async () => {
    try {
      const response = await reportApi.protected.getReportStats();
      setReportStats(response);
    } catch (error) {
      console.error("Error fetching report stats:", error);
    }
  };

  const fetchReportAnalytics = async () => {
    try {
      const response = await reportApi.protected.getReportAnalytics();

      const reportTypes = response.reportTypes.map((type) => ({
        name: type.name || "Unknown",
        value: type.value || 0,
      }));

      const formattedTrends = response.weeklyTrends.map((trend) => ({
        date: trend.date,
        verified: trend.verified || 0,
        pending: trend.pending || 0,
        dismissed: trend.dismissed || 0,
      }));

      const responseTime = response.responseTime.map((item) => ({
        time: item.time,
        count: item.count,
      }));

      setAnalyticsData({
        weeklyTrends: formattedTrends,
        reportTypes: reportTypes,
        responseTime: responseTime,
      });
    } catch (error) {
      console.error("Error fetching report analytics:", error);
    }
  };

  useEffect(() => {
    fetchActiveWarnings();
    fetchVerificationStats();
    fetchReportStats();
    fetchReportAnalytics();
    fetchPendingReports();

    const interval = setInterval(() => {
      fetchVerificationStats();
      fetchReportStats();
      fetchReportAnalytics();
      fetchPendingReports();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const handleReportAction = async (reportId, action) => {
    try {
      setPendingReports((current) =>
        current.filter((report) => report.id !== reportId),
      );

      if (action === "verify") {
        await reportApi.protected.verifyReport(reportId, {
          severity: "medium",
          notes: "Verified through dashboard",
        });
      } else if (action === "dismiss") {
        await reportApi.protected.dismissReport(reportId, {
          notes: "Dismissed through dashboard",
        });
      }

      await Promise.all([
        fetchPendingReports(),
        fetchVerificationStats(),
        fetchReportStats(),
        fetchReportAnalytics(),
      ]);

      toast({
        title: "Success",
        description: `Report successfully ${action === "verify" ? "verified" : "dismissed"}.`,
      });
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);

      await Promise.all([
        fetchPendingReports(),
        fetchVerificationStats(),
        fetchReportStats(),
        fetchReportAnalytics(),
      ]);

      toast({
        title: "Error",
        description:
          error.response?.data?.error || `Failed to ${action} report.`,
        variant: "destructive",
      });
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.verifiedToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.activeIncidents}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.avgVerificationTime}h
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports Awaiting Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded hover:bg-accent"
              >
                <div className="space-y-1">
                  <div className="font-medium">{report.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {report.type} - {report.location}, {report.urgency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-green-100"
                    onClick={() => handleReportAction(report.id, "verify")}
                  >
                    Verify
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => handleReportAction(report.id, "dismiss")}
                  >
                    Reject
                  </Badge>
                </div>
              </div>
            ))}
            {pendingReports.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No pending reports to verify
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <CardTitle>Warnings Management</CardTitle>
        <Button
          onClick={() => setIsWarningDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Warning
        </Button>
      </div>

      <CreateWarningDialog
        open={isWarningDialogOpen}
        onOpenChange={(open) => {
          setIsWarningDialogOpen(open);
          if (!open) {
            fetchActiveWarnings();
          }
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Active Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(activeWarnings) && activeWarnings.length > 0 ? (
              activeWarnings.map((warning) => (
                <div
                  key={warning.id || warning._id}
                  className="flex items-center justify-between p-4 border rounded"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{warning.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {warning.disaster_category} - Severity: {warning.severity}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(
                        warning.createdAt || warning.created_at,
                      ).toLocaleString()}
                    </div>
                    {warning.updates?.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Last update:{" "}
                        {
                          warning.updates[warning.updates.length - 1]
                            .update_text
                        }
                      </div>
                    )}
                  </div>
                  <WarningActions
                    warning={warning}
                    onUpdate={() => fetchActiveWarnings()}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No active warnings
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Report Trends</TabsTrigger>
          <TabsTrigger value="types">Report Types</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Report Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="verified"
                      stroke="#00C49F"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke="#FFBB28"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="dismissed"
                      stroke="#FF8042"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Distribution of Report Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.reportTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.reportTypes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle>Verification Response Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.responseTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
