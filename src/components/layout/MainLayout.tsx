import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";

interface MainLayoutProps {
  isAdmin?: boolean;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
  children?: React.ReactNode;
}

const MainLayout = ({ notificationCount = 3, children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const userName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${collapsed ? "w-[70px]" : "w-[250px]"} transition-all duration-300 ease-in-out`}
      >
        <Sidebar isAdmin={isAdmin} onLogout={handleLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={userName}
          userEmail={userEmail}
          notificationCount={notificationCount}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children || <Outlet />}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Business Intelligence CRM. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
