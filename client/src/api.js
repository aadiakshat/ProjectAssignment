const API_BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.errors?.map((e) => e.message).join(", ") || "Request failed");
  }

  return data;
};

export const api = {
  login: (body) => request("/users/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/users/register", { method: "POST", body: JSON.stringify(body) }),
  getProfile: () => request("/users/me"),
  getUsers: () => request("/users"),
  updateUser: (id, body) => request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  getRecords: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    return request(`/records?${query}`);
  },
  getRecord: (id) => request(`/records/${id}`),
  createRecord: (body) => request("/records", { method: "POST", body: JSON.stringify(body) }),
  updateRecord: (id, body) => request(`/records/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteRecord: (id) => request(`/records/${id}`, { method: "DELETE" }),

  getSummary: () => request("/dashboard/summary"),
  getCategories: () => request("/dashboard/categories"),
  getTrends: () => request("/dashboard/trends"),
  getRecent: (limit = 8) => request(`/dashboard/recent?limit=${limit}`),
};
