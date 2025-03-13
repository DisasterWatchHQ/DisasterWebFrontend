import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 items-start">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">DisasterWatch</h3>
            <p className="text-sm text-muted-foreground">
              Keeping communities safe and informed during emergencies.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" target="_blank">
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://facebook.com" target="_blank">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Button variant="ghost" size="icon">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank">
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/map"
                  className="text-muted-foreground hover:text-primary"
                >
                  Disaster Map
                </Link>
              </li>
              <li>
                <Link
                  href="/feed"
                  className="text-muted-foreground hover:text-primary"
                >
                  Live Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-muted-foreground hover:text-primary"
                >
                  Safety Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary"
                >
                  Emergency Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates and emergency alerts.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" type="email" />
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 DisasterWatch. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
