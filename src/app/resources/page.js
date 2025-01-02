"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Phone, Hospital, Building, Siren } from "lucide-react";

const categories = [
  {
    id: "emergency-contacts",
    title: "Emergency Contacts",
    icon: <Phone className="w-4 h-4" />,
  },
  {
    id: "shelters",
    title: "Emergency Shelters",
    icon: <Building className="w-4 h-4" />,
  },
  {
    id: "hospitals",
    title: "Hospitals & Medical Centers",
    icon: <Hospital className="w-4 h-4" />,
  },
  {
    id: "fire-stations",
    title: "Fire Stations",
    icon: <Siren className="w-4 h-4" />,
  },
  {
    id: "police",
    title: "Police Stations",
    icon: <Building className="w-4 h-4" />,
  },
];

const resourcesData = {
  "emergency-contacts": [
    {
      name: "Emergency Services",
      contact: "911",
      description: "For immediate emergency assistance",
      location: "Nationwide",
      available: "24/7",
    },
    {
      name: "Disaster Response Hotline",
      contact: "555-0100",
      description: "Natural disaster emergency response",
      location: "Nationwide",
      available: "24/7",
    },
  ],
  shelters: [
    {
      name: "City Community Center",
      address: "123 Main St",
      contact: "555-0123",
      capacity: "200 people",
      facilities: ["Food", "Water", "Medical Aid"],
      status: "Open",
    },
    {
      name: "South District Shelter",
      address: "456 Oak Avenue",
      contact: "555-0124",
      capacity: "150 people",
      facilities: ["Food", "Water", "Beds"],
      status: "Open",
    },
  ],
  hospitals: [
    {
      name: "Central Hospital",
      address: "789 Medical Drive",
      contact: "555-0125",
      facilities: ["Emergency Room", "Trauma Center"],
      status: "Open",
    },
  ],
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] =
    useState("emergency-contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Add search logic here
  };

  const filteredResources = resourcesData[selectedCategory]?.filter(
    (resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        locationFilter === "all" || resource.location === locationFilter;
      return matchesSearch && matchesLocation;
    },
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="north">North Region</SelectItem>
                  <SelectItem value="south">South Region</SelectItem>
                  <SelectItem value="east">East Region</SelectItem>
                  <SelectItem value="west">West Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resources List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              {categories.find((c) => c.id === selectedCategory)?.title}
            </h2>

            {filteredResources?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No resources found matching your search criteria.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredResources?.map((resource, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {resource.name}
                        </h3>
                        {resource.contact && (
                          <p className="text-sm text-muted-foreground">
                            Contact: {resource.contact}
                          </p>
                        )}
                        {resource.address && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {resource.address}
                          </p>
                        )}
                        {resource.description && (
                          <p className="mt-2">{resource.description}</p>
                        )}
                      </div>
                      {resource.status && (
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            resource.status === "Open"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {resource.status}
                        </span>
                      )}
                    </div>
                    {resource.facilities && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {resource.facilities.map((facility, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
