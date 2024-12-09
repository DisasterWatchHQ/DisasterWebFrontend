import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const updates = [
  {
    type: "Alert",
    title: "Flood Warning",
    description: "Rising water levels in coastal areas. Stay vigilant.",
    severity: "high"
  },
  {
    type: "Update",
    title: "Emergency Response",
    description: "Relief operations ongoing in affected areas.",
    severity: "medium"
  },
  {
    type: "Guide",
    title: "Hurricane Preparedness",
    description: "Updated guidelines for hurricane season.",
    severity: "info"
  }
];

export default function RecentUpdates() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Recent Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {updates.map((update, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <Badge className="mb-4" variant={
                  update.severity === "high" ? "destructive" : 
                  update.severity === "medium" ? "default" : 
                  "secondary"
                }>
                  {update.type}
                </Badge>
                <h3 className="font-bold mb-2">{update.title}</h3>
                <p className="text-gray-600">{update.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}