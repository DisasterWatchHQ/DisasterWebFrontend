"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FacilitiesPage() {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [token, setToken] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    city: "",
    availability_status: "all",
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "facility",
    type: "",
    contact: {
      phone: "",
      email: "",
    },
    location: {
      type: "point",
      coordinates: ["", ""],
      address: {
        formatted_address: "",
        city: "",
        district: "",
        province: "",
        details: "",
      },
    },
    availability_status: "open",
    metadata: {
      capacity: 0
    },
    // Add capacity at the root level for shelter type
    capacity: 0,
    operating_hours: {
      monday: { open: "09:00", close: "17:00", is24Hours: false },
      tuesday: { open: "09:00", close: "17:00", is24Hours: false },
      wednesday: { open: "09:00", close: "17:00", is24Hours: false },
      thursday: { open: "09:00", close: "17:00", is24Hours: false },
      friday: { open: "09:00", close: "17:00", is24Hours: false },
      saturday: { open: "09:00", close: "17:00", is24Hours: false },
      sunday: { open: "09:00", close: "17:00", is24Hours: false },
    },
    tags: [],
    status: "active",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [filters]);

  const fetchFacilities = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type !== "all") queryParams.append("type", filters.type);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.availability_status !== "all") {
        queryParams.append("availability_status", filters.availability_status);
      }

      const response = await fetch(
        `http://localhost:5000/api/resources/facilities${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      );
      const data = await response.json();
      setFacilities(data.resources);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch facilities",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "Please login to create or edit facilities",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestBody = {
        ...formData,
        location: {
          type: "point",
          // Ensure coordinates are numbers and in [longitude, latitude] format
          coordinates: [
            Number(formData.location.coordinates[0]),
            Number(formData.location.coordinates[1]),
          ],
          address: formData.location.address,
        },
        // Set capacity in the proper location
        capacity:
          formData.type === "shelter"
            ? Number(formData.metadata.capacity)
            : undefined,
        metadata: {
          ...formData.metadata,
          capacity:
            formData.type === "shelter"
              ? Number(formData.metadata.capacity)
              : undefined,
        },
      };

      const url = editingFacility
        ? `http://localhost:5000/api/resources/${editingFacility.id}`
        : "http://localhost:5000/api/resources/";

      const method = editingFacility ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Facility ${editingFacility ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchFacilities();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (facilityId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/resources/facilities/${facilityId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Facility deleted successfully",
        });
        fetchFacilities();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (facility) => {
    setEditingFacility(facility);
    setFormData(facility);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "facility",
      type: "",
      contact: {
        phone: "",
        email: "",
      },
      location: {
        type: "point",
        coordinates: ["", ""],
        address: {
          formatted_address: "",
          city: "",
          district: "",
          province: "",
          details: "",
        },
      },
      availability_status: "open",
      metadata: {
        capacity: 0,
      },
      operating_hours: {
        monday: { open: "09:00", close: "17:00", is24Hours: false },
        tuesday: { open: "09:00", close: "17:00", is24Hours: false },
        wednesday: { open: "09:00", close: "17:00", is24Hours: false },
        thursday: { open: "09:00", close: "17:00", is24Hours: false },
        friday: { open: "09:00", close: "17:00", is24Hours: false },
        saturday: { open: "09:00", close: "17:00", is24Hours: false },
        sunday: { open: "09:00", close: "17:00", is24Hours: false },
      },
      tags: [],
      status: "active",
    });
    setEditingFacility(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Emergency Facilities</h1>
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
              Add New Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFacility ? "Edit Facility" : "Add Facility"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  placeholder="Facility Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Facility Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="shelter">Shelter</SelectItem>
                    <SelectItem value="police_station">
                      Police Station
                    </SelectItem>
                    <SelectItem value="fire_station">Fire Station</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
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

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Longitude"
                      value={formData.location.coordinates[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            coordinates: [
                              e.target.value,
                              formData.location.coordinates[1],
                            ],
                          },
                        })
                      }
                      required
                    />
                    <Input
                      placeholder="Latitude"
                      value={formData.location.coordinates[1]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            coordinates: [
                              formData.location.coordinates[0],
                              e.target.value,
                            ],
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <Input
                    placeholder="Full Address"
                    value={formData.location.address.formatted_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          address: {
                            ...formData.location.address,
                            formatted_address: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={formData.location.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            address: {
                              ...formData.location.address,
                              city: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="District"
                      value={formData.location.address.district}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            address: {
                              ...formData.location.address,
                              district: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Province"
                      value={formData.location.address.province}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            address: {
                              ...formData.location.address,
                              province: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <Select
                  value={formData.availability_status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, availability_status: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Availability Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="under_maintenance">
                      Under Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>

                {formData.type === "shelter" && (
                  <Input
                    type="number"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setFormData({
                        ...formData,
                        capacity: value,
                        metadata: {
                          ...formData.metadata,
                          capacity: value
                        }
                      });
                    }}
                    min="0"
                    required
                  />
                )}

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
              </div>

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
                <Button type="submit">
                  {editingFacility ? "Update Facility" : "Add Facility"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Filter by city..."
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="max-w-sm"
        />
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Facility type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="shelter">Shelter</SelectItem>
            <SelectItem value="police_station">Police Station</SelectItem>
            <SelectItem value="fire_station">Fire Station</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.availability_status}
          onValueChange={(value) =>
            setFilters({ ...filters, availability_status: value })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Availability status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility._id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                {facility.name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(facility)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the facility.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(facility._id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      facility.availability_status === "open"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {facility.availability_status.replace("_", " ")}
                  </Badge>
                  <Badge variant="secondary">
                    {facility.type.replace("_", " ")}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <p className="text-sm">
                      {facility.location.address.formatted_address ||
                        `${facility.location.address.city}, ${facility.location.address.province}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {facility.contact.phone}
                    </p>
                    {facility.contact.email && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {facility.contact.email}
                      </p>
                    )}
                  </div>

                  {facility.type === "shelter" &&
                    facility.metadata.capacity > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Capacity:</span>{" "}
                        {facility.metadata.capacity} people
                      </p>
                    )}

                  {facility.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {facility.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
