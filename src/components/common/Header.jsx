"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useUser } from "@/provider/UserContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { NotificationToggle } from "@/components/NotificationToggle";

const routes = [
  { href: "/map", label: "Map" },
  { href: "/feed", label: "Feed" },
  { href: "/report", label: "Report" },
  {
    href: "/resources",
    label: "Resources",
    dropdown: [
      { href: "/resources/guides", label: "Guides" },
      { href: "/resources/emergency-contacts", label: "Emergency Contacts" },
      { href: "/resources/facilities", label: "Facilities" },
    ],
  },
];

const publicLinks = [
  { href: "/map", label: "Map" },
  { href: "/feed", label: "Feed" },
  { href: "/report", label: "Report" },
  {
    href: "/resources",
    label: "Resources",
    dropdown: [
      { href: "/resources/guides", label: "Guides" },
      { href: "/resources/emergency-contacts", label: "Emergency Contacts" },
      { href: "/resources/facilities", label: "Facilities" },
    ],
  },
];

const privateLinks = [
  { href: "/map", label: "Map" },
  { href: "/feed", label: "Feed" },
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
  {
    href: "/dashboard/resources",
    label: "Resources",
    dropdown: [
      { href: "/dashboard/resources/guides", label: "Guides" },
      {
        href: "/dashboard/resources/emergency-contacts",
        label: "Emergency Contacts",
      },
      { href: "/dashboard/resources/facilities", label: "Facilities" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const { user, isLoggedIn, logout } = useUser();
  const currentLinks = isLoggedIn ? privateLinks : publicLinks;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 min-w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Left - Logo and Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-2xl font-bold">DisasterWatch</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {currentLinks.map((route) =>
                route.dropdown ? (
                  <NavigationMenuItem key={route.href}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname.startsWith(route.href) && "text-primary",
                          )}
                        >
                          {route.label}
                        </NavigationMenuLink>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {route.dropdown.map((subRoute) => (
                          <DropdownMenuItem key={subRoute.href} asChild>
                            <Link
                              href={subRoute.href}
                              className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === subRoute.href && "text-primary",
                              )}
                            >
                              {subRoute.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={route.href}>
                    <Link href={route.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === route.href && "text-primary",
                        )}
                      >
                        {route.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-2xl font-bold"
                onClick={() => setIsOpen(false)}
              >
                DisasterWatch
              </Link>
              {routes.map((route) =>
                route.dropdown ? (
                  <div key={route.href} className="space-y-2">
                    <span className="text-lg font-semibold">{route.label}</span>
                    {route.dropdown.map((subRoute) => (
                      <Link
                        key={subRoute.href}
                        href={subRoute.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          pathname === subRoute.href && "text-primary",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {subRoute.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href && "text-primary",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ),
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <NotificationToggle />
          <div className="flex items-center justify-end ml-auto space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {isLoggedIn ? (
              <>
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder-avatar.png"} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Link href="/auth" onClick={handleLogout}>
                  <Button variant="destructive">Logout</Button>
                </Link>
              </>
            ) : (
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
