import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  ChevronDown,
  Edit,
  Share,
  Star,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

interface BusinessHeaderProps {
  businessId: string;
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
  onBusinessUpdate?: (data: any) => void;
}

const BusinessHeader = ({
  businessId,
  businessName = "Acme Corporation",
  status = "Researching",
  industry = "Technology",
  lastUpdated = "2 days ago",
  onStatusChange = () => {},
  onBusinessUpdate = () => {},
}: BusinessHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: businessName,
    status: status,
    industry: industry || "",
  });

  // Check if business is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !businessId) return;

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)
          .eq("business_id", businessId)
          .maybeSingle();

        if (error) throw error;
        setIsFavorite(!!data);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    checkFavorite();
  }, [businessId, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as any);
    onStatusChange(newStatus);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("businesses")
        .update({
          name: editFormData.name,
          industry: editFormData.industry,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId)
        .select()
        .single();

      if (error) throw error;

      onBusinessUpdate(data);
      toast({
        title: "Business updated",
        description: "Business information has been updated successfully.",
      });
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating business:", err);
      toast({
        title: "Update failed",
        description: "Failed to update business information.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async () => {
    if (!user || !businessId) return;

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("business_id", businessId);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Business has been removed from your favorites.",
        });
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          business_id: businessId,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Business has been added to your favorites.",
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast({
        title: "Action failed",
        description: "Failed to update favorites.",
        variant: "destructive",
      });
    }
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
    <div className="w-full p-6 bg-white border-b border-gray-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/businesses")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleFavorite}
            >
              <Star
                className={`h-5 w-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400 hover:text-yellow-400"}`}
              />
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {industry && (
              <Badge variant="outline" className="text-gray-600">
                {industry}
              </Badge>
            )}
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

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Business</DialogTitle>
                <DialogDescription>
                  Update the business information below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Business Name*
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </label>
                  <Input
                    id="industry"
                    name="industry"
                    value={editFormData.industry}
                    onChange={handleChange}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

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
