import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import BusinessHeader from "@/components/business/BusinessHeader";
import BusinessTabs from "@/components/business/BusinessTabs";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

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
  industry?: string;
  location?: string;
  description?: string;
  lastUpdated?: string;
  notes?: string;
}

const BusinessProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching business with ID:", id);
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching business:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Business not found");
        }

        console.log("Business data fetched:", data);

        // Format the lastUpdated date
        const formattedLastUpdated = data.updated_at
          ? formatDistanceToNow(new Date(data.updated_at), { addSuffix: true })
          : "Unknown";

        // Transform the data to match our Business interface
        const businessData: Business = {
          id: data.id,
          name: data.name,
          status: data.status as BusinessStatus,
          industry: data.industry,
          location: data.location,
          description: data.description,
          lastUpdated: formattedLastUpdated,
          notes: data.notes,
        };

        setBusiness(businessData);
      } catch (err: any) {
        console.error("Error in fetchBusiness:", err);
        setError(err.message || "Failed to load business details");
        toast({
          title: "Error",
          description: err.message || "Failed to load business details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  const handleUpdateBusiness = async (updatedData: Partial<Business>) => {
    if (!id || !business) return;

    try {
      console.log("Updating business with data:", updatedData);

      // Convert from our frontend model to the database model
      const dbBusiness = {
        name: updatedData.name,
        status: updatedData.status,
        industry: updatedData.industry,
        location: updatedData.location,
        description: updatedData.description,
        notes: updatedData.notes,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("businesses")
        .update(dbBusiness)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating business:", error);
        throw error;
      }

      console.log("Business updated successfully:", data);

      // Update the local state with the new data
      if (data && data[0]) {
        // Format the lastUpdated date
        const formattedLastUpdated = data[0].updated_at
          ? formatDistanceToNow(new Date(data[0].updated_at), {
              addSuffix: true,
            })
          : "Unknown";

        const updatedBusiness: Business = {
          ...business,
          ...{
            name: data[0].name,
            status: data[0].status as BusinessStatus,
            industry: data[0].industry,
            location: data[0].location,
            description: data[0].description,
            lastUpdated: formattedLastUpdated,
            notes: data[0].notes,
          },
        };
        setBusiness(updatedBusiness);
      }

      toast({
        title: "Business updated",
        description: "Business details have been updated successfully.",
      });
    } catch (err: any) {
      console.error("Error in handleUpdateBusiness:", err);
      toast({
        title: "Update failed",
        description: err.message || "Failed to update business details",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !business) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Business not found"}
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn't find the business you're looking for.
          </p>
          <button
            onClick={() => navigate("/businesses")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Businesses
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto">
        <BusinessHeader
          businessId={business.id}
          businessName={business.name}
          status={business.status}
          industry={business.industry}
          lastUpdated={business.lastUpdated}
          onStatusChange={(status) =>
            handleUpdateBusiness({ status: status as BusinessStatus })
          }
          onBusinessUpdate={(data) => {
            // Format the lastUpdated date
            const formattedLastUpdated = data.updated_at
              ? formatDistanceToNow(new Date(data.updated_at), {
                  addSuffix: true,
                })
              : business.lastUpdated;

            setBusiness({
              ...business,
              name: data.name,
              industry: data.industry,
              lastUpdated: formattedLastUpdated,
            });
          }}
        />
        <BusinessTabs
          businessId={business.id}
          businessName={business.name}
          defaultTab="overview"
          onUpdateBusiness={handleUpdateBusiness}
        />
      </div>
    </MainLayout>
  );
};

export default BusinessProfile;
