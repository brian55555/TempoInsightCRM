import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/OverviewTab";
import ContactsTab from "./tabs/ContactsTab";
import TasksTab from "./tabs/TasksTab";
import DocumentsTab from "./tabs/DocumentsTab";
import NotesTab from "./tabs/NotesTab";

type BusinessStatus =
  | "Researching"
  | "Contacting"
  | "Negotiating"
  | "Partner"
  | "Inactive";

interface Business {
  id: string;
  name: string;
  status: BusinessStatus;
  industry?: string;
  location?: string;
  description?: string;
  notes?: string;
}

interface BusinessTabsProps {
  businessId: string;
  businessName?: string;
  defaultTab?: string;
  onUpdateBusiness?: (updatedBusiness: Partial<Business>) => void;
}

const BusinessTabs: React.FC<BusinessTabsProps> = ({
  businessId,
  businessName = "Acme Corporation",
  defaultTab = "overview",
  onUpdateBusiness = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleUpdateNotes = (notes: string) => {
    onUpdateBusiness({ notes });
  };

  return (
    <div className="w-full bg-white">
      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-transparent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 p-0">
          <OverviewTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="contacts" className="mt-0 p-0">
          <ContactsTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-0 p-0">
          <TasksTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="documents" className="mt-0 p-0">
          <DocumentsTab businessId={businessId} businessName={businessName} />
        </TabsContent>

        <TabsContent value="notes" className="mt-0 p-0">
          <NotesTab businessId={businessId} onUpdateNotes={handleUpdateNotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessTabs;
