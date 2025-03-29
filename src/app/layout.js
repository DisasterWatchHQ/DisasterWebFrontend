import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
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

export const metadata = {
  title: "Disaster Web App",
  description: "Real-time disaster monitoring and notification system",
};

export default function RootLayout({ children }) {
  const header = <Header />;
  const footer = <Footer />;
  
  return (
    <html 
      lang="en" 
      className={`${GeistSans.className} ${GeistMono.className}`}
    >
      <body className="antialiased flex flex-col min-h-screen">
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