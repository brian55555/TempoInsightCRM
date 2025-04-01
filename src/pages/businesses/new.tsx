import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

const NewBusinessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "Researching",
    industry: "",
    location: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    revenue: "",
    numberOfEmployees: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error(
        "No user found. User must be logged in to create a business.",
      );
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a business.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const insertData = {
        name: formData.name,
        status: formData.status,
        industry: formData.industry || null,
        location: formData.location || null,
        contact_name: formData.contactName || null,
        contact_email: formData.contactEmail || null,
        contact_phone: formData.contactPhone || null,
        description: formData.description || null,
        revenue: formData.revenue ? parseFloat(formData.revenue) : null,
        number_of_employees: formData.numberOfEmployees
          ? parseInt(formData.numberOfEmployees, 10)
          : null,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Inserting business with data:", insertData);
      console.log("User ID:", user.id);

      const { data, error } = await supabase
        .from("businesses")
        .insert([insertData])
        .select();

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      console.log("Business created successfully:", data);

      toast({
        title: "Business created",
        description: `${formData.name} has been added successfully.`,
      });

      navigate("/businesses");
    } catch (error: any) {
      console.error("Error creating business:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Add New Business</h1>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Business Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status*
                </label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Researching">Researching</SelectItem>
                    <SelectItem value="Contacting">Contacting</SelectItem>
                    <SelectItem value="Negotiating">Negotiating</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter business description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="industry" className="text-sm font-medium">
                  Industry
                </label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Technology, Healthcare, Finance"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="revenue" className="text-sm font-medium">
                  Annual Revenue
                </label>
                <Input
                  id="revenue"
                  name="revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={handleChange}
                  placeholder="Annual revenue in dollars"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="numberOfEmployees"
                  className="text-sm font-medium"
                >
                  Number of Employees
                </label>
                <Input
                  id="numberOfEmployees"
                  name="numberOfEmployees"
                  type="number"
                  value={formData.numberOfEmployees}
                  onChange={handleChange}
                  placeholder="Number of employees"
                />
              </div>

              <div className="pt-4">
                <h3 className="text-md font-medium mb-2">Primary Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="contactName"
                      className="text-sm font-medium"
                    >
                      Contact Name
                    </label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contactEmail"
                      className="text-sm font-medium"
                    >
                      Email
                    </label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contactPhone"
                      className="text-sm font-medium"
                    >
                      Phone
                    </label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/businesses")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Business"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
};

export default NewBusinessPage;
