"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Phone, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resourceApi } from "@/lib/resourceApi"; // Import the resource API client

export default function EmergencyContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    category: "emergency_contact",
    type: "emergency_number",
    contact: {
      phone: "",
      email: "",
    },
    emergency_level: "",
    metadata: {
      serviceHours: "24/7",
    },
    tags: [],
    status: "active",
  });
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await resourceApi.public.getEmergencyContacts();
      setContacts(data.resources);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch emergency contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s()+\-]+$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.contact.phone)) {
      toast({
        title: "Invalid Phone Number",
        description:
          "Please enter a valid phone number using only digits, spaces, parentheses, plus sign, and hyphens",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingContact) {
        await resourceApi.protected.updateResource(editingContact._id, formData);
        toast({
          title: "Success",
          description: "Emergency contact updated successfully",
        });
      } else {
        await resourceApi.protected.createResource(formData);
        toast({
          title: "Success",
          description: "Emergency contact created successfully",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchContacts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      setIsLoading(true);
      await resourceApi.protected.deleteResource(contactId);
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      fetchContacts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      ...contact,
      tags: contact.tags || [],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "emergency_contact",
      type: "emergency_number",
      contact: {
        phone: "",
        email: "",
      },
      emergency_level: "",
      metadata: {
        serviceHours: "24/7",
      },
      tags: [],
      status: "active",
    });
    setEditingContact(null);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contact?.phone?.includes(searchTerm) ||
      contact.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === "all" || contact.emergency_level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Contact" : "Add Emergency Contact"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Contact Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <div className="space-y-4">
                <Input
                  placeholder="Phone Number"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                />
              </div>

              <Select
                value={formData.emergency_level}
                onValueChange={(value) =>
                  setFormData({ ...formData, emergency_level: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Emergency Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Service Hours"
                value={formData.metadata.serviceHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      serviceHours: e.target.value,
                    },
                  })
                }
                required
              />

              <Input
                placeholder="Tags (comma-separated)"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((tag) => tag.trim()).filter(tag => tag),
                  })
                }
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : editingContact ? "Update Contact" : "Add Contact"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Emergency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && !contacts.length ? (
        <div className="flex justify-center py-10">
          <p>Loading emergency contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No emergency contacts found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {contact.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this contact? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(contact._id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <Badge
                  variant={
                    contact.emergency_level === "high"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {contact.emergency_level} priority
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">
                    <p>Phone: {contact.contact.phone}</p>
                    {contact.contact.email && (
                      <p>Email: {contact.contact.email}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Service Hours: {contact.metadata?.serviceHours || "N/A"}
                  </p>
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}