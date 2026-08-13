// src/Services/api.js
const API_BASE = "https://pick-list.onrender.com/api";

function getHeaders(token, contentType = "application/json") {
  const headers = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ─── AUTH APIs ───
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: getHeaders(null),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function registerUser(name, email, password, role) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: getHeaders(null),
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function logoutUser(token) {
  try {
    const res = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: getHeaders(token),
    });
    return await res.json();
  } catch (err) {
    console.error("Logout API call error:", err);
    return null;
  }
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: getHeaders(null),
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function resetPassword(email, otp, newPassword) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: getHeaders(null),
    body: JSON.stringify({ email, otp, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ─── USER & WORKER APIs ───
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function fetchWorkers() {
  const res = await fetch(`${API_BASE}/workers`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ─── PICKLIST APIs ───
export async function fetchPicklists(token) {
  const res = await fetch(`${API_BASE}/picklist`, {
    headers: getHeaders(token, null),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function createPicklist(token, payload) {
  const res = await fetch(`${API_BASE}/picklist`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function requestReupdatePicklist(token, picklistId, partnos, note) {
  const res = await fetch(`${API_BASE}/picklist/${picklistId}/reupdate`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ partnos, note }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function deletePicklistByNo(token, pickListNumber) {
  const res = await fetch(`${API_BASE}/picklist/${encodeURIComponent(pickListNumber)}`, {
    method: "DELETE",
    headers: getHeaders(token, null),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function deleteAllPicklists(token) {
  const res = await fetch(`${API_BASE}/picklist/delete`, {
    method: "DELETE",
    headers: getHeaders(token, null),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function proceedWithShortage(token, picklistId) {
  const res = await fetch(`${API_BASE}/picklist/${picklistId}/proceed`, {
    method: "PATCH",
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}


// ─── REPORT APIs ───
export async function downloadPicklistReportExcel(token, picklistId, filename = "picklist-report.xlsx") {
  const res = await fetch(`${API_BASE}/picklist/${picklistId}/report/excel`, {
    headers: getHeaders(token, null),
  });
  if (!res.ok) throw new Error("Failed to download Excel report");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function downloadPicklistReportCSV(token, picklistId, filename = "picklist-report.csv") {
  const res = await fetch(`${API_BASE}/picklist/${picklistId}/report/csv`, {
    headers: getHeaders(token, null),
  });
  if (!res.ok) throw new Error("Failed to download CSV report");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function downloadGlobalReportExcel(token, filename = "Global-Warehouse-Report.xlsx") {
  const res = await fetch(`${API_BASE}/picklist/report/all/excel`, {
    headers: getHeaders(token, null),
  });
  if (!res.ok) throw new Error("Failed to download Global Excel report");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

// ─── DELIVERY ROUTE APIs ───
export async function fetchDeliveryRoutes(token) {
  const res = await fetch(`${API_BASE}/delivery-routes`, {
    headers: getHeaders(token, null),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function importDeliveryRoutesExcel(token, rawFile) {
  const res = await fetch(`${API_BASE}/delivery-routes/import`, {
    method: "POST",
    headers: getHeaders(token, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    body: rawFile, // raw binary file/Blob/ArrayBuffer
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function addDeliveryRoutes(token, routesArray) {
  const res = await fetch(`${API_BASE}/delivery-routes`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ routes: routesArray }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function deleteDeliveryRoutes(token, idsArray) {
  const res = await fetch(`${API_BASE}/delivery-routes`, {
    method: "DELETE",
    headers: getHeaders(token),
    body: JSON.stringify({ ids: idsArray }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ─── AUDIT APIs ───
export async function fetchAuditUserEvents(token, date) {
  const res = await fetch(`${API_BASE}/audit/user-events?date=${date}`, {
    headers: getHeaders(token, null),
  });
  return res.ok ? res.json() : null;
}

export async function fetchAuditRouteEvents(token, date) {
  const res = await fetch(`${API_BASE}/audit/route-events?date=${date}`, {
    headers: getHeaders(token, null),
  });
  return res.ok ? res.json() : null;
}

export async function fetchAuditManagerProgress(token, date) {
  const res = await fetch(`${API_BASE}/audit/manager-progress?date=${date}`, {
    headers: getHeaders(token, null),
  });
  return res.ok ? res.json() : null;
}

export async function fetchAuditWorkerProgress(token, date) {
  const res = await fetch(`${API_BASE}/audit/worker-progress?date=${date}`, {
    headers: getHeaders(token, null),
  });
  return res.ok ? res.json() : null;
}