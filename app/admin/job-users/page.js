// app/admin/job-users/page.js
import pool from "@/lib/db";

export default async function JobUsersAdmin() {
  const result = await pool.query(`
    SELECT 
      u."mobileNumber",
      u.status,
      u."createdAt",
      u."lastLoginAt",
      db."deviceId"
    FROM users u
    LEFT JOIN device_bindings db ON u."mobileNumber" = db."userMobile"
    ORDER BY u."createdAt" DESC
  `);

  const users = result.rows;

  return (
    <div style={{ padding: "30px", fontFamily: "system-ui, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Job Users Management (Admin Panel)</h1>
      <p>Total Users: <strong>{users.length}</strong></p>

      <table border="1" cellPadding="12" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
        <thead>
          <tr style={{ background: "#006400", color: "white" }}>
            <th>Mobile Number</th>
            <th>Status</th>
            <th>Device ID</th>
            <th>Created At</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.mobileNumber} style={{ borderBottom: "1px solid #ddd" }}>
              <td><strong>{user.mobileNumber}</strong></td>
              <td>
                <span style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  backgroundColor: user.status === "ACTIVE" ? "#22c55e" : user.status === "PENDING" ? "#eab308" : "#ef4444",
                  color: "white"
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                {user.deviceId || "—"}
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
              <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-GB') : "—"}</td>
              <td>
                {user.status === "PENDING" && (
                  <button 
                    onClick={async () => {
                      if (confirm(`Approve user ${user.mobileNumber}?`)) {
                        await fetch('/api/admin/approve', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ mobileNumber: user.mobileNumber })
                        });
                        window.location.reload();
                      }
                    }}
                    style={{ marginRight: "8px", padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Approve
                  </button>
                )}

                <button 
                  onClick={async () => {
                    if (confirm(`Remove device binding for ${user.mobileNumber}?`)) {
                      await fetch('/api/admin/remove-device', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mobileNumber: user.mobileNumber })
                      });
                      window.location.reload();
                    }
                  }}
                  style={{ padding: "8px 16px", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Remove Device
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>No users found yet.</p>}
    </div>
  );
}