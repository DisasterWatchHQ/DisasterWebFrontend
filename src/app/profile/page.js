"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Building,
  MapPin,
  Phone,
  Calendar,
  Bell,
  Shield,
  Language,
  LogOut,
  Upload,
  Trash2,
} from "lucide-react";
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
// import { useUser } from "../../providers/UserContext";
// import { getUserProfile, updateUser, deleteUser } from "@/utils/apiUser";
// import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangePassword } from "@/components/common/ChangePassword";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setUser({
            name: "Anonymous User",
            email: "anonymous@example.com",
            location: null,
            organization: "Not specified",
            joinDate: "Recent",
            preferences: {
              notifications: true,
              emailUpdates: true,
              language: "en",
              darkMode: false,
            },
          });
          return;
        }

        const userData = await getUserProfile(userId);
        setUser({
          ...userData.user,
          // Add any missing fields that your frontend expects
          organization: userData.user.associated_department || "Not specified",
          joinDate: userData.user.createdAt
            ? new Date(userData.user.createdAt).toLocaleDateString()
            : "Recent",
          preferences: {
            notifications: true,
            emailUpdates: true,
            language: "en",
            darkMode: false,
          },
        });
      } catch (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const updatedUser = {
        name: formData.get("name"),
        email: formData.get("email"),
        associated_department: formData.get("organization"),
        location: user.location,
      };

      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found");
      }

      const data = await updateUser(userId, updatedUser);

      if (data.success) {
        const transformedUser = {
          ...user, // Keep existing user data
          ...data.user, // Merge new backend data
          organization: data.user.associated_department || "Not specified",
          joinDate: data.user.createdAt
            ? new Date(data.user.createdAt).toLocaleDateString()
            : "Recent",
          preferences: user.preferences, // Preserve preferences
        };
        setUser(transformedUser);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");

      if (!userId || !token) {
        toast({
          title: "Error",
          description: "User not authenticated. Please log in again.",
          variant: "destructive",
        });
        router.push("/auth");
        return;
      }

      const response = await deleteUser(userId);

      localStorage.clear();

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      });

      router.push("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-8xl mx-auto py-6">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={avatar || "/placeholder-avatar.png"}
                    alt={user?.name}
                  />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="space-y-1">
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-4 w-4 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.location
                        ? `${user.location.latitude}, ${user.location.longitude}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Building className="h-4 w-4 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Organization
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.organization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.joinDate}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={user?.name || ""}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user?.email || ""}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="location"
                        name="location"
                        defaultValue={
                          user?.location
                            ? `${user.location.latitude}, ${user.location.longitude}`
                            : ""
                        }
                        readOnly
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const locationData = {
                                  latitude: position.coords.latitude,
                                  longitude: position.coords.longitude,
                                };
                                setUser((prev) => ({
                                  ...prev,
                                  location: locationData, // This matches your mongoose schema
                                }));
                                toast({
                                  title: "Location updated",
                                  description:
                                    "Your location has been successfully retrieved.",
                                });
                              },
                              (error) => {
                                toast({
                                  variant: "destructive",
                                  title: "Error",
                                  description:
                                    "Failed to get location. Please ensure location access is enabled.",
                                });
                              },
                            );
                          } else {
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description:
                                "Geolocation is not supported by your browser.",
                            });
                          }
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={user?.organization || ""}
                      onChange={(e) =>
                        setUser((prev) => ({
                          ...prev,
                          organization: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your notification and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications for important updates
                    </p>
                  </div>
                  <Switch checked={user?.preferences?.notifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications
                    </p>
                  </div>
                  <Switch checked={user?.preferences?.emailUpdates} />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue={user?.preferences?.language}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button  
                  variant="outline"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="w-full">
                    Change Password
                  </Button>
                  {isChangePassword && (
                    <ChangePassword onClose={() => setIsChangePasswordOpen(false)} />
                  )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
