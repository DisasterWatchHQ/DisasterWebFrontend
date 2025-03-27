"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { resourceApi } from "@/lib/resourceApi";

const ITEMS_PER_PAGE = 9;

export default function FacilitiesPage() {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    city: "",
    availability_status: "all",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: pagination.currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        };

        if (filters.type !== "all") params.type = filters.type;
        if (filters.city) params.city = filters.city;
        if (filters.availability_status !== "all") {
          params.availability_status = filters.availability_status;
        }

        const response = await resourceApi.public.getFacilities(params);

        if (response.success) {
          setFacilities(response.resources);
          setPagination({
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalResults,
          });
        } else {
          throw new Error(response.message || "Failed to fetch facilities");
        }
      } catch (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch facilities",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [filters, pagination.currentPage, toast]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      city: "",
      availability_status: "all",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Emergency Facilities</h1>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Filter by city..."
          value={filters.city}
          onChange={(e) => handleFilterChange("city", e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value)}
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
            handleFilterChange("availability_status", value)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters} className="ml-auto">
          Clear Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-destructive mb-4">{error}</p>
          <Button
            onClick={() =>
              setPagination((prev) => ({ ...prev, currentPage: 1 }))
            }
          >
            Try Again
          </Button>
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No facilities found matching your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {facility.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge>{facility.type}</Badge>
                    <Badge
                      variant={
                        facility.availability_status === "open"
                          ? "success"
                          : facility.availability_status === "under_maintenance"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {facility.availability_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      {facility.location.address.formatted_address}
                    </p>
                    {facility.capacity && <p>Capacity: {facility.capacity}</p>}
                    {facility.operating_hours && (
                      <div className="text-sm">
                        {Object.entries(facility.operating_hours).map(
                          ([day, hours]) => (
                            <p key={day} className="capitalize">
                              {day}:{" "}
                              {hours.is24Hours
                                ? "24 Hours"
                                : `${hours.open} - ${hours.close}`}
                            </p>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
