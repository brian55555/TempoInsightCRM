import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BusinessHeader from "@/components/business/BusinessHeader";
import BusinessTabs from "@/components/business/BusinessTabs";

interface BusinessProfileProps {
  businessId?: string;
  businessName?: string;
  status?:
    | "Researching"
    | "Contacting"
    | "Negotiating"
    | "Partner"
    | "Inactive";
  industry?: string;
  lastUpdated?: string;
}

const BusinessProfile = ({
  businessId: propBusinessId,
  businessName = "Acme Corporation",
  status = "Researching",
  industry = "Technology",
  lastUpdated = "2 days ago",
}: BusinessProfileProps) => {
  const params = useParams();
  const businessId = propBusinessId || params.id || "1";
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading business data from API
    const loadBusinessData = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch data from your API here
        // const response = await fetch(`/api/businesses/${businessId}`);
        // const data = await response.json();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // If successful, update state with the fetched data
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load business data. Please try again.");
        setIsLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId]);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(
      newStatus as
        | "Researching"
        | "Contacting"
        | "Negotiating"
        | "Partner"
        | "Inactive",
    );
    // In a real app, you would update the status in your backend here
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <BusinessHeader
        businessName={businessName}
        status={currentStatus}
        industry={industry}
        lastUpdated={lastUpdated}
        onStatusChange={handleStatusChange}
      />
      <BusinessTabs
        businessId={businessId}
        businessName={businessName}
        defaultTab="overview"
      />
    </div>
  );
};

export default BusinessProfile;
