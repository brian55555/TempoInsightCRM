import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderPlus,
  Upload,
  FileText,
  Image,
  FileArchive,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

interface DocumentsTabProps {
  businessId?: string;
  businessName?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  lastModified: string;
  url: string;
}

const DocumentsTab = ({
  businessId = "123",
  businessName = "Acme Corporation",
}: DocumentsTabProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isConnectingGDrive, setIsConnectingGDrive] = useState(false);

  // Mock document categories
  const categories = [
    { id: "contracts", name: "Contracts" },
    { id: "proposals", name: "Proposals" },
    { id: "financials", name: "Financial Documents" },
    { id: "marketing", name: "Marketing Materials" },
    { id: "legal", name: "Legal Documents" },
  ];

  // Mock documents data
  const documents: Document[] = [
    {
      id: "doc1",
      name: "Partnership Agreement.pdf",
      type: "pdf",
      category: "contracts",
      size: "2.4 MB",
      lastModified: "2023-06-15",
      url: "#",
    },
    {
      id: "doc2",
      name: "Q2 Financial Report.xlsx",
      type: "excel",
      category: "financials",
      size: "1.8 MB",
      lastModified: "2023-05-30",
      url: "#",
    },
    {
      id: "doc3",
      name: "Marketing Proposal.docx",
      type: "word",
      category: "proposals",
      size: "3.2 MB",
      lastModified: "2023-06-02",
      url: "#",
    },
    {
      id: "doc4",
      name: "Product Brochure.pdf",
      type: "pdf",
      category: "marketing",
      size: "5.7 MB",
      lastModified: "2023-06-10",
      url: "#",
    },
    {
      id: "doc5",
      name: "Legal Disclaimer.pdf",
      type: "pdf",
      category: "legal",
      size: "0.8 MB",
      lastModified: "2023-04-22",
      url: "#",
    },
    {
      id: "doc6",
      name: "Company Logo.png",
      type: "image",
      category: "marketing",
      size: "1.2 MB",
      lastModified: "2023-03-15",
      url: "#",
    },
  ];

  // Filter documents based on active tab and search query
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get document icon based on type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <Image className="h-5 w-5 text-blue-500" />;
      case "excel":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "word":
        return <FileText className="h-5 w-5 text-blue-700" />;
      default:
        return <FileArchive className="h-5 w-5 text-gray-500" />;
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    // Placeholder for file upload logic
    setIsUploadDialogOpen(false);
  };

  // Handle Google Drive connection
  const handleConnectGDrive = () => {
    // Placeholder for Google Drive API connection
    setIsConnectingGDrive(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnectingGDrive(false);
      setIsUploadDialogOpen(false);
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {businessName} Documents
          </h2>
          <p className="text-gray-500">
            Manage and organize documents for this business
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document from your computer or connect to Google
                  Drive
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleConnectGDrive}
                  disabled={isConnectingGDrive}
                  className="flex items-center gap-2"
                >
                  {isConnectingGDrive ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Connect to Google Drive
                    </>
                  )}
                </Button>
                <Button onClick={handleFileUpload}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your documents
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input id="folderName" placeholder="Enter folder name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parentFolder">Parent Folder (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Root</SelectItem>
                      <SelectItem value="contracts">Contracts</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="p-3">
                  <div
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer mb-1 ${selectedCategory === "all" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    <div className="flex items-center">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <span>All Documents</span>
                    </div>
                    <Badge variant="outline">{documents.length}</Badge>
                  </div>

                  <Separator className="my-2" />

                  {categories.map((category) => {
                    const count = documents.filter(
                      (doc) => doc.category === category.id,
                    ).length;
                    return (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer mb-1 ${selectedCategory === category.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                {selectedCategory === "all"
                  ? "All Documents"
                  : categories.find((c) => c.id === selectedCategory)?.name ||
                    "Documents"}
              </CardTitle>
              <CardDescription>
                {filteredDocuments.length} document
                {filteredDocuments.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-1">
                  {filteredDocuments.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="pb-2 font-medium">Name</th>
                          <th className="pb-2 font-medium">Category</th>
                          <th className="pb-2 font-medium">Size</th>
                          <th className="pb-2 font-medium">Last Modified</th>
                          <th className="pb-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => (
                          <tr
                            key={doc.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3">
                              <div className="flex items-center">
                                {getDocumentIcon(doc.type)}
                                <span className="ml-2">{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3">
                              {
                                categories.find((c) => c.id === doc.category)
                                  ?.name
                              }
                            </td>
                            <td className="py-3">{doc.size}</td>
                            <td className="py-3">{doc.lastModified}</td>
                            <td className="py-3 text-right">
                              <TooltipProvider>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Download this document</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TooltipProvider>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No documents found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery
                          ? "Try a different search term"
                          : "Upload your first document to get started"}
                      </p>
                      <Button
                        onClick={() => setIsUploadDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
