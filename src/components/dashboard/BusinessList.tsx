import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Grid, List } from "lucide-react";
import BusinessCard from "./BusinessCard";
import StatusFilter from "./StatusFilter";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type BusinessStatus =
  | "Researching"
  | "Contacting"
  | "Negotiating"
  | "Partner"
  | "Inactive";

interface Business {
  id: string;
  name: string;
  status: BusinessStatus;
  logo?: string;
  industry?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  lastUpdated?: string;
}

interface BusinessListProps {
  businesses?: Business[];
  onAddBusiness?: () => void;
  onEditBusiness?: (id: string) => void;
  onDeleteBusiness?: (id: string) => void;
}

const BusinessList = ({
  onAddBusiness = () => {},
  onEditBusiness = () => {},
  onDeleteBusiness = () => {},
}: BusinessListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();

  // Fetch businesses from Supabase
  useEffect(() => {
    console.log("Fetching businesses, user:", user);
    const fetchBusinesses = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching businesses:", error);
          throw error;
        }

        console.log("Businesses data:", data);

        // Transform the data to match our Business interface
        const transformedData = (data || []).map((business) => ({
          id: business.id,
          name: business.name,
          status: business.status as BusinessStatus,
          industry: business.industry,
          location: business.location,
          contactName: business.contact_name,
          contactEmail: business.contact_email,
          contactPhone: business.contact_phone,
          lastUpdated: business.updated_at
            ? formatDistanceToNow(new Date(business.updated_at), {
                addSuffix: true,
              })
            : undefined,
        }));

        setBusinesses(transformedData);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  // Add a new business
  const handleAddBusiness = async (businessData: Omit<Business, "id">) => {
    if (!user) return;

    try {
      // Convert from our frontend model to the database model
      const dbBusiness = {
        name: businessData.name,
        status: businessData.status,
        industry: businessData.industry,
        location: businessData.location,
        contact_name: businessData.contactName,
        contact_email: businessData.contactEmail,
        contact_phone: businessData.contactPhone,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("businesses")
        .insert(dbBusiness)
        .select()
        .single();

      if (error) throw error;

      // Add the new business to our state
      const newBusiness: Business = {
        id: data.id,
        name: data.name,
        status: data.status as BusinessStatus,
        industry: data.industry,
        location: data.location,
        contactName: data.contact_name,
        contactEmail: data.contact_email,
        contactPhone: data.contact_phone,
        lastUpdated: "just now",
      };

      setBusinesses([newBusiness, ...businesses]);
    } catch (error) {
      console.error("Error adding business:", error);
    }
  };

  // Edit a business
  const handleEditBusiness = async (
    id: string,
    businessData: Partial<Business>,
  ) => {
    try {
      // Convert from our frontend model to the database model
      const dbBusiness = {
        name: businessData.name,
        status: businessData.status,
        industry: businessData.industry,
        location: businessData.location,
        contact_name: businessData.contactName,
        contact_email: businessData.contactEmail,
        contact_phone: businessData.contactPhone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("businesses")
        .update(dbBusiness)
        .eq("id", id);

      if (error) throw error;

      // Update the business in our state
      setBusinesses(
        businesses.map((business) => {
          if (business.id === id) {
            return { ...business, ...businessData, lastUpdated: "just now" };
          }
          return business;
        }),
      );
    } catch (error) {
      console.error("Error editing business:", error);
    }
  };

  // Delete a business
  const handleDeleteBusiness = async (id: string) => {
    try {
      const { error } = await supabase.from("businesses").delete().eq("id", id);

      if (error) throw error;

      // Remove the business from our state
      setBusinesses(businesses.filter((business) => business.id !== id));
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };

  // Filter businesses based on search query and selected status
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      business.status.toLowerCase() === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate counts for each status
  const statusCounts = {
    all: businesses.length,
    researching: businesses.filter((b) => b.status === "Researching").length,
    contacting: businesses.filter((b) => b.status === "Contacting").length,
    negotiating: businesses.filter((b) => b.status === "Negotiating").length,
    partner: businesses.filter((b) => b.status === "Partner").length,
    inactive: businesses.filter((b) => b.status === "Inactive").length,
  };

  return (
    <div className="w-full bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Businesses
        </h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search businesses..."
              id="business_search"
              name="business_search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) =>
              value && setViewMode(value as "grid" | "list")
            }
          >
            <ToggleGroupItem value="grid" aria-label="Grid View">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List View">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={onAddBusiness} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Business
          </Button>
        </div>
      </div>

      <StatusFilter
        selectedStatus={selectedStatus as any}
        onStatusChange={(status) => setSelectedStatus(status)}
        counts={statusCounts}
      />

      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No businesses found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first business"}
          </p>
          <Button onClick={onAddBusiness}>
            <Plus className="mr-2 h-4 w-4" /> Add Business
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  id={business.id}
                  name={business.name}
                  status={business.status}
                  industry={business.industry}
                  location={business.location}
                  contactName={business.contactName}
                  contactEmail={business.contactEmail}
                  contactPhone={business.contactPhone}
                  lastUpdated={business.lastUpdated}
                  onEdit={(id) =>
                    onEditBusiness(id, (data) => handleEditBusiness(id, data))
                  }
                  onDelete={(id) => handleDeleteBusiness(id)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Industry</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Last Updated</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinesses.map((business) => (
                    <tr key={business.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{business.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            business.status === "Partner" &&
                              "bg-green-100 text-green-800",
                            business.status === "Negotiating" &&
                              "bg-yellow-100 text-yellow-800",
                            business.status === "Contacting" &&
                              "bg-blue-100 text-blue-800",
                            business.status === "Researching" &&
                              "bg-purple-100 text-purple-800",
                            business.status === "Inactive" &&
                              "bg-gray-100 text-gray-800",
                          )}
                        >
                          {business.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{business.industry || "-"}</td>
                      <td className="px-4 py-3">{business.location || "-"}</td>
                      <td className="px-4 py-3">
                        {business.lastUpdated || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onEditBusiness(business.id, (data) =>
                              handleEditBusiness(business.id, data),
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeleteBusiness(business.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessList;
