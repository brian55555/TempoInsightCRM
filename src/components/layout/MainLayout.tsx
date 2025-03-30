import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  isAdmin?: boolean;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
}

const MainLayout = ({
  isAdmin = false,
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  notificationCount = 3,
}: MainLayoutProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    // This would typically include authentication logic
    console.log("User logged out");
    navigate("/auth/login");
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
          <Outlet />
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
