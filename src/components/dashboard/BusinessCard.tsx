import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

type BusinessStatus =
  | "Researching"
  | "Contacting"
  | "Negotiating"
  | "Partner"
  | "Inactive";

interface BusinessCardProps {
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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getStatusColor = (status: BusinessStatus) => {
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

const BusinessCard = ({
  id = "business-1",
  name = "Acme Corporation",
  status = "Researching",
  logo = "",
  industry = "Technology",
  location = "San Francisco, CA",
  contactName = "John Doe",
  contactEmail = "john@acmecorp.com",
  contactPhone = "(555) 123-4567",
  lastUpdated = "2 days ago",
  onEdit = () => {},
  onDelete = () => {},
}: BusinessCardProps) => {
  return (
    <Card className="w-full max-w-md bg-white overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={logo} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          {location && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
          {contactName && (
            <div className="pt-2">
              <p className="text-sm font-medium">Primary Contact</p>
              <p className="text-sm">{contactName}</p>
              {contactEmail && (
                <div className="flex items-center text-sm mt-1">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {contactEmail}
                  </a>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center text-sm mt-1">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${contactPhone}`}
                    className="text-primary hover:underline"
                  >
                    {contactPhone}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3 pb-3">
        <p className="text-xs text-muted-foreground">Updated {lastUpdated}</p>
        <Link to={`/business/${id}`}>
          <Button variant="outline" size="sm" className="gap-1">
            <span>View Details</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BusinessCard;
