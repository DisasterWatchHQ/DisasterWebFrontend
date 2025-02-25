"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch(
        "http://localhost:5000/api/resources/emergency-contacts",
      );
      const data = await response.json();
      setContacts(data.resources);
    };
    fetchContacts();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Emergency Contacts</h1>

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
    </div>
  );
}
