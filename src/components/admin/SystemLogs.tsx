import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, Filter, Search } from "lucide-react";

interface ChangeLogEntry {
  id: string;
  businessId: string;
  businessName: string;
  field: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  timestamp: Date;
}

const SystemLogs = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedBusiness, setSelectedBusiness] =
    useState<string>("all-businesses");
  const [selectedUser, setSelectedUser] = useState<string>("all-users");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock data for demonstration
  const mockChangeLogs: ChangeLogEntry[] = [
    {
      id: "1",
      businessId: "b1",
      businessName: "Acme Corporation",
      field: "Status",
      previousValue: "Researching",
      newValue: "Contacting",
      changedBy: "john.doe@example.com",
      timestamp: new Date("2023-06-15T10:30:00"),
    },
    {
      id: "2",
      businessId: "b2",
      businessName: "TechStart Inc",
      field: "Phone Number",
      previousValue: "555-123-4567",
      newValue: "555-987-6543",
      changedBy: "jane.smith@example.com",
      timestamp: new Date("2023-06-14T14:45:00"),
    },
    {
      id: "3",
      businessId: "b1",
      businessName: "Acme Corporation",
      field: "Primary Contact",
      previousValue: "Tom Johnson",
      newValue: "Sarah Williams",
      changedBy: "john.doe@example.com",
      timestamp: new Date("2023-06-13T09:15:00"),
    },
    {
      id: "4",
      businessId: "b3",
      businessName: "Global Solutions Ltd",
      field: "Status",
      previousValue: "Negotiating",
      newValue: "Partner",
      changedBy: "mike.wilson@example.com",
      timestamp: new Date("2023-06-12T16:20:00"),
    },
    {
      id: "5",
      businessId: "b4",
      businessName: "Innovative Systems",
      field: "Address",
      previousValue: "123 Business Ave, Suite 100",
      newValue: "456 Corporate Blvd, Suite 200",
      changedBy: "sarah.johnson@example.com",
      timestamp: new Date("2023-06-11T11:05:00"),
    },
  ];

  // Mock data for businesses and users
  const businesses = [
    { id: "b1", name: "Acme Corporation" },
    { id: "b2", name: "TechStart Inc" },
    { id: "b3", name: "Global Solutions Ltd" },
    { id: "b4", name: "Innovative Systems" },
  ];

  const users = [
    { id: "u1", email: "john.doe@example.com" },
    { id: "u2", email: "jane.smith@example.com" },
    { id: "u3", email: "mike.wilson@example.com" },
    { id: "u4", email: "sarah.johnson@example.com" },
  ];

  // Filter logs based on selected filters
  const filteredLogs = mockChangeLogs.filter((log) => {
    const matchesDate =
      !date ||
      format(log.timestamp, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    const matchesBusiness =
      selectedBusiness === "all-businesses" ||
      log.businessId === selectedBusiness;
    const matchesUser =
      selectedUser === "all-users" || log.changedBy === selectedUser;
    const matchesSearch =
      !searchQuery ||
      log.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.previousValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.newValue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesBusiness && matchesUser && matchesSearch;
  });

  const handleExport = () => {
    // In a real implementation, this would generate a CSV or Excel file
    console.log("Exporting logs:", filteredLogs);
    alert("Exporting logs functionality would be implemented here");
  };

  const clearFilters = () => {
    setDate(undefined);
    setSelectedBusiness("all-businesses");
    setSelectedUser("all-users");
    setSearchQuery("");
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>
          View and filter system changes and user activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="changes" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="changes">Change History</TabsTrigger>
            <TabsTrigger value="logins">Login Activity</TabsTrigger>
            <TabsTrigger value="errors">System Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="changes" className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Select
                    value={selectedBusiness}
                    onValueChange={setSelectedBusiness}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Business" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-businesses">
                        All Businesses
                      </SelectItem>
                      {businesses.map((business) => (
                        <SelectItem key={business.id} value={business.id}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-users">All Users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.email}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>

                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Previous Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.businessName}
                        </TableCell>
                        <TableCell>{log.field}</TableCell>
                        <TableCell>{log.previousValue}</TableCell>
                        <TableCell>{log.newValue}</TableCell>
                        <TableCell>{log.changedBy}</TableCell>
                        <TableCell>{format(log.timestamp, "PPP p")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="logins">
            <div className="p-8 text-center text-gray-500">
              Login activity tracking will be implemented here
            </div>
          </TabsContent>

          <TabsContent value="errors">
            <div className="p-8 text-center text-gray-500">
              System error logs will be implemented here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
