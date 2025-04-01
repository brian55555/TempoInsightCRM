import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const ContactsPage = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Contacts</h1>
        <p className="text-gray-500">Your contacts will appear here.</p>
      </div>
    </MainLayout>
  );
};

export default ContactsPage;
