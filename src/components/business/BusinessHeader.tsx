import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Share, Star, MoreHorizontal } from "lucide-react";

interface BusinessHeaderProps {
  businessName?: string;
  status?:
    | "Researching"
    | "Contacting"
    | "Negotiating"
    | "Partner"
    | "Inactive";
  industry?: string;
  lastUpdated?: string;
  onStatusChange?: (status: string) => void;
}

const BusinessHeader = ({
  businessName = "Acme Corporation",
  status = "Researching",
  industry = "Technology",
  lastUpdated = "2 days ago",
  onStatusChange = () => {},
}: BusinessHeaderProps) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as any);
    onStatusChange(newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Researching":
        return "bg-blue-100 text-blue-800";
      case "Contacting":
        return "bg-yellow-100 text-yellow-800";
      case "Negotiating":
        return "bg-purple-100 text-purple-800";
      case "Partner":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full p-6 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-gray-600">
              {industry}
            </Badge>
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${getStatusColor(currentStatus).split(" ")[0]}`}
                ></span>
                {currentStatus}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleStatusChange("Researching")}
              >
                <span className="inline-block w-3 h-3 rounded-full bg-blue-100 mr-2"></span>
                Researching
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Contacting")}
              >
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-100 mr-2"></span>
                Contacting
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Negotiating")}
              >
                <span className="inline-block w-3 h-3 rounded-full bg-purple-100 mr-2"></span>
                Negotiating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Partner")}>
                <span className="inline-block w-3 h-3 rounded-full bg-green-100 mr-2"></span>
                Partner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Inactive")}>
                <span className="inline-block w-3 h-3 rounded-full bg-gray-100 mr-2"></span>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Print Profile</DropdownMenuItem>
              <DropdownMenuItem>Archive Business</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Annual Revenue</h3>
          <p className="text-xl font-semibold mt-1">$4.2M</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Employees</h3>
          <p className="text-xl font-semibold mt-1">126</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Location</h3>
          <p className="text-xl font-semibold mt-1">San Francisco, CA</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Open Tasks</h3>
          <p className="text-xl font-semibold mt-1">8</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;
