import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertTriangle } from "lucide-react";
import { warningApi } from "@/lib/warningApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPicker } from "@/components/report/MapSelection";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  disaster_category: z.enum([
    "flood",
    "fire",
    "earthquake",
    "landslide",
    "cyclone",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  affected_locations: z
    .array(
      z.object({
        coordinates: z.object({
          latitude: z.number().nullable(),
          longitude: z.number().nullable(),
        }),
        address: z.object({
          city: z.string().min(1, "City is required"),
          district: z.string().min(1, "District is required"),
          province: z.string().min(1, "Province is required"),
          details: z.string().optional().nullable(),
        }),
      }),
    )
    .min(1, "At least one location must be specified"),
  images: z.array(z.string().url()).optional(),
});

const CreateWarningDialog = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUser(userInfo);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      disaster_category: undefined,
      severity: undefined,
      affected_locations: [
        {
          coordinates: {
            latitude: null,
            longitude: null,
          },
          address: {
            city: "",
            district: "",
            province: "",
            details: "",
          },
        },
      ],
      images: [],
    },
  });

  const handleLocationSelect = (location) => {
    if (!location) return;

    // Set coordinates
    form.setValue("affected_locations.0.coordinates", {
      latitude: location.latitude || null,
      longitude: location.longitude || null,
    });

    // Set address with fallbacks
    const address = location.address || {};
    form.setValue("affected_locations.0.address", {
      city: address.city || "Unknown",
      district: address.district || "Unknown",
      province: address.province || "Unknown",
      details: address.details || "",
    });

    // Show address edit form if some information is missing
    if (!address || !address.city || !address.district || !address.province) {
      setShowAddressEdit(true);
      toast({
        title: "Address Review Needed",
        description:
          "Please review and correct the location details if necessary.",
        variant: "warning",
      });
    }
  };

  async function onSubmit(data) {
    try {
      setIsSubmitting(true);

      if (!user || !user.id) {
        toast({
          title: "Error",
          description: "User information not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const formattedData = {
        ...data,
        created_by: user.id,
        status: "active",
        affected_locations: data.affected_locations.map((location) => ({
          coordinates: {
            latitude: location.coordinates.latitude,
            longitude: location.coordinates.longitude,
          },
          address: {
            city: location.address.city,
            district: location.address.district,
            province: location.address.province,
            details: location.address.details || "",
          },
        })),
      };

      await warningApi.protected.createWarning(formattedData);

      toast({
        title: "Success",
        description: "Warning has been created successfully.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create warning.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedLocation = form.watch("affected_locations.0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Warning</DialogTitle>
          <DialogDescription>
            Create a new warning for an ongoing or imminent disaster situation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Warning title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="disaster_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disaster Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="landslide">Landslide</SelectItem>
                        <SelectItem value="cyclone">Cyclone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the situation"
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Location</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddressEdit(!showAddressEdit)}
                >
                  {showAddressEdit
                    ? "Hide Address Edit"
                    : "Edit Address Manually"}
                </Button>
              </div>

              <MapPicker onLocationSelect={handleLocationSelect} />

              {selectedLocation?.coordinates?.latitude && (
                <div className="flex items-center gap-2 p-4 border rounded-md bg-yellow-50 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm">
                    Selected coordinates:{" "}
                    {selectedLocation.coordinates.latitude.toFixed(6)},{" "}
                    {selectedLocation.coordinates.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {showAddressEdit && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h4 className="font-medium">Edit Address Details</h4>
                  <FormField
                    control={form.control}
                    name="affected_locations.0.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="affected_locations.0.address.district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="District name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="affected_locations.0.address.province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Province name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="affected_locations.0.address.details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional location details"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Warning
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarningDialog;
