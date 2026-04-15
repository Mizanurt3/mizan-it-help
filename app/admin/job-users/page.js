"use client";

import { useEffect, useState } from "react";

export default function JobUsersAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load users" });
    }
    setLoading(false);
  }

  async function handleApprove(mobileNumber) {
    if (!confirm(`Approve user ${mobileNumber}?`)) return;

    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: `✅ ${mobileNumber} approved successfully` });
        loadUsers();
      } else {
        setMessage({ type: "error", text: result.message || "Approve failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  async function handleBlock(mobileNumber) {
    if (!confirm(`BLOCK user ${mobileNumber}?`)) return;

    try {
      const res = await fetch('/api/admin/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: `⛔ ${mobileNumber} has been blocked` });
        loadUsers();
      } else {
        setMessage({ type: "error", text: result.message || "Block failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  // নতুন ফাংশন — Unblock / Activate
  async function handleUnblock(mobileNumber) {
    if (!confirm(`Unblock and activate user ${mobileNumber}?`)) return;

    try {
      const res = await fetch('/api/admin/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: `✅ ${mobileNumber} has been unblocked and activated` });
        loadUsers();
      } else {
        setMessage({ type: "error", text: result.message || "Unblock failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  async function handleRemoveDevice(mobileNumber) {
    if (!confirm(`Remove device binding for ${mobileNumber}?`)) return;

    try {
      const res = await fetch('/api/admin/remove-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: `✅ Device binding removed for ${mobileNumber}` });
        loadUsers();
      } else {
        setMessage({ type: "error", text: result.message || "Remove failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  async function handleChangeDevice(mobileNumber) {
    const newDeviceId = prompt(`Enter NEW Device ID for ${mobileNumber}:`);
    if (!newDeviceId || !newDeviceId.trim()) return;

    if (!confirm(`Change device for ${mobileNumber} to:\n${newDeviceId}\n\nAre you sure?`)) return;

    try {
      const res = await fetch('/api/admin/change-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, newDeviceId: newDeviceId.trim() })
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: `✅ Device changed successfully for ${mobileNumber}` });
        loadUsers();
      } else {
        setMessage({ type: "error", text: result.message || "Device change failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  if (loading) return <p style={{ padding: "30px" }}>Loading users...</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "system-ui, sans-serif", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>Job Users Management (Admin Panel)</h1>
      
      {/* Search Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Mobile Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px 16px",
            width: "100%",
            maxWidth: "400px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "8px",
            outline: "none"
          }}
        />
        {searchTerm && (
          <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
            Showing {filteredUsers.length} result(s) for "<strong>{searchTerm}</strong>"
          </p>
        )}
      </div>

      <p>Total Users: <strong>{users.length}</strong></p>

      {message.text && (
        <div style={{
          padding: "12px 20px",
          margin: "15px 0",
          borderRadius: "8px",
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "#155724" : "#721c24"
        }}>
          {message.text}
        </div>
      )}

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
          {filteredUsers.map((user) => (
            <tr key={user.mobileNumber} style={{ borderBottom: "1px solid #ddd" }}>
              <td><strong>{user.mobileNumber}</strong></td>
              <td>
                <span style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  backgroundColor: user.status === "ACTIVE" ? "#22c55e" : 
                                  user.status === "PENDING" ? "#eab308" : "#ef4444",
                  color: "white"
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ fontFamily: "monospace", fontSize: "12px", wordBreak: "break-all" }}>
                {user.deviceId || "—"}
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
              <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-GB') : "—"}</td>
              <td>
                {/* Approve Button - শুধু PENDING অবস্থায় */}
                {user.status === "PENDING" && (
                  <button 
                    onClick={() => handleApprove(user.mobileNumber)}
                    style={{ margin: "4px", padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Approve
                  </button>
                )}

                {/* Block Button - ACTIVE বা PENDING থাকলে */}
                {(user.status === "ACTIVE" || user.status === "PENDING") && (
                  <button 
                    onClick={() => handleBlock(user.mobileNumber)}
                    style={{ margin: "4px", padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Block
                  </button>
                )}

                {/* Unblock Button - শুধু BLOCKED অবস্থায় দেখাবে */}
                {user.status === "BLOCKED" && (
                  <button 
                    onClick={() => handleUnblock(user.mobileNumber)}
                    style={{ margin: "4px", padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Unblock & Activate
                  </button>
                )}

                <button 
                  onClick={() => handleRemoveDevice(user.mobileNumber)}
                  style={{ margin: "4px", padding: "8px 16px", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Remove Device
                </button>

                <button 
                  onClick={() => handleChangeDevice(user.mobileNumber)}
                  style={{ margin: "4px", padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Change Device
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && !loading && (
        <p style={{ textAlign: "center", marginTop: "40px", color: "#666", fontSize: "16px" }}>
          No users found matching "<strong>{searchTerm}</strong>"
        </p>
      )}
    </div>
  );
}