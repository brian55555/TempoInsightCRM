import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ContactsTabProps {
  businessId: string;
}

interface Contact {
  id: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  company?: string;
  business_id: string;
  notes?: string;
}

interface Business {
  id: string;
  name: string;
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactsTab: React.FC<ContactsTabProps> = ({ businessId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);

  const addForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  });

  const editForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  });

  useEffect(() => {
    fetchContacts();
    fetchBusinesses();
    fetchCurrentBusiness();
  }, [businessId]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("business_id", businessId);

      if (error) {
        throw error;
      }

      setContacts(data || []);
    } catch (error: any) {
      console.error("Error fetching contacts:", error.message);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name");

      if (error) {
        throw error;
      }

      setBusinesses(data || []);
    } catch (error: any) {
      console.error("Error fetching businesses:", error.message);
    }
  };

  const fetchCurrentBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("id", businessId)
        .single();

      if (error) {
        throw error;
      }

      setCurrentBusiness(data);
    } catch (error: any) {
      console.error("Error fetching current business:", error.message);
    }
  };

  const handleAddSubmit = async (values: ContactFormValues) => {
    try {
      const { data, error } = await supabase.from("contacts").insert([
        {
          ...values,
          business_id: businessId,
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Contact added",
        description: "The contact has been added successfully.",
      });

      setIsAddDialogOpen(false);
      addForm.reset();
      fetchContacts();
    } catch (error: any) {
      console.error("Error adding contact:", error.message);
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    setCurrentContact(contact);
    editForm.reset({
      name: contact.name,
      title: contact.title || "",
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
      notes: contact.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (values: ContactFormValues) => {
    if (!currentContact) return;

    try {
      const { data, error } = await supabase
        .from("contacts")
        .update(values)
        .eq("id", currentContact.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Contact updated",
        description: "The contact has been updated successfully.",
      });

      setIsEditDialogOpen(false);
      fetchContacts();
    } catch (error: any) {
      console.error("Error updating contact:", error.message);
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!currentContact) return;

    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", currentContact.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Contact deleted",
        description: "The contact has been deleted successfully.",
      });

      setIsDeleteDialogOpen(false);
      fetchContacts();
    } catch (error: any) {
      console.error("Error deleting contact:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contacts</h2>
        <Button
          onClick={() => {
            // Reset form and pre-select current business
            addForm.reset({
              name: "",
              title: "",
              email: "",
              phone: "",
              company: currentBusiness?.name || "",
              notes: "",
            });
            setIsAddDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No contacts found for this business.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(contact)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contact.title && (
                  <p className="text-sm text-gray-500 mb-2">{contact.title}</p>
                )}
                <p className="text-sm mb-1">
                  <span className="font-medium">Email:</span> {contact.email}
                </p>
                {contact.phone && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Phone:</span> {contact.phone}
                  </p>
                )}
                {contact.company && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Company:</span>{" "}
                    {contact.company}
                  </p>
                )}
                {contact.notes && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Notes:</span> {contact.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to this business.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(handleAddSubmit)}
              className="space-y-4"
            >
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={currentBusiness?.name || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {businesses.map((business) => (
                            <SelectItem key={business.id} value={business.name}>
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Contact</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update the contact information below.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {businesses.map((business) => (
                            <SelectItem key={business.id} value={business.name}>
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentContact?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsTab;
