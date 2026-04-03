import { useState, useEffect } from "react";
import { api } from "../api";

const ROLES = ["viewer", "analyst", "admin"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data.users);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.updateUser(id, { role });
      showToast("Role updated");
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.updateUser(id, { isActive: !currentStatus });
      showToast(currentStatus ? "User deactivated" : "User activated");
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Users</h2>
        <p>Manage user accounts and permissions</p>
      </div>

      <div className="records-table-wrap">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td className="td-mono">{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>
                    <span className={`status-dot ${u.isActive ? "active" : "inactive"}`} />
                    {u.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="td-mono">{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>
                    <div className="table-actions">
                      <select
                        className="btn btn-ghost btn-sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{ padding: "4px 8px", fontSize: "11px" }}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button
                        className={`btn btn-sm ${u.isActive ? "btn-danger" : "btn-ghost"}`}
                        onClick={() => toggleStatus(u._id, u.isActive)}
                      >
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
