import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F5F7FB] min-h-screen">

      {/* Sidebar — receives open state + close handler */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header — receives handler to open sidebar on mobile */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Main content area:
          - On mobile: full width (sidebar is drawer overlay)
          - On md+: offset by sidebar width (ml-64)
      */}
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 page-enter">
          <Outlet />
        </div>
      </main>

    </div>
  );
}