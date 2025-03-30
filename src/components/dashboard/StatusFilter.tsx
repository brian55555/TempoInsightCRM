import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BusinessStatus =
  | "all"
  | "researching"
  | "contacting"
  | "negotiating"
  | "partner"
  | "inactive";

interface StatusFilterProps {
  selectedStatus?: BusinessStatus;
  onStatusChange?: (status: BusinessStatus) => void;
  counts?: Record<BusinessStatus, number>;
}

const StatusFilter = ({
  selectedStatus = "all",
  onStatusChange = () => {},
  counts = {
    all: 24,
    researching: 8,
    contacting: 5,
    negotiating: 3,
    partner: 6,
    inactive: 2,
  },
}: StatusFilterProps) => {
  const statusColors: Record<BusinessStatus, string> = {
    all: "bg-gray-100",
    researching: "bg-blue-100 text-blue-800",
    contacting: "bg-yellow-100 text-yellow-800",
    negotiating: "bg-purple-100 text-purple-800",
    partner: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<BusinessStatus, string> = {
    all: "All Businesses",
    researching: "Researching",
    contacting: "Contacting",
    negotiating: "Negotiating",
    partner: "Partner",
    inactive: "Inactive",
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Business Status
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue={selectedStatus}
        className="w-full"
        onValueChange={(value) => onStatusChange(value as BusinessStatus)}
      >
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(statusLabels).map(([status, label]) => (
            <TabsTrigger
              key={status}
              value={status as BusinessStatus}
              className="flex justify-between items-center"
            >
              <span>{label}</span>
              <Badge
                className={`ml-2 ${statusColors[status as BusinessStatus]}`}
              >
                {counts[status as BusinessStatus]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 flex flex-wrap gap-2 md:hidden">
        {Object.entries(statusLabels).map(([status, label]) => (
          <Badge
            key={status}
            className={`cursor-pointer ${status === selectedStatus ? statusColors[status as BusinessStatus] : "bg-gray-100"}`}
            onClick={() => onStatusChange(status as BusinessStatus)}
          >
            {label}: {counts[status as BusinessStatus]}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
