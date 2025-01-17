import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, Phone, FileText, Filter, Bell } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">DisasterWatch</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time crowd-sourced disaster reporting and emergency resource hub
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Report Incident
              </Button>
              <Button size="lg" variant="outline">
                View Map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Bell className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Real-time Alerts</h3>
                <p className="text-muted-foreground">
                  Get immediate notifications about disasters and emergencies in your area
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <MapPin className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Interactive Map</h3>
                <p className="text-muted-foreground">
                  Visual representation of active incidents and emergency facilities
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Community</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Help make your community safer by contributing to our crowd-sourced disaster reporting network
          </p>
          <Button size="lg" className="bg-primary">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 DisasterWatch. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;