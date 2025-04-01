import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import BusinessList from "@/components/dashboard/BusinessList";

const BusinessesPage = () => {
  const navigate = useNavigate();

  const handleAddBusiness = () => {
    navigate("/businesses/new");
  };

  const handleEditBusiness = (id: string) => {
    navigate(`/business/${id}`);
  };

  const handleDeleteBusiness = (id: string) => {
    console.log(`Delete business ${id} clicked`);
  };

  return (
    <MainLayout>
      <BusinessList
        onAddBusiness={handleAddBusiness}
        onEditBusiness={handleEditBusiness}
        onDeleteBusiness={handleDeleteBusiness}
      />
    </MainLayout>
  );
};

export default BusinessesPage;
