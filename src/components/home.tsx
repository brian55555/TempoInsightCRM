import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import BusinessList from "./dashboard/BusinessList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  CheckSquare,
  Users,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";

interface HomeProps {
  isAdmin?: boolean;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
}

const Home = ({
  isAdmin = false,
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  notificationCount = 3,
}: HomeProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleAddBusiness = () => {
    // This would typically navigate to a business creation form
    console.log("Add business clicked");
  };

  const handleEditBusiness = (id: string) => {
    navigate(`/business/${id}`);
  };

  const handleDeleteBusiness = (id: string) => {
    // This would typically show a confirmation dialog
    console.log(`Delete business ${id} clicked`);
  };

  // Mock data for dashboard metrics
  const metrics = {
    totalBusinesses: 24,
    activeBusinesses: 18,
    recentContacts: 12,
    pendingTasks: 8,
    documentsUploaded: 36,
    recentActivity: [
      {
        id: 1,
        action: "Business Updated",
        target: "Acme Corporation",
        user: "John Doe",
        time: "2 hours ago",
      },
      {
        id: 2,
        action: "Contact Added",
        target: "Jane Smith at Globex",
        user: "Sarah Johnson",
        time: "4 hours ago",
      },
      {
        id: 3,
        action: "Task Completed",
        target: "Quarterly Review",
        user: "Michael Brown",
        time: "Yesterday",
      },
      {
        id: 4,
        action: "Document Uploaded",
        target: "Contract Draft.pdf",
        user: "Emily Davis",
        time: "2 days ago",
      },
      {
        id: 5,
        action: "Status Changed",
        target: "Wayne Industries → Partner",
        user: "John Doe",
        time: "3 days ago",
      },
    ],
  };

  return (
    <MainLayout
      isAdmin={isAdmin}
      userName={userName}
      userEmail={userEmail}
      notificationCount={notificationCount}
    >
      <div className="w-full max-w-7xl mx-auto bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your businesses today.
          </p>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Businesses
                  </CardTitle>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.totalBusinesses}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.activeBusinesses} active businesses
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Recent Contacts
                  </CardTitle>
                  <Users className="h-5 w-5 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.recentContacts}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Added in the last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Pending Tasks
                  </CardTitle>
                  <CheckSquare className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.pendingTasks}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tasks requiring attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Documents
                  </CardTitle>
                  <FileText className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.documentsUploaded}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total documents uploaded
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Business Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Researching</span>
                      </div>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 ml-2 mr-2">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: "33%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">8</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Contacting</span>
                      </div>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 ml-2 mr-2">
                        <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: "21%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">5</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span>Negotiating</span>
                      </div>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 ml-2 mr-2">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full"
                          style={{ width: "13%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">3</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Partner</span>
                      </div>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 ml-2 mr-2">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">6</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                        <span>Inactive</span>
                      </div>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 ml-2 mr-2">
                        <div
                          className="bg-gray-500 h-2.5 rounded-full"
                          style={{ width: "8%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.recentActivity.slice(0, 3).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="bg-blue-100 p-2 rounded-full">
                          {activity.action.includes("Business") ? (
                            <Building2 className="h-4 w-4 text-blue-600" />
                          ) : activity.action.includes("Contact") ? (
                            <Users className="h-4 w-4 text-yellow-600" />
                          ) : activity.action.includes("Task") ? (
                            <CheckSquare className="h-4 w-4 text-green-600" />
                          ) : activity.action.includes("Document") ? (
                            <FileText className="h-4 w-4 text-purple-600" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.target}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-400">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="businesses">
            <BusinessList
              onAddBusiness={handleAddBusiness}
              onEditBusiness={handleEditBusiness}
              onDeleteBusiness={handleDeleteBusiness}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Your upcoming and pending tasks will appear here.
                </p>
                <Button className="mt-4">
                  <CheckSquare className="mr-2 h-4 w-4" /> Create New Task
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 border-b border-gray-100 pb-4"
                    >
                      <div className="bg-blue-100 p-2 rounded-full">
                        {activity.action.includes("Business") ? (
                          <Building2 className="h-4 w-4 text-blue-600" />
                        ) : activity.action.includes("Contact") ? (
                          <Users className="h-4 w-4 text-yellow-600" />
                        ) : activity.action.includes("Task") ? (
                          <CheckSquare className="h-4 w-4 text-green-600" />
                        ) : activity.action.includes("Document") ? (
                          <FileText className="h-4 w-4 text-purple-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <span className="text-xs text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.target}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          by {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Home;
