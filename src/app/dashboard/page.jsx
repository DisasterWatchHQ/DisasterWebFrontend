"use client";
import React, { useState, useEffect } from "react";
import api from "@/api/user/dash";
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

import CreateWarningDialog  from "@/components/report/CreateWarningDialog";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    pendingCount: 0,
    verifiedToday: 0,
    activeIncidents: 0,
    avgVerificationTime: 0,
  });
  const [pendingReports, setPendingReports] = useState([]);
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

  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/userReport/stats/verification");
      setDashboardStats({
        pendingCount: response.data.pendingCount,
        verifiedToday: response.data.verifiedToday,
        activeIncidents: response.data.activeIncidents,
        avgVerificationTime: Math.round(response.data.avgVerificationTime),
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchPendingReports = async () => {
    try {
      const response = await api.get("/userReport/public", {
        params: {
          verification_status: "pending",
          limit: 5,
        },
      });

      const formattedReports = response.data.reports.map((report) => ({
        title: report.title,
        id: report.id,
        type: report.disaster_category,
        location: `${report.location.address.district}, ${report.location.address.city}`,
        timestamp: new Date(report.date_time).toLocaleString(),
        urgency: report.verification?.severity || "Medium",
      }));

      setPendingReports(formattedReports);
    } catch (error) {
      console.error("Error fetching pending reports:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/userReport/stats/analytics");

      // Format weekly trends data
      const trends = response.data.weeklyTrends.reduce((acc, curr) => {
        const date = curr._id.date;
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][curr._id.status] = curr.count;
        return acc;
      }, {});

      setAnalyticsData({
        weeklyTrends: Object.values(trends),
        reportTypes: response.data.reportTypes.map((type) => ({
          name: type._id,
          value: type.count,
        })),
        responseTime: response.data.responseTime.map((time) => ({
          time: `${Math.round(time.avgTime)}h`,
          count: time.count,
        })),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchVerificationStats = async () => {
    try {
      const response = await api.get("/userReport/stats/verification");
      setDashboardStats({
        pendingCount: response.data.pendingCount,
        verifiedToday: response.data.verifiedToday,
        activeIncidents: response.data.activeIncidents,
        avgVerificationTime: Math.round(response.data.avgVerificationTime),
      });
    } catch (error) {
      console.error("Error fetching verification stats:", error);
    }
  };

  const fetchReportStats = async () => {
    try {
      const response = await api.get("/userReport/stats");
      setReportStats(response.data);
    } catch (error) {
      console.error("Error fetching report stats:", error);
    }
  };

  const fetchReportAnalytics = async () => {
    try {
      const response = await api.get("/userReport/stats/analytics");

      // Format weekly trends data
      const trendsMap = response.data.weeklyTrends.reduce((acc, item) => {
        const date = item._id.date;
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][item._id.status] = item.count;
        return acc;
      }, {});

      const formattedTrends = Object.values(trendsMap).map((item) => ({
        date: item.date,
        verified: item.verified || 0,
        pending: item.pending || 0,
        dismissed: item.dismissed || 0,
      }));

      // Format report types data
      const reportTypes = response.data.reportTypes.map((type) => ({
        name: type._id.charAt(0).toUpperCase() + type._id.slice(1),
        value: type.count,
      }));

      // Format response time data
      const responseTime = response.data.responseTime.map((item) => ({
        time: `${Math.round(item.avgTime)}h`,
        count: Math.round(item.avgTime),
      }));

      setAnalyticsData({
        weeklyTrends: formattedTrends,
        reportTypes,
        responseTime,
      });
    } catch (error) {
      console.error("Error fetching report analytics:", error);
    }
  };

  useEffect(() => {
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
      if (action === "verify") {
        await api.post(`/userReport/${reportId}/verify`, {
          severity: "medium",
          notes: "Verified through dashboard",
        });
      } else {
        await api.post(`/userReport/${reportId}/dismiss`, {
          notes: "Dismissed through dashboard",
        });
      }
      fetchPendingReports(); // Refresh the list after action
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
    }
  };

  const reportTrends = [
    { date: "01/02", verified: 15, pending: 8, rejected: 2 },
    { date: "01/03", verified: 12, pending: 10, rejected: 3 },
    { date: "01/04", verified: 20, pending: 5, rejected: 1 },
    { date: "01/05", verified: 18, pending: 7, rejected: 4 },
    { date: "01/06", verified: 25, pending: 12, rejected: 2 },
    { date: "01/07", verified: 22, pending: 9, rejected: 3 },
    { date: "01/08", verified: 16, pending: 11, rejected: 2 },
  ];

  const reportTypes = [
    { name: "Floods", value: 35 },
    { name: "Fire", value: 25 },
    { name: "Infrastructure", value: 20 },
    { name: "Weather", value: 15 },
    { name: "Others", value: 5 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const responseTimeData = [
    { time: "<1h", count: 45 },
    { time: "1-2h", count: 30 },
    { time: "2-4h", count: 15 },
    { time: ">4h", count: 10 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats Row */}
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

      {/* Pending Reports Table */}
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

      <CardTitle>Create Warnings!</CardTitle>
      <CreateWarningDialog
        open={isWarningDialogOpen}
        onOpenChange={setIsWarningDialogOpen}
      />
      
      {/* Analytics Section */}
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
