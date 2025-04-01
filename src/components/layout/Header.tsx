import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
}

const Header = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  notificationCount = 3,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("name")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
            return;
          }

          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error in fetchUserData:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Use user data from the users table if available
  const displayName =
    userData?.name || (user ? user.user_metadata?.name || userName : userName);
  const displayEmail = user ? user.email || userEmail : userEmail;

  return (
    <header className="w-full h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            name="global_search"
            id="global_search"
          />
          <Input
            type="text"
            placeholder="Search businesses, contacts, or documents..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                  alt={displayName}
                />
                <AvatarFallback>
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-1">
                  <p className="font-medium">{displayName}</p>
                  {isAdmin ? (
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-100 text-purple-800 border-purple-200"
                    >
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                    >
                      <User className="h-3 w-3 mr-1" /> User
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{displayEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
