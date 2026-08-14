// src/Components/StatusBadge.jsx
import {
  Clock,
  Package,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const STATUS_MAP = {
  not_assigned: {
    label: "Not Assigned",
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  },
  unassigned: {
    label: "Not Assigned",
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  },
  assigned: {
    label: "Assigned",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Package,
  },
  processing: {
    label: "Processing",
    classes: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Loader2,
    spin: true,
  },
  completed: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  completed_with_shortage: {
    label: "Shortage",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertTriangle,
  },
  reupdate_requested: {
    label: "Correction Needed",
    classes: "bg-rose-50 text-rose-700 border-rose-200",
    icon: RefreshCw,
  },
  reupdate_completed: {
    label: "Corrected",
    classes: "bg-teal-50 text-teal-700 border-teal-200",
    icon: CheckCircle2,
  },
};

const DEFAULT = {
  label: "Unknown",
  classes: "bg-slate-100 text-slate-500 border-slate-200",
  icon: Clock,
};

export default function StatusBadge({ status, size = "md" }) {
  const key = (status || "").toLowerCase().replace(/ /g, "_");
  const config = STATUS_MAP[key] || DEFAULT;
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${sizeClasses} ${config.classes}`}
    >
      <Icon
        className={[
          size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5",
          config.spin ? "animate-spin" : "",
        ].join(" ")}
      />
      {config.label}
    </span>
  );
}