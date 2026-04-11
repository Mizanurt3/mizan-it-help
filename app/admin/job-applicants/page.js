// app/admin/job-applicants/page.js
import pool from "@/lib/db";

export default async function JobApplicantsPage() {
  const result = await pool.query(`
    SELECT id, mobile, name, name_bn, father, nid, created_at 
    FROM job_applicants 
    ORDER BY created_at DESC
  `);

  const applicants = result.rows;

  return (
    <div style={{ padding: "30px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Job Applicants Management</h1>
      <p>Total Records: <strong>{applicants.length}</strong></p>

      {/* ==================== Add New Applicant Form ==================== */}
      <div style={{ 
        margin: "30px 0", 
        padding: "25px", 
        border: "1px solid #ccc", 
        borderRadius: "10px",
        background: "#f9f9f9"
      }}>
        <h2>Add New Customer / Applicant</h2>
        <form action="/api/job/save" method="POST" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          
          <input name="mobile" placeholder="Mobile Number *" required style={{ padding: "10px", borderRadius: "5px" }} />
          <input name="name" placeholder="Full Name (English) *" required />
          <input name="name_bn" placeholder="নাম (বাংলা)" />
          <input name="father" placeholder="Father's Name" />
          <input name="father_bn" placeholder="বাবার নাম (বাংলা)" />
          <input name="mother" placeholder="Mother's Name" />
          <input name="nid" placeholder="NID Number" />
          <input name="dob" type="date" placeholder="Date of Birth" />
          <input name="email" type="email" placeholder="Email Address" />
          
          <input name="present_district" placeholder="Present District" />
          <input name="present_upazila" placeholder="Present Upazila" />
          <input name="permanent_district" placeholder="Permanent District" />

          <button 
            type="submit"
            style={{ 
              gridColumn: "span 2", 
              padding: "14px", 
              background: "#006400", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Save New Applicant
          </button>
        </form>
      </div>

      {/* ==================== Applicants Table ==================== */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
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
                    onClick={() => alert(`Edit feature coming soon for ID: ${row.id}`)}
                    style={{ marginRight: "8px", padding: "6px 12px" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm(`Delete ${row.name} (${row.mobile})?`)) {
                        const res = await fetch(`/api/job/delete?mobile=${row.mobile}`, { method: "DELETE" });
                        const json = await res.json();
                        alert(json.message);
                        window.location.reload();
                      }
                    }}
                    style={{ background: "#dc2626", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}