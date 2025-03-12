'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resourceApi } from '@/lib/resourceApi';

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = selectedType !== 'all' ? { type: selectedType } : {};
        const response = await resourceApi.public.getGuides(params);
        
        if (response.resources) {
          setGuides(response.resources);
        } else {
          throw new Error('Failed to fetch guides data');
        }
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load guides. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuides();
  }, [selectedType]);

  const GuideDetailDialog = ({ guide, open, onClose }) => {
    if (!guide) return null;
    
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{guide.name}</DialogTitle>
            <div className="flex gap-2 mt-2">
              {guide.tags && guide.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{guide.description}</p>
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {guide.content}
              </ReactMarkdown>
            </article>
            {guide.contact && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2">Contact Information:</h4>
                {guide.contact.phone && <p>Phone: {guide.contact.phone}</p>}
                {guide.contact.email && <p>Email: {guide.contact.email}</p>}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[400px] text-destructive">
          {error}
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No guides found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card 
              key={guide.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedGuide(guide)}
            >
              <CardHeader>
                <CardTitle>{guide.name}</CardTitle>
                <div className="flex gap-2">
                  {guide.tags && guide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {guide.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GuideDetailDialog
        guide={selectedGuide}
        open={!!selectedGuide}
        onClose={() => setSelectedGuide(null)}
      />
    </div>
  );
}