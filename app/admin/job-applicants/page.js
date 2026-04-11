export default async function JobApplicantsPage() {
  // Server Component — middleware ইতিমধ্যে admin চেক করে দিয়েছে
  const pool = (await import("@/lib/db")).default;

  const result = await pool.query(`
    SELECT id, mobile, name, name_bn, father, nid, created_at, updated_at 
    FROM job_applicants 
    ORDER BY created_at DESC
  `);

  const applicants = result.rows;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Job Applicants Management</h1>
      <p>Total Records: <strong>{applicants.length}</strong></p>

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>ID</th>
              <th>Mobile</th>
              <th>Name</th>
              <th>Name (BN)</th>
              <th>Father</th>
              <th>NID</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.mobile}</td>
                <td>{row.name}</td>
                <td>{row.name_bn}</td>
                <td>{row.father}</td>
                <td>{row.nid}</td>
                <td>{new Date(row.created_at).toLocaleDateString('en-GB')}</td>
                <td>
                  <button 
                    onClick={() => alert(`Edit ID ${row.id} — Full edit form coming soon`)}
                    style={{ marginRight: "10px", padding: "6px 12px", background: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={async () => {
                      if (!confirm(`Delete ${row.name} (${row.mobile})?`)) return;
                      const res = await fetch(`/api/job/delete?mobile=${row.mobile}`, { method: "DELETE" });
                      const json = await res.json();
                      alert(json.message || json.error);
                      if (json.status === "success") window.location.reload();
                    }}
                    style={{ padding: "6px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {applicants.length === 0 && <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>No data yet.</p>}
    </div>
  );
}