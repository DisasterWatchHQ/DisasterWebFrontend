'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    city: '',
    availability_status: 'all',
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      const queryParams = new URLSearchParams();
      if (filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.availability_status !== 'all') {
        queryParams.append('availability_status', filters.availability_status);
      }
      
      const response = await fetch(
        `/api/resources/facilities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      );
      const data = await response.json();
      setFacilities(data.resources);
    };
    fetchFacilities();
  }, [filters]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Emergency Facilities</h1>

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
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {facility.name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge>{facility.type}</Badge>
                <Badge variant={
                  facility.availability_status === 'available' ? 'success' :
                  facility.availability_status === 'full' ? 'warning' : 'destructive'
                }>
                  {facility.availability_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  {facility.location.address.formatted_address}
                </p>
                {facility.capacity && (
                  <p>Capacity: {facility.capacity}</p>
                )}
                {facility.operating_hours && (
                  <p>Hours: {facility.operating_hours}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}