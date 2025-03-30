import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, Trash2, Edit, Plus, Building, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type Contact = z.infer<typeof formSchema> & { id: string };

interface ContactsTabProps {
  businessId?: string;
  contacts?: Contact[];
  onAddContact?: (contact: Omit<Contact, "id">) => void;
  onEditContact?: (id: string, contact: Omit<Contact, "id">) => void;
  onDeleteContact?: (id: string) => void;
}

const ContactsTab = ({
  businessId = "business-1",
  contacts = [
    {
      id: "1",
      name: "John Doe",
      title: "CEO",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      company: "Acme Inc",
      notes: "Met at conference in March 2023",
    },
    {
      id: "2",
      name: "Jane Smith",
      title: "Marketing Director",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      company: "Acme Inc",
      notes: "Prefers email communication",
    },
    {
      id: "3",
      name: "Robert Johnson",
      title: "CTO",
      email: "robert.johnson@example.com",
      phone: "(555) 456-7890",
      company: "Acme Inc",
      notes: "Technical point of contact",
    },
  ],
  onAddContact = () => {},
  onEditContact = () => {},
  onDeleteContact = () => {},
}: ContactsTabProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  });

  const handleAddSubmit = (values: z.infer<typeof formSchema>) => {
    onAddContact(values);
    addForm.reset();
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (values: z.infer<typeof formSchema>) => {
    if (currentContact) {
      onEditContact(currentContact.id, values);
      setCurrentContact(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (currentContact) {
      onDeleteContact(currentContact.id);
      setCurrentContact(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (contact: Contact) => {
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

  const openDeleteDialog = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Contacts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new contact for this business. Fill in the details below.
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
                        <Input placeholder="John Doe" {...field} />
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
                        <Input placeholder="CEO" {...field} />
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
                        <Input
                          placeholder="john.doe@example.com"
                          type="email"
                          {...field}
                        />
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
                        <Input placeholder="(555) 123-4567" {...field} />
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
                        <Input placeholder="Acme Inc" {...field} />
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
                        <Input
                          placeholder="Additional information..."
                          {...field}
                        />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <User size={18} className="text-primary" />
                {contact.name}
              </CardTitle>
              {contact.title && (
                <p className="text-sm text-muted-foreground">{contact.title}</p>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="text-sm">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-muted-foreground" />
                    <span className="text-sm">{contact.company}</span>
                  </div>
                )}
                {contact.notes && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      Notes:
                    </p>
                    <p className="text-sm">{contact.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(contact)}
                className="h-8 w-8 p-0"
              >
                <Edit size={16} />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openDeleteDialog(contact)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
                      <Input {...field} />
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
