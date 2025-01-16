'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchGuides = async () => {
      const response = await fetch(
        `/api/resources/guides${selectedType !== 'all' ? `?type=${selectedType}` : ''}`
      );
      const data = await response.json();
      setGuides(data.resources);
    };
    fetchGuides();
  }, [selectedType]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Emergency Guides</h1>
      
      <div className="flex gap-4">
        <Input
          placeholder="Search guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="evacuation">Evacuation</SelectItem>
            <SelectItem value="first_aid">First Aid</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Card key={guide._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{guide.name}</CardTitle>
              <div className="flex gap-2">
                {guide.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{guide.description}</p>
              <div className="prose dark:prose-invert" 
                dangerouslySetInnerHTML={{ __html: guide.content }} 
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}