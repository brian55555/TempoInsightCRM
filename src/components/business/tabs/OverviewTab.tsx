import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Building2, MapPin, Mail, Phone, User, Calendar } from "lucide-react";

interface OverviewTabProps {
  businessId: string;
}

interface BusinessDetails {
  name: string;
  status: string;
  industry?: string;
  location?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
  revenue?: number;
  number_of_employees?: number;
}

const OverviewTab = ({ businessId }: OverviewTabProps) => {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contactCount, setContactCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!businessId) return;

      try {
        setIsLoading(true);

        // Fetch business details
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .single();

        if (error) throw error;
        setBusiness(data);

        // Fetch contact count
        const { count: contactsCount, error: contactsError } = await supabase
          .from("contacts")
          .select("id", { count: "exact" })
          .eq("business_id", businessId);

        if (!contactsError) setContactCount(contactsCount || 0);

        // Fetch task count
        const { count: tasksCount, error: tasksError } = await supabase
          .from("tasks")
          .select("id", { count: "exact" })
          .eq("business_id", businessId);

        if (!tasksError) setTaskCount(tasksCount || 0);

        // Fetch document count
        const { count: docsCount, error: docsError } = await supabase
          .from("documents")
          .select("id", { count: "exact" })
          .eq("business_id", businessId);

        if (!docsError) setDocumentCount(docsCount || 0);
      } catch (error) {
        console.error("Error fetching business details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-center text-gray-500">Business details not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              {contactCount === 1 ? "Contact" : "Contacts"} associated with this
              business
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              {taskCount === 1 ? "Task" : "Tasks"} related to this business
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              {documentCount === 1 ? "Document" : "Documents"} uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Business Name</p>
              <div className="flex items-center">
                <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                <p>{business.name}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p>{business.status}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Annual Revenue
              </p>
              <p>
                {business.revenue
                  ? `${business.revenue.toLocaleString()}`
                  : "Not specified"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Number of Employees
              </p>
              <p>
                {business.number_of_employees
                  ? business.number_of_employees.toLocaleString()
                  : "Not specified"}
              </p>
            </div>

            {business.industry && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Industry</p>
                <p>{business.industry}</p>
              </div>
            )}

            {business.location && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <p>{business.location}</p>
                </div>
              </div>
            )}

            {business.description && (
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{business.description}</p>
              </div>
            )}
          </div>

          {(business.contact_name ||
            business.contact_email ||
            business.contact_phone) && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-md font-medium mb-3">Primary Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.contact_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <p>{business.contact_name}</p>
                    </div>
                  </div>
                )}

                {business.contact_email && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p>{business.contact_email}</p>
                    </div>
                  </div>
                )}

                {business.contact_phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p>{business.contact_phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-md font-medium mb-3">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Created</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p>{formatDate(business.created_at)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p>{formatDate(business.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
