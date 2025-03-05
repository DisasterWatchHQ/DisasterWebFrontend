import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, Phone, FileText, Filter, Bell } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section
        className="relative py-20 px-4"
        style={{
          backgroundImage: "url('/bg2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl text-white font-bold mb-6">
              DisasterWatch
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time crowd-sourced disaster reporting and emergency resource
              hub
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/report">
                <Button size="lg">Report Incident</Button>
              </Link>
              <Link href="/map">
                <Button size="lg" variant="outline">
                  View Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Bell className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Real-time Alerts</h3>
                <p className="text-muted-foreground">
                  Get immediate notifications about disasters and emergencies in
                  your area
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <MapPin className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Interactive Map</h3>
                <p className="text-muted-foreground">
                  Visual representation of active incidents and emergency
                  facilities
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Shield className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Verified Reports</h3>
                <p className="text-muted-foreground">
                  All incidents are verified by authorized personnel
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Phone className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Emergency Contacts</h3>
                <p className="text-muted-foreground">
                  Quick access to emergency numbers and services
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <FileText className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Resource Guides</h3>
                <p className="text-muted-foreground">
                  Comprehensive guides for emergency preparedness
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Filter className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Regional Filtering</h3>
                <p className="text-muted-foreground">
                  Filter reports and resources based on your location
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        className="relative py-20 px-4"
        style={{
          backgroundImage: "url('/bg3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Join the Community</h2>
          <p className="text-xl text-white/80 mb-8">
            Help make your community safer by contributing to our crowd-sourced
            disaster reporting network
          </p>
          <Button size="lg" className="bg-primary">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
