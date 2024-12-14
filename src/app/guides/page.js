import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Flame, Waves } from "lucide-react"

export default function Guides() {
  const guides = [
    { 
      category: "Flood", 
      info: "Stay on high ground and avoid floodwater.",
      severity: "high",
      icon: <Waves className="h-4 w-4" />,
    },
    { 
      category: "Earthquake", 
      info: "Duck, cover, and hold during tremors.",
      severity: "high",
    },
    { 
      category: "Fire", 
      info: "Evacuate immediately; use wet cloth to breathe.",
      severity: "critical",
      icon: <Flame className="h-4 w-4" />,
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Disaster Preparedness Guides
            </h1>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid gap-4">
              {guides.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {guide.category}
                      </CardTitle>
                      <Badge 
                        variant={guide.severity === 'critical' ? 'destructive' : 'default'}
                      >
                        {guide.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {guide.info}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}