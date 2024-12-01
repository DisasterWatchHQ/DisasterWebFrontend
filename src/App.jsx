import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Toaster } from "sonner";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:block w-1/5 h-screen bg-[#E9ECEF] sticky top-0">
        <SidebarItem label="Dashboard" path="/dashboard" />
        <SidebarItem label="Tasks" path="/tasks" />
        {/* Add other sidebar items here */}
      </Sidebar>

      {/* Mobile Sidebar */}
      <Sidebar
        className={clsx(
          "fixed inset-y-0 left-0 w-3/4 bg-[#E9ECEF] z-50 transform transition-transform duration-300",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <Button onClick={toggleMobileSidebar} variant="ghost">
            <IoClose size={25} />
          </Button>
        </div>
        <SidebarItem label="Dashboard" path="/dashboard" />
        <SidebarItem label="Tasks" path="/tasks" />
        {/* Add other sidebar items here */}
      </Sidebar>

      {/* Overlay for mobile view */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Navbar
          onMenuClick={toggleMobileSidebar} // Mobile menu toggle button
        />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}


function App() {
  return (
    <main className="w-full min-h-screen">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/alerts" element={<Alerts />} />
        </Route>
      </Routes>
      <Toaster richColors />
    </main>
  );
}

export default App;
