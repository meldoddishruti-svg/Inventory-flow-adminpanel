import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Trash2,
  AlertCircle,
  ClipboardList,
  Hash,
  Package,
  ArrowLeft,
  Loader2,
  X,
  FileX,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Boxes,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Info,
  QrCode,
  ListFilter
} from "lucide-react";
import {
  fetchPicklists,
  deletePicklistByNo,
  requestReupdatePicklist,
  downloadPicklistReportExcel,
  downloadPicklistReportCSV
} from "../Services/api";

/* ─── Confirmation Modal ─── */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status, size = "md" }) {
  const normalized = (status || "pending").toLowerCase();

  const styles = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    completed_with_shortage: "bg-amber-50 text-amber-700 border-amber-100",
    reupdate_requested: "bg-rose-50 text-rose-700 border-rose-100",
    reupdate_completed: "bg-teal-50 text-teal-700 border-teal-100",
    processing: "bg-blue-50 text-blue-700 border-blue-100",
    unassigned: "bg-gray-50 text-gray-600 border-gray-100",
    assigned: "bg-blue-50 text-blue-700 border-blue-100",
    default: "bg-gray-50 text-gray-600 border-gray-100",
  };

  const icons = {
    completed: CheckCircle2,
    completed_with_shortage: AlertTriangle,
    reupdate_requested: RefreshCw,
    reupdate_completed: CheckCircle2,
    processing: Loader2,
    unassigned: Clock,
    assigned: Package,
    default: AlertCircle,
  };

  const style = styles[normalized] || styles.default;
  const Icon = icons[normalized] || icons.default;

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-[11px] gap-1"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${sizeClasses} ${style}`}>
      <Icon className={`${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} ${normalized === "processing" ? "animate-spin" : ""}`} />
      <span className="capitalize">{(status || "Pending").replace(/_/g, " ")}</span>
    </span>
  );
}

/* ─── Skeleton Loading State ─── */
function SkeletonHeader() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/4" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/5" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border-b border-gray-50 flex gap-4 items-center">
          <div className="h-4 bg-gray-200 rounded w-8" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded flex-1" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─── */
function NotFoundState({ onBack }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-6 bg-red-50 rounded-2xl mb-6">
        <FileX className="w-12 h-12 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Picklist Not Found</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        The picklist you're looking for doesn't exist or may have been deleted.
      </p>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Picklists
      </button>
    </div>
  );
}

/* ─── Toast Component ─── */
function Toast({ message, type, onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-right-full duration-300">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border backdrop-blur-sm ${type === "success"
        ? "bg-white/95 border-green-200 text-green-800"
        : "bg-white/95 border-red-200 text-red-800"
        }`}>
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        )}
        <p className="text-sm font-semibold">{message}</p>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function PickListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Manager Re-update Request State
  const [showReupdateModal, setShowReupdateModal] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [reupdateNote, setReupdateNote] = useState("");
  const [isRequestingReupdate, setIsRequestingReupdate] = useState(false);

  // Downloads State
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadPicklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPicklist = async () => {
    try {
      setLoading(true);
      const all = await fetchPicklists(token);
      const list = Array.isArray(all) ? all : all.picklists || [];
      const found = list.find(
        (p) =>
          p.pick_list_no?.toLowerCase() === id?.toLowerCase() ||
          p._id === id
      );
      setData(found || null);
    } catch (err) {
      console.error("Failed to load picklist:", err);
      showToast(err.message || "Failed to load picklist details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // ✅ FIX: Pass pick_list_no string (e.g. PL-1001), NOT MongoDB _id
      await deletePicklistByNo(token, data.pick_list_no);
      setShowDeleteModal(false);
      navigate("/picklists");
    } catch (err) {
      console.error("❌ Delete error:", err);
      showToast(err.message || "Delete failed", "error");
      setIsDeleting(false);
    }
  };

  const handleReupdateSubmit = async (e) => {
    e.preventDefault();
    if (selectedParts.length === 0) {
      showToast("Please select at least one part to request re-update.", "error");
      return;
    }
    setIsRequestingReupdate(true);
    try {
      const res = await requestReupdatePicklist(token, data._id, selectedParts, reupdateNote);
      setData(res.picklist || data);
      setShowReupdateModal(false);
      setSelectedParts([]);
      setReupdateNote("");
      showToast("Re-update requested successfully!", "success");
      loadPicklist();
    } catch (err) {
      console.error("Reupdate error:", err);
      showToast(err.message || "Failed to request re-update.", "error");
    } finally {
      setIsRequestingReupdate(false);
    }
  };

  const togglePartSelection = (partno) => {
    setSelectedParts((prev) =>
      prev.includes(partno) ? prev.filter((p) => p !== partno) : [...prev, partno]
    );
  };

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      await downloadPicklistReportExcel(token, data._id, `Report-${data.pick_list_no}.xlsx`);
      showToast("Excel report downloaded!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to download Excel report.", "error");
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloadingCSV(true);
    try {
      await downloadPicklistReportCSV(token, data._id, `Report-${data.pick_list_no}.csv`);
      showToast("CSV report downloaded!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to download CSV report.", "error");
    } finally {
      setDownloadingCSV(false);
    }
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Picklists</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-300">Loading...</span>
          </div>
          <SkeletonHeader />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <NotFoundState onBack={() => navigate("/picklists")} />
        </div>
      </div>
    );
  }

  const completedParts = data.parts?.filter((p) =>
    (p.status || "").toLowerCase() === "completed"
  ).length || 0;

  const totalParts = data.parts?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/picklists")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Picklists
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

            {/* Left: Info */}
            <div className="space-y-5 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 rounded-xl">
                  <ClipboardList className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Pick List Detail
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-0.5">
                    {data.pick_list_no}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Hash className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Order No</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{data.order_number || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Parts</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{totalParts}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Boxes className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {completedParts} <span className="text-gray-400 font-normal">/ {totalParts}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <StatusBadge status={data.status} />

              <div className="flex flex-wrap items-center gap-2">
                {/* Excel Report */}
                <button
                  onClick={handleDownloadExcel}
                  disabled={downloadingExcel}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all"
                  title="Download Excel Report"
                >
                  {downloadingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                  Excel
                </button>

                {/* CSV Report */}
                <button
                  onClick={handleDownloadCSV}
                  disabled={downloadingCSV}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all"
                  title="Download CSV Report"
                >
                  {downloadingCSV ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  CSV
                </button>

                {/* Request Re-update (Manager) */}
                <button
                  onClick={() => setShowReupdateModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-all"
                  title="Request Part Re-update"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-update
                </button>

                {/* Delete */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                  title="Delete Picklist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Parts & Scan History Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Parts & Scan History
            </h2>
            <span className="text-xs font-medium text-gray-400">
              {totalParts} item{totalParts !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 w-14">ID</th>
                  <th className="px-6 py-4">Part Number</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 w-24 text-right">Req Qty</th>
                  <th className="px-6 py-4 w-24 text-right">Allo Qty</th>
                  <th className="px-6 py-4 w-28">Status</th>
                  <th className="px-6 py-4">Scanned History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.parts?.map((part, index) => (
                  <tr
                    key={index}
                    className="group bg-white hover:bg-purple-50/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-mono text-xs font-semibold border border-purple-100">
                        {part.partno}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium max-w-xs truncate">
                      {part.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-bold text-xs">
                        {part.req_qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-md text-xs font-bold ${(part.allo_qty || 0) >= (part.req_qty || 0)
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                        }`}>
                        {part.allo_qty || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={part.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      {part.scanned_items && part.scanned_items.length > 0 ? (
                        <div className="space-y-1">
                          {part.scanned_items.map((scan, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                              <QrCode className="w-3 h-3 text-purple-500 shrink-0" />
                              <span className="font-mono text-[10px] font-semibold">{scan.unique_id || "Manual Entry"}</span>
                              <span className="text-gray-400">({scan.entry_method || "QR"})</span>
                              {scan.scannedAt && (
                                <span className="ml-auto text-[10px] text-gray-400">
                                  {new Date(scan.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No scans recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalParts === 0 && (
            <div className="py-16 text-center">
              <div className="inline-flex p-4 bg-gray-50 rounded-full mb-3">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No parts in this picklist</h3>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Picklist"
        message={`Are you sure you want to delete picklist "${data.pick_list_no}"? This action cannot be undone and will remove all associated parts.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />

      {/* Manager Re-update Request Modal */}
      {showReupdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowReupdateModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowReupdateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 rounded-xl">
                <RefreshCw className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Request Re-update / Rework</h3>
                <p className="text-xs text-gray-500">Flag specific parts for recount or verification</p>
              </div>
            </div>

            <form onSubmit={handleReupdateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Parts Requiring Re-update
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
                  {data.parts?.map((p) => {
                    const isSelected = selectedParts.includes(p.partno);
                    return (
                      <label
                        key={p.partno}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${isSelected
                          ? "bg-amber-50 border-amber-300 text-amber-900"
                          : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePartSelection(p.partno)}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500/20"
                        />
                        <span className="font-mono text-xs font-bold">{p.partno}</span>
                        <span className="text-xs text-gray-500 truncate flex-1">{p.description}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Rework Instructions / Note
                </label>
                <textarea
                  rows={3}
                  value={reupdateNote}
                  onChange={(e) => setReupdateNote(e.target.value)}
                  placeholder="e.g. Please recount items in box B-12"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReupdateModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequestingReupdate || selectedParts.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-amber-200 transition-all disabled:opacity-60"
                >
                  {isRequestingReupdate ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}