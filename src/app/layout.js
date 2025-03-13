import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/common/Header";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Footer from "@/components/common/Footer";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/provider/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { NotificationProvider } from "@/provider/NotificationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Disaster Web App",
  description: "Real-time disaster monitoring and notification system",
};

export default function RootLayout({ children }) {
  const header = <Header />;
  const footer = <Footer />;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <UserProvider>
          <NotificationProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LayoutWrapper header={header} footer={footer}>
                <Suspense fallback={<Loading />}>
                  <main className="flex-grow container min-w-full">
                    {children}
                  </main>
                </Suspense>
              </LayoutWrapper>
              <Toaster />
            </ThemeProvider>
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
