import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  ClipboardList,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronRight,
  Hash,
  Inbox,
  Boxes
} from "lucide-react";
import { fetchWorkers as fetchWorkersApi, fetchPicklists as fetchPicklistsApi } from "../Services/api";

export default function Workers() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [workers, setWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] = useState(true);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [assignedPicklists, setAssignedPicklists] = useState([]);
  const [picklistsLoading, setPicklistsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH WORKERS =================
  const loadWorkers = async () => {
    try {
      setWorkersLoading(true);
      const data = await fetchWorkersApi();
      setWorkers(data.workers || data || []);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    } finally {
      setWorkersLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // ================= SELECT WORKER & FETCH ASSIGNED PICKLISTS =================
  const handleSelectWorker = async (worker) => {
    setSelectedWorker(worker);
    setPicklistsLoading(true);
    try {
      const all = await fetchPicklistsApi(token);
      const list = Array.isArray(all) ? all : all.picklists || [];

      const filtered = list.filter((p) => {
        const wId = p.workerId?._id || p.workerId;
        return wId === worker._id;
      });

      setAssignedPicklists(filtered);
    } catch (err) {
      console.error("Failed to fetch assigned picklists:", err);
      setAssignedPicklists([]);
    } finally {
      setPicklistsLoading(false);
    }
  };

  const goBackToWorkers = () => {
    setSelectedWorker(null);
    setAssignedPicklists([]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ═══════════════════════════════════════
            STEP 1: WORKER LIST
        ═══════════════════════════════════════ */}
        {!selectedWorker && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Worker Directory</h1>
                  <p className="text-sm text-gray-500">Warehouse worker directory & assignment tracking</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                {workers.length} workers registered
              </span>
            </div>

            {/* Workers Grid */}
            {workersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : workers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">No workers found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workers.map((w) => (
                  <div
                    key={w._id}
                    onClick={() => handleSelectWorker(w)}
                    className="group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm border border-blue-100">
                        {(w.name || w.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{w.name || w.email}</p>
                        <p className="text-xs text-gray-500">{w.email} • <span className="capitalize">{w.role}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="grid grid-cols-3 gap-4 text-center hidden sm:grid">
                        <div className="px-3 py-1 bg-gray-50 rounded-lg">
                          <p className="text-xs font-bold text-gray-800">{w.involvedPicklists || 0}</p>
                          <p className="text-[10px] text-gray-400">Total</p>
                        </div>
                        <div className="px-3 py-1 bg-emerald-50 rounded-lg">
                          <p className="text-xs font-bold text-emerald-700">{w.completedPicklists || 0}</p>
                          <p className="text-[10px] text-emerald-600">Done</p>
                        </div>
                        <div className="px-3 py-1 bg-amber-50 rounded-lg">
                          <p className="text-xs font-bold text-amber-700">{w.pendingPicklists || 0}</p>
                          <p className="text-[10px] text-amber-600">Pending</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════
            STEP 2: WORKER ASSIGNED PICKLISTS
        ═══════════════════════════════════════ */}
        {selectedWorker && (
          <div className="space-y-6">
            {/* Back + Worker Info */}
            <button
              onClick={goBackToWorkers}
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Workers
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
                  {(selectedWorker.name || selectedWorker.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedWorker.name || selectedWorker.email}</h2>
                  <p className="text-sm text-gray-500">{selectedWorker.email} • <span className="capitalize">{selectedWorker.role}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Involved Picklists</p>
                  <p className="text-lg font-bold text-blue-900">{selectedWorker.involvedPicklists || assignedPicklists.length}</p>
                </div>
              </div>
            </div>

            {/* Assigned Picklists List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Assigned Picklists</h3>

              {picklistsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : assignedPicklists.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-medium">No active picklists currently assigned to this worker</p>
                </div>
              ) : (
                assignedPicklists.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/picklists/${item.pick_list_no}`)}
                    className="group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {item.pick_list_no}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Order: {item.order_number || "—"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${item.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        item.status === "completed_with_shortage" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                        {item.status?.replace(/_/g, " ")}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}