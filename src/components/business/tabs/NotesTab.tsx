import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Image,
  Plus,
  Search,
  Folder,
  MoreVertical,
  Edit,
  Trash2,
  FilePlus,
  FolderPlus,
  FileImage,
  File,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

interface NotesTabProps {
  businessId?: string;
  notes?: Note[];
  categories?: Category[];
}

const NotesTab = ({
  businessId = "business-123",
  notes = [
    {
      id: "note-1",
      title: "Initial Contact Notes",
      content:
        "<p>Met with CEO John Smith to discuss potential partnership opportunities.</p><p>Key points:</p><ul><li>Interested in our enterprise solution</li><li>Current contract with competitor expires in 3 months</li><li>Budget constraints may require phased implementation</li></ul>",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2023-06-15T11:45:00Z",
      category: "meetings",
    },
    {
      id: "note-2",
      title: "Product Demo Follow-up",
      content:
        "<p>Conducted virtual product demo with their technical team.</p><p>Feedback:</p><ul><li>Impressed with dashboard analytics</li><li>Requested additional information on API integration</li><li>Concerned about migration timeline</li></ul>",
      createdAt: "2023-06-20T14:00:00Z",
      updatedAt: "2023-06-20T15:30:00Z",
      category: "demos",
    },
    {
      id: "note-3",
      title: "Competitive Analysis",
      content:
        "<p>Research on competitor offerings and how our solution compares:</p><table><tr><th>Feature</th><th>Our Solution</th><th>Competitor A</th><th>Competitor B</th></tr><tr><td>Price</td><td>$$$</td><td>$$$$</td><td>$$</td></tr><tr><td>Support</td><td>24/7</td><td>Business hours</td><td>Email only</td></tr></table>",
      createdAt: "2023-06-25T09:15:00Z",
      updatedAt: "2023-06-26T11:20:00Z",
      category: "research",
    },
  ],
  categories = [
    { id: "cat-1", name: "meetings" },
    { id: "cat-2", name: "demos" },
    { id: "cat-3", name: "research" },
    { id: "cat-4", name: "proposals" },
  ],
}: NotesTabProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateNoteDialogOpen, setIsCreateNoteDialogOpen] = useState(false);

  // Filter notes based on search query and selected category
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? note.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Mock rich text editor content (in a real app, this would be a proper rich text editor)
  const renderRichTextEditor = () => {
    if (!selectedNote) return null;

    return (
      <div className="p-4 bg-white rounded-md border border-gray-200 min-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={selectedNote.title}
            className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
            readOnly
          />
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Insert Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <File className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Embed PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* This would be replaced with an actual rich text editor component */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedNote.content }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Notes</h2>
          <div className="flex gap-2">
            <Dialog
              open={isCreateNoteDialogOpen}
              onOpenChange={setIsCreateNoteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Input placeholder="Note Title" className="w-full" />
                  </div>
                  <div className="grid gap-2">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <textarea
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Note content..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Note</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Input placeholder="Category Name" className="w-full" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Create Category</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex gap-6 h-full">
          {/* Left sidebar with notes list */}
          <div className="w-1/3 flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="all">All Notes</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[600px] pr-4">
                  {filteredNotes.length > 0 ? (
                    <div className="space-y-2">
                      {filteredNotes.map((note) => (
                        <Card
                          key={note.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedNote?.id === note.id ? "border-primary" : ""}`}
                          onClick={() => setSelectedNote(note)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-sm">
                                {note.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(note.updatedAt).toLocaleDateString()}{" "}
                                · {note.category}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No notes found</p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory(null);
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedCategory === category.name ? "border-primary" : ""}`}
                        onClick={() => {
                          if (selectedCategory === category.name) {
                            setSelectedCategory(null);
                          } else {
                            setSelectedCategory(category.name);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Folder className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium text-sm">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {
                              notes.filter(
                                (note) => note.category === category.name,
                              ).length
                            }{" "}
                            notes
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right content area with rich text editor */}
          <div className="w-2/3">
            {selectedNote ? (
              renderRichTextEditor()
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No note selected
                </h3>
                <p className="text-gray-500 mb-4">
                  Select a note from the list or create a new one
                </p>
                <Button onClick={() => setIsCreateNoteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesTab;
