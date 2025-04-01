import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import MainLayout from "@/components/layout/MainLayout";
import UserManagement from "@/components/admin/UserManagement";
import SystemLogs from "@/components/admin/SystemLogs";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert, Users, FileText, BarChart } from "lucide-react";

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    systemLogs: 0,
    activeBusinesses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users count
        const { count: userCount, error: userError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        if (userError) throw userError;

        // Fetch pending approvals count
        const { count: pendingCount, error: pendingError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("is_approved", false);

        if (pendingError) throw pendingError;

        // Fetch system logs count
        const { count: logsCount, error: logsError } = await supabase
          .from("change_logs")
          .select("*", { count: "exact", head: true });

        if (logsError) throw logsError;

        // Fetch active businesses count
        const { count: businessCount, error: businessError } = await supabase
          .from("businesses")
          .select("*", { count: "exact", head: true })
          .eq("status", "Partner");

        if (businessError) throw businessError;

        setStats({
          totalUsers: userCount || 0,
          pendingApprovals: pendingCount || 0,
          systemLogs: logsCount || 0,
          activeBusinesses: businessCount || 0,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Admin Dashboard | Insight CRM</title>
        </Helmet>

        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Manage users, view system logs, and monitor platform activity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Pending Approvals
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.pendingApprovals}
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <ShieldAlert className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        System Logs
                      </p>
                      <p className="text-2xl font-bold">{stats.systemLogs}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Active Businesses
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.activeBusinesses}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <BarChart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Management
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  System Logs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              <TabsContent value="logs">
                <SystemLogs />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
