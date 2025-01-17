import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  disaster_category: z.enum(["flood", "fire", "earthquake", "landslide", "cyclone"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  severity: z.enum(["low", "medium", "high", "critical"]),
  affected_locations: z.array(
    z.object({
      address: z.object({
        city: z.string().min(1, "City is required"),
        district: z.string().min(1, "District is required"),
        province: z.string().min(1, "Province is required"),
        details: z.string().optional(),
      }),
    })
  ).min(1, "At least one location must be specified"),
  expected_duration: z.object({
    end_time: z.string().optional(),
  }),
  images: z.array(z.string().url()).optional(),
});

const CreateWarningDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      disaster_category: undefined,
      severity: undefined,
      affected_locations: [
        {
          address: {
            city: "",
            district: "",
            province: "",
            details: "",
          },
        },
      ],
      expected_duration: {
        end_time: "",
      },
      images: [],
    },
  });

  async function onSubmit(data) {
    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/api/warnings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your auth headers here
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create warning");
      }

      toast({
        title: "Success",
        description: "Warning has been created successfully.",
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create warning. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Warning</Button>
      </DialogTrigger>
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
                  <FormDescription>
                    Brief, clear title for the warning
                  </FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormDescription>
                    Provide comprehensive information about the warning
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Affected Location</h3>
              {form.watch("affected_locations").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`affected_locations.${index}.address.city`}
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
                    name={`affected_locations.${index}.address.district`}
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
                    name={`affected_locations.${index}.address.province`}
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
                    name={`affected_locations.${index}.address.details`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Details</FormLabel>
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
              ))}
            </div>

            <FormField
              control={form.control}
              name="expected_duration.end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Estimated time when the situation might be resolved
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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