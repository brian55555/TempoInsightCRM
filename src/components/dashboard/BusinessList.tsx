import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import BusinessCard from "./BusinessCard";
import StatusFilter from "./StatusFilter";
import { cn } from "@/lib/utils";

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
  businesses = [
    {
      id: "business-1",
      name: "Acme Corporation",
      status: "Researching",
      industry: "Technology",
      location: "San Francisco, CA",
      contactName: "John Doe",
      contactEmail: "john@acmecorp.com",
      contactPhone: "(555) 123-4567",
      lastUpdated: "2 days ago",
    },
    {
      id: "business-2",
      name: "Globex Industries",
      status: "Contacting",
      industry: "Manufacturing",
      location: "Chicago, IL",
      contactName: "Jane Smith",
      contactEmail: "jane@globex.com",
      contactPhone: "(555) 987-6543",
      lastUpdated: "1 week ago",
    },
    {
      id: "business-3",
      name: "Stark Enterprises",
      status: "Negotiating",
      industry: "Energy",
      location: "New York, NY",
      contactName: "Tony Stark",
      contactEmail: "tony@stark.com",
      contactPhone: "(555) 111-2222",
      lastUpdated: "3 days ago",
    },
    {
      id: "business-4",
      name: "Wayne Industries",
      status: "Partner",
      industry: "Defense",
      location: "Gotham City",
      contactName: "Bruce Wayne",
      contactEmail: "bruce@wayne.com",
      contactPhone: "(555) 333-4444",
      lastUpdated: "1 day ago",
    },
    {
      id: "business-5",
      name: "Umbrella Corporation",
      status: "Inactive",
      industry: "Pharmaceuticals",
      location: "Raccoon City",
      contactName: "Albert Wesker",
      contactEmail: "wesker@umbrella.com",
      contactPhone: "(555) 666-7777",
      lastUpdated: "1 month ago",
    },
    {
      id: "business-6",
      name: "Oscorp Industries",
      status: "Researching",
      industry: "Biotechnology",
      location: "New York, NY",
      contactName: "Norman Osborn",
      contactEmail: "norman@oscorp.com",
      contactPhone: "(555) 888-9999",
      lastUpdated: "5 days ago",
    },
  ],
  onAddBusiness = () => {},
  onEditBusiness = () => {},
  onDeleteBusiness = () => {},
}: BusinessListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
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
              onEdit={onEditBusiness}
              onDelete={onDeleteBusiness}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessList;
