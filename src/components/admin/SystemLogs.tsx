import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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

  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch change logs from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch change logs
        const { data: logsData, error: logsError } = await supabase
          .from("change_logs")
          .select(
            `
            id,
            table_name,
            record_id,
            field,
            previous_value,
            new_value,
            changed_by,
            timestamp,
            users(email)
          `,
          )
          .order("timestamp", { ascending: false });

        if (logsError) throw logsError;

        // Fetch businesses for reference
        const { data: businessesData, error: businessesError } = await supabase
          .from("businesses")
          .select("id, name");

        if (businessesError) throw businessesError;

        // Fetch users for reference
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, email");

        if (usersError) throw usersError;

        // Process and set the data
        setBusinesses(businessesData || []);
        setUsers(usersData || []);

        // Transform logs data
        const processedLogs = (logsData || []).map((log: any) => {
          // Find business name if the record is a business
          let businessName = "Unknown";
          let businessId = "";

          if (log.table_name === "businesses") {
            const business = businessesData?.find(
              (b) => b.id === log.record_id,
            );
            if (business) {
              businessName = business.name;
              businessId = business.id;
            }
          } else {
            // For other tables that might have a business_id field
            // This would require additional queries in a real implementation
            businessId = log.record_id;
          }

          return {
            id: log.id,
            businessId: businessId,
            businessName: businessName,
            field: log.field,
            previousValue: log.previous_value || "",
            newValue: log.new_value || "",
            changedBy: log.users?.email || "System",
            timestamp: new Date(log.timestamp),
          };
        });

        setChangeLogs(processedLogs);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logs based on selected filters
  const filteredLogs = changeLogs.filter((log) => {
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
