import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Users,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  Star,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type BusinessStatus =
  | "Researching"
  | "Contacting"
  | "Negotiating"
  | "Partner"
  | "Inactive";

interface FavoriteBusiness {
  id: string;
  name: string;
  status: BusinessStatus;
}

interface SidebarProps {
  isAdmin?: boolean;
  onLogout?: () => void;
  favoriteBusinesses?: FavoriteBusiness[];
}

const Sidebar = ({
  isAdmin = false,
  onLogout,
  favoriteBusinesses: initialFavorites = [],
}: SidebarProps) => {
  const location = useLocation();
  const { user, signOut, isAdmin: authIsAdmin } = useAuth();
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<
    FavoriteBusiness[]
  >([]);

  // Use isAdmin from auth context if available
  const userIsAdmin = isAdmin || authIsAdmin;

  // Fetch favorite businesses from Supabase
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        console.log("Fetching favorites for user:", user.id);
        // Get user's favorites
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("business_id")
          .eq("user_id", user.id);

        if (favoritesError) throw favoritesError;

        console.log("Favorites data:", favoritesData);

        if (favoritesData && favoritesData.length > 0) {
          // Get details of favorite businesses
          const businessIds = favoritesData.map((fav) => fav.business_id);

          const { data: businessesData, error: businessesError } =
            await supabase
              .from("businesses")
              .select("id, name, status")
              .in("id", businessIds);

          if (businessesError) throw businessesError;

          console.log("Favorite businesses data:", businessesData);

          if (businessesData) {
            setFavoriteBusinesses(
              businessesData.map((business) => ({
                id: business.id,
                name: business.name,
                status: business.status as BusinessStatus,
              })),
            );
          }
        } else {
          setFavoriteBusinesses([]);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      if (onLogout) {
        onLogout();
      } else {
        await signOut();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
      exact: true,
    },
    {
      name: "Businesses",
      icon: <Building2 className="h-5 w-5" />,
      path: "/businesses",
      exact: false,
    },
    {
      name: "Contacts",
      icon: <Users className="h-5 w-5" />,
      path: "/contacts",
      exact: false,
    },
    {
      name: "Tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      path: "/tasks",
      exact: false,
    },
    {
      name: "Documents",
      icon: <FileText className="h-5 w-5" />,
      path: "/documents",
      exact: false,
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get status color based on business status
  const getStatusColor = (status: BusinessStatus) => {
    switch (status) {
      case "Researching":
        return "bg-purple-100 text-purple-800";
      case "Contacting":
        return "bg-blue-100 text-blue-800";
      case "Negotiating":
        return "bg-yellow-100 text-yellow-800";
      case "Partner":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full w-[250px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Insight CRM</h1>
        <p className="text-sm text-gray-500">Intelligence Platform</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md hover:bg-gray-100",
                  isActive(item.path, item.exact) &&
                    "bg-blue-50 text-blue-600 font-medium",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}

          {/* Favorites Section */}
          <li className="mt-6">
            <Collapsible
              open={favoritesOpen}
              onOpenChange={setFavoritesOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between px-3 py-2 text-left",
                    "border-t border-gray-200 pt-4",
                  )}
                >
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="ml-3 font-medium">Favorites</span>
                  </div>
                  {favoritesOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-9 space-y-1">
                {favoriteBusinesses.length > 0 ? (
                  favoriteBusinesses.map((business) => (
                    <Link
                      key={business.id}
                      to={`/business/${business.id}`}
                      className={cn(
                        "flex flex-col px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                        isActive(`/business/${business.id}`, true) &&
                          "bg-blue-50 text-blue-600",
                      )}
                    >
                      <span className="font-medium">{business.name}</span>
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block w-fit",
                          getStatusColor(business.status),
                        )}
                      >
                        {business.status}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 py-2">
                    No favorite businesses yet
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </li>

          {/* Admin Section */}
          {userIsAdmin && (
            <li className="mt-6 border-t border-gray-200 pt-4">
              <Link
                to="/admin"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md hover:bg-gray-100",
                  isActive("/admin") && "bg-blue-50 text-blue-600 font-medium",
                )}
              >
                <ShieldAlert className="h-5 w-5" />
                <span className="ml-3">Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 text-sm text-gray-500 flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          {user?.email}{" "}
          {userIsAdmin && (
            <span className="ml-1 text-xs font-medium bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
