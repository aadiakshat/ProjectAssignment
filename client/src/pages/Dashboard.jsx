import { useState, useEffect } from "react";
import { api } from "../api";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCurrency(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSummary(), api.getCategories(), api.getTrends(), api.getRecent()])
      .then(([s, c, t, r]) => {
        setSummary(s.summary);
        setCategories(c.breakdown);
        setTrends(t.trends);
        setRecent(r.activity);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  const maxCatTotal = Math.max(...categories.map((c) => c.total), 1);

  const monthGroups = {};
  trends.forEach((t) => {
    const key = `${t.year}-${t.month}`;
    if (!monthGroups[key]) monthGroups[key] = { year: t.year, month: t.month, income: 0, expense: 0 };
    monthGroups[key][t.type] = t.total;
  });
  const monthData = Object.values(monthGroups).sort((a, b) => a.year - b.year || a.month - b.month).slice(-6);
  const maxTrend = Math.max(...monthData.flatMap((m) => [m.income, m.expense]), 1);

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Financial overview and analytics</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">
            <span className="stat-dot" style={{ background: "var(--green)" }} />
            Total Income
          </div>
          <div className="stat-value" style={{ color: "var(--green)" }}>
            {formatCurrency(summary?.totalIncome || 0)}
          </div>
          <div className="stat-sub">{summary?.totalRecords || 0} total records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <span className="stat-dot" style={{ background: "var(--red)" }} />
            Total Expenses
          </div>
          <div className="stat-value" style={{ color: "var(--red)" }}>
            {formatCurrency(summary?.totalExpenses || 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <span className="stat-dot" style={{ background: "var(--accent)" }} />
            Net Balance
          </div>
          <div className="stat-value">
            {formatCurrency(summary?.netBalance || 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <span className="stat-dot" style={{ background: "var(--amber)" }} />
            Records
          </div>
          <div className="stat-value">{summary?.totalRecords || 0}</div>
        </div>
      </div>

      <div className="section-grid">
        <div className="panel">
          <div className="panel-title">Category Breakdown</div>
          <div className="bar-chart">
            {categories.slice(0, 8).map((cat, i) => (
              <div className="bar-row" key={i}>
                <div className="bar-label">{cat.category}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(cat.total / maxCatTotal) * 100}%`,
                      background: cat.type === "income" ? "var(--green)" : "var(--red)",
                      opacity: 0.75,
                    }}
                  />
                </div>
                <div className="bar-amount">{formatCurrency(cat.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Monthly Trends</div>
          <div className="trend-chart">
            {monthData.map((m, i) => (
              <div className="trend-bar-group" key={i}>
                <div className="trend-bars">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${(m.income / maxTrend) * 100}%`,
                      background: "var(--green)",
                      opacity: 0.65,
                    }}
                  />
                  <div
                    className="trend-bar"
                    style={{
                      height: `${(m.expense / maxTrend) * 100}%`,
                      background: "var(--red)",
                      opacity: 0.65,
                    }}
                  />
                </div>
                <div className="trend-label">{MONTHS[m.month - 1]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel panel-full">
          <div className="panel-title">Recent Activity</div>
          {recent.length === 0 ? (
            <div className="empty-state"><p>No activity yet</p></div>
          ) : (
            <div className="activity-list">
              {recent.map((item) => (
                <div className="activity-item" key={item._id}>
                  <div className={`activity-icon ${item.type}`}>
                    {item.type === "income" ? "↗" : "↙"}
                  </div>
                  <div className="activity-details">
                    <p>{item.category}</p>
                    <span>
                      {item.description || "No description"} · {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div className={`activity-amount ${item.type}`}>
                    {item.type === "income" ? "+" : "−"}{formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
