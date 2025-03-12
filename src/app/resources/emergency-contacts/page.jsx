"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { resourceApi } from "@/lib/resourceApi";

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await resourceApi.public.getEmergencyContacts();
        setContacts(response.resources);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch emergency contacts:", err);
        setError("Failed to load emergency contacts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <div className="mt-6">Loading emergency contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <div className="mt-6 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Emergency Contacts</h1>
      {contacts.length === 0 ? (
        <div>No emergency contacts available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {contact.name}
                </CardTitle>
                <Badge
                  variant={
                    contact.emergency_level === "high"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {contact.emergency_level} priority
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contact.contact?.phone && (
                    <p className="font-medium">Phone: {contact.contact.phone}</p>
                  )}
                  {contact.contact?.email && (
                    <p className="font-medium">Email: {contact.contact.email}</p>
                  )}
                  {contact.description && (
                    <p className="text-muted-foreground">{contact.description}</p>
                  )}
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}