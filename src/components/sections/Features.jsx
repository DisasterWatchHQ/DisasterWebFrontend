import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, BellIcon, BookOpenIcon, PhoneIcon } from "lucide-react";

const features = [
  {
    icon: <MapIcon className="h-8 w-8" />,
    title: "Interactive Map",
    description: "Real-time visualization of active disasters and emergency zones."
  },
  {
    icon: <BellIcon className="h-8 w-8" />,
    title: "Live Alerts",
    description: "Instant notifications about emergencies in your area."
  },
  {
    icon: <BookOpenIcon className="h-8 w-8" />,
    title: "Safety Guides",
    description: "Comprehensive guides for different types of disasters."
  },
  {
    icon: <PhoneIcon className="h-8 w-8" />,
    title: "Emergency Contacts",
    description: "Quick access to emergency services and hotlines."
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 text-blue-600">{feature.icon}</div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}