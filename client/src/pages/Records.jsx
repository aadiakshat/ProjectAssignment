import { useState, useEffect } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function formatCurrency(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

const CATEGORIES = ["Salary", "Freelance", "Rent", "Groceries", "Utilities", "Travel", "Entertainment", "Healthcare", "Other"];

export default function Records() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "", category: "", page: 1 });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await api.getRecords({ ...filters, limit: 12 });
      setRecords(data.records);
      setPagination(data.pagination);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [filters.page, filters.type, filters.category]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (formData) => {
    try {
      if (modal.mode === "edit") {
        await api.updateRecord(modal.data._id, formData);
        showToast("Record updated");
      } else {
        await api.createRecord(formData);
        showToast("Record created");
      }
      setModal(null);
      fetchRecords();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      await api.deleteRecord(id);
      showToast("Record deleted");
      fetchRecords();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Records</h2>
        <p>View and manage financial entries</p>
      </div>

      <div className="records-toolbar">
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {isAdmin && (
          <button className="btn btn-primary ml-auto" onClick={() => setModal({ mode: "create", data: {} })}>
            + New Record
          </button>
        )}
      </div>

      <div className="records-table-wrap">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : records.length === 0 ? (
          <div className="empty-state"><p>No records found</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Created By</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td className="td-mono">{new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>{r.category}</td>
                  <td><span className={`type-badge ${r.type}`}>{r.type}</span></td>
                  <td className="td-mono">{formatCurrency(r.amount)}</td>
                  <td><span className="text-truncate">{r.description || "—"}</span></td>
                  <td>{r.createdBy?.name || "—"}</td>
                  {isAdmin && (
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ mode: "edit", data: r })}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Del</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {pagination.pages > 1 && (
          <div className="pagination">
            <span>Page {pagination.page} of {pagination.pages} ({pagination.total} records)</span>
            <div className="pagination-btns">
              <button className="btn btn-ghost btn-sm" disabled={pagination.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Prev</button>
              <button className="btn btn-ghost btn-sm" disabled={pagination.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <RecordModal
          mode={modal.mode}
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

function RecordModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState({
    amount: initial.amount || "",
    type: initial.type || "income",
    category: initial.category || "",
    date: initial.date ? initial.date.split("T")[0] : new Date().toISOString().split("T")[0],
    description: initial.description || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, amount: Number(form.amount) });
    setSaving(false);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === "edit" ? "Edit Record" : "New Record"}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" min="0.01" value={form.amount} onChange={set("amount")} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={set("type")}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={set("category")} required>
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={set("date")} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={set("description")} placeholder="Optional note" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
