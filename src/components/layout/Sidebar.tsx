import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
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

interface SidebarProps {
  isAdmin?: boolean;
  onLogout?: () => void;
}

const Sidebar = ({ isAdmin = false, onLogout = () => {} }: SidebarProps) => {
  const location = useLocation();
  const [businessesOpen, setBusinessesOpen] = useState(true);

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
      hasSubmenu: true,
      submenu: [
        { name: "All Businesses", path: "/businesses" },
        { name: "Researching", path: "/businesses?status=researching" },
        { name: "Contacting", path: "/businesses?status=contacting" },
        { name: "Negotiating", path: "/businesses?status=negotiating" },
        { name: "Partner", path: "/businesses?status=partner" },
        { name: "Inactive", path: "/businesses?status=inactive" },
      ],
    },
    {
      name: "Contacts",
      icon: <Users className="h-5 w-5" />,
      path: "/contacts",
    },
    {
      name: "Tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      path: "/tasks",
    },
    {
      name: "Documents",
      icon: <FileText className="h-5 w-5" />,
      path: "/documents",
    },
  ];

  const adminItems = [
    {
      name: "Admin",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin",
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full w-[250px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Business CRM</h1>
        <p className="text-sm text-gray-500">Intelligence Platform</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (item.hasSubmenu) {
              return (
                <li key={item.name}>
                  <Collapsible
                    open={businessesOpen}
                    onOpenChange={setBusinessesOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between px-3 py-2 text-left",
                          isActive(item.path) && "bg-blue-50 text-blue-600",
                        )}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </div>
                        {businessesOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-9 space-y-1">
                      {item.submenu?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                            isActive(subItem.path, true) &&
                              "bg-blue-50 text-blue-600 font-medium",
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              );
            }

            return (
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
            );
          })}

          {isAdmin &&
            adminItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-gray-100",
                    isActive(item.path) &&
                      "bg-blue-50 text-blue-600 font-medium",
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-red-600"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign out of your account</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
