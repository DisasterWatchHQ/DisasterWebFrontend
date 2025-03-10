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

export default function EmergencyContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [token, setToken] = useState(null);
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
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/resources/emergency-contacts",
      );
      const data = await response.json();
      setContacts(data.resources);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch emergency contacts",
        variant: "destructive",
      });
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s()+\-]+$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "Please login to create or edit guides",
        variant: "destructive",
      });
      return;
    }

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
      const url = editingContact
        ? `http://localhost:5000/api/resources/${editingContact.id}`
        : "http://localhost:5000/api/resources";

      const method = editingContact ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Emergency contact ${editingContact ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchContacts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (contactId) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please login to delete contacts",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/resources/${contactId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contact deleted successfully",
        });
        fetchContacts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
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
                >
                  Cancel
                </Button>
                <Button type="submit">Add Contact</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
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
                          onClick={() => handleDelete(contact.id)}
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
                  Service Hours: {contact.metadata.serviceHours}
                </p>
                {contact.tags.length > 0 && (
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
    </div>
  );
}
