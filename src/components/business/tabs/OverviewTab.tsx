import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Save,
  X,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Building,
} from "lucide-react";

interface BusinessOverviewProps {
  business?: {
    id: string;
    name: string;
    status:
      | "Researching"
      | "Contacting"
      | "Negotiating"
      | "Partner"
      | "Inactive";
    website: string;
    industry: string;
    description: string;
    foundedYear: number;
    employeeCount: string;
    revenue: string;
    address: string;
    phone: string;
    email: string;
    lastContactDate: string;
  };
}

const statusColors = {
  Researching: "bg-blue-100 text-blue-800",
  Contacting: "bg-yellow-100 text-yellow-800",
  Negotiating: "bg-purple-100 text-purple-800",
  Partner: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-800",
};

const defaultBusiness = {
  id: "1",
  name: "Acme Corporation",
  status: "Researching" as const,
  website: "https://www.acmecorp.com",
  industry: "Technology",
  description:
    "Acme Corporation is a fictional company that manufactures everything from portable holes to rocket-powered products.",
  foundedYear: 1952,
  employeeCount: "1,000-5,000",
  revenue: "$50M-$100M",
  address: "123 Acme Road, Anytown, USA",
  phone: "(555) 123-4567",
  email: "info@acmecorp.com",
  lastContactDate: "2023-06-15",
};

const OverviewTab: React.FC<BusinessOverviewProps> = ({
  business = defaultBusiness,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState(business);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving business data:", editedBusiness);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBusiness(business);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Overview</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit Details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="default"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core details about the business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={editedBusiness.name}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="text-lg font-medium">{business.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div>
                <Badge
                  className={`${statusColors[business.status]} px-3 py-1 text-xs`}
                >
                  {business.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              {isEditing ? (
                <Input
                  id="industry"
                  name="industry"
                  value={editedBusiness.industry}
                  onChange={handleInputChange}
                />
              ) : (
                <div>{business.industry}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  name="description"
                  value={editedBusiness.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              ) : (
                <div className="text-sm text-gray-600">
                  {business.description}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How to reach this business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                Website
              </Label>
              {isEditing ? (
                <Input
                  id="website"
                  name="website"
                  value={editedBusiness.website}
                  onChange={handleInputChange}
                />
              ) : (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {business.website}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  name="phone"
                  value={editedBusiness.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <div>{business.phone}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  value={editedBusiness.email}
                  onChange={handleInputChange}
                />
              ) : (
                <a
                  href={`mailto:${business.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {business.email}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Address
              </Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  name="address"
                  value={editedBusiness.address}
                  onChange={handleInputChange}
                  rows={2}
                />
              ) : (
                <div>{business.address}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>
              More information about the business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Founded Year
              </Label>
              {isEditing ? (
                <Input
                  id="foundedYear"
                  name="foundedYear"
                  type="number"
                  value={editedBusiness.foundedYear}
                  onChange={handleInputChange}
                />
              ) : (
                <div>{business.foundedYear}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Employee Count
              </Label>
              {isEditing ? (
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  value={editedBusiness.employeeCount}
                  onChange={handleInputChange}
                />
              ) : (
                <div>{business.employeeCount}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Annual Revenue
              </Label>
              {isEditing ? (
                <Input
                  id="revenue"
                  name="revenue"
                  value={editedBusiness.revenue}
                  onChange={handleInputChange}
                />
              ) : (
                <div>{business.revenue}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Last Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Information</CardTitle>
            <CardDescription>Tracking your interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Last Contact Date
              </Label>
              {isEditing ? (
                <Input
                  id="lastContactDate"
                  name="lastContactDate"
                  type="date"
                  value={editedBusiness.lastContactDate}
                  onChange={handleInputChange}
                />
              ) : (
                <div>
                  {new Date(business.lastContactDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  No recent activity recorded. Activities will appear here when
                  logged.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Log New Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
