"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resourceApi } from "@/lib/resourceApi";

export default function GuidesPage() {
  const { toast } = useToast();
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "guide",
    type: "disaster_guide",
    description: "",
    content: "",
    contact: {
      phone: "",
      email: "",
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
    },
    tags: [],
    status: "active",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [selectedType]);

  const fetchGuides = async () => {
    setIsLoading(true);
    try {
      const params = selectedType !== "all" ? { type: selectedType } : {};
      const data = await resourceApi.public.getGuides(params);
      setGuides(data.resources);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch guides",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

    setIsLoading(true);
    try {
      if (editingGuide) {
        await resourceApi.protected.updateResource(editingGuide.id, formData);
        toast({
          title: "Success",
          description: "Guide updated successfully",
        });
      } else {
        await resourceApi.protected.createResource(formData);
        toast({
          title: "Success",
          description: "Guide created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchGuides();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (guideId) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please login to delete guides",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resourceApi.protected.deleteResource(guideId);
      toast({
        title: "Success",
        description: "Guide deleted successfully",
      });
      fetchGuides();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
        e.target.value = "";
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "guide",
      type: "disaster_guide",
      description: "",
      content: "",
      contact: {
        phone: "",
        email: "",
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
      },
      tags: [],
      status: "active",
    });
    setEditingGuide(null);
  };

  const handleEdit = async (guide) => {
    setIsLoading(true);
    try {
      const updatedGuide = await resourceApi.public.getResourceById(
        guide.id || guide._id,
      );
      setEditingGuide(updatedGuide.data);
      setFormData({
        ...updatedGuide.data,
        metadata: {
          ...updatedGuide.data.metadata,
          lastUpdated: new Date().toISOString(),
        },
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Detailed error:", error);
      toast({
        title: "Error",
        description: "Failed to load guide details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewGuide = async (guide) => {
    setIsLoading(true);
    try {
      const updatedGuide = await resourceApi.public.getResourceById(
        guide.id || guide._id,
      );
      setSelectedGuide(updatedGuide.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load guide details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGuides = guides.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const GuideDetailDialog = ({ guide, open, onClose }) => {
    if (!guide) return null;

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{guide.name}</DialogTitle>
            <div className="flex gap-2 mt-2">
              {guide.tags.map((tag) => (
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
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Emergency Guides</h1>
        {!token ? (
          <Button
            onClick={() => {
              toast({
                title: "Authentication Required",
                description: "Please login to add new guides",
                variant: "destructive",
              });
            }}
          >
            Login to Add Guide
          </Button>
        ) : (
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" disabled={isLoading}>
                <Plus className="h-4 w-4" />
                Add New Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingGuide ? "Edit Guide" : "Create New Guide"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Guide Title"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />

                <Textarea
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-24"
                  required
                />

                <Textarea
                  placeholder="Guide Content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full min-h-48"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Contact Phone"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    type="tel"
                  />
                  <Input
                    placeholder="Contact Email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    type="email"
                  />
                </div>

                <div>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyDown={handleTagInput}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
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
                    {isLoading
                      ? "Processing..."
                      : editingGuide
                        ? "Update Guide"
                        : "Create Guide"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

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

      {isLoading && guides.length === 0 ? (
        <div className="flex justify-center py-12">
          <p>Loading guides...</p>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="flex justify-center py-12">
          <p>No guides found. Try changing your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id || guide._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewGuide(guide)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{guide.name}</CardTitle>
                  {token && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(guide);
                        }}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Guide</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this guide? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(guide.id || guide._id)
                              }
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {guide.tags &&
                    guide.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {guide.description}
                </p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Last updated:{" "}
                {guide.metadata && guide.metadata.lastUpdated
                  ? new Date(guide.metadata.lastUpdated).toLocaleDateString()
                  : "Unknown"}
              </CardFooter>
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
