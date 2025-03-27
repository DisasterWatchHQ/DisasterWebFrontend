import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css";
import Header from "../components/common/Header";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Footer from "@/components/common/Footer";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/provider/UserContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "DisasterWatch",
  description: "A platform designed to provide real-time information and alerts about natural disasters.",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper header={header} footer={footer}>
              <main className="flex-grow container min-w-full">{children}</main>
            </LayoutWrapper>
          </ThemeProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}