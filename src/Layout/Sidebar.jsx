import { NavLink, useNavigate } from "react-router-dom";
import {
  Warehouse,
  LayoutDashboard,
  ClipboardList,
  Users,
  Truck,
  FileText,
  ClipboardCheck,
  MessageCircle,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",   icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pick Lists",  icon: ClipboardList,   path: "/picklists"  },
  { label: "Workers",     icon: Users,           path: "/workers"    },
  { label: "Delivery",    icon: Truck,           path: "/delivery"   },
  { label: "Reports",     icon: FileText,        path: "/reports"    },
  { label: "Audit",       icon: ClipboardCheck,  path: "/audit"      },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    onClose?.();
  };

  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={[
          "fixed left-0 top-0 h-screen w-64 z-50",
          "bg-slate-900 flex flex-col",
          "sidebar-transition",
          // Mobile: hidden by default, slides in when open
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible
          "md:translate-x-0",
        ].join(" ")}
      >
        {/* ─── Logo area ─── */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 ring-1 ring-indigo-500/30">
              <Warehouse className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <span className="block text-[15px] font-bold text-white tracking-tight leading-none">
                InventoryFlow
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">
                Admin Panel
              </span>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Navigation ─── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">
            Main Menu
          </p>

          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={[
                      "w-[18px] h-[18px] shrink-0 transition-colors duration-200",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300",
                    ].join(" ")}
                  />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-300 opacity-70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ─── Bottom section ─── */}
        <div className="px-3 pb-5 border-t border-slate-700/60 pt-4 space-y-1">
          <a
            href="mailto:support@inventoryflow.com"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          >
            <MessageCircle className="w-[18px] h-[18px] shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <span>Support</span>
          </a>

          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>

          {/* User profile card */}
          <div className="mt-3 mx-0.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user.name || user.email || "User"}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {user.role || "Manager"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}