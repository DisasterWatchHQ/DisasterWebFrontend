import localFont from "next/font/local";
// import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "../components/Header";
import LayoutWrapper from "@/components/LayoutWrapper";
import Footer from "@/components/Footer";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/providers/UserContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const header = <Header />;
  const footer = <Footer />;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper header={header} footer={footer}>
              {/* Main Content */}
              <main className="flex-grow container min-w-full">{children}</main>
            </LayoutWrapper>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
