// app/admin/job-applicants/page.js
import pool from "@/lib/db";

export default async function JobApplicantsPage() {
  const result = await pool.query(`
    SELECT * FROM job_applicants 
    ORDER BY created_at DESC
  `);

  const applicants = result.rows;

  return (
    <div style={{ padding: "30px", fontFamily: "system-ui, sans-serif", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>Job Applicants Management</h1>
      <p>Total Records: <strong>{applicants.length}</strong></p>

      {/* Add New Applicant Form */}
      <div style={{ 
        margin: "30px 0", 
        padding: "25px", 
        border: "1px solid #ccc", 
        borderRadius: "10px",
        background: "#f9f9f9"
      }}>
        <h2>Add / Update Applicant</h2>
        <form action="/api/job/save" method="POST" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input name="mobile" placeholder="Mobile Number *" required style={{ padding: "10px" }} />
          <input name="name" placeholder="Full Name (English) *" required />
          <input name="name_bn" placeholder="নাম (বাংলা)" />
          <input name="father" placeholder="Father's Name" />
          <input name="father_bn" placeholder="বাবার নাম (বাংলা)" />
          <input name="mother" placeholder="Mother's Name" />
          <input name="mother_bn" placeholder="মায়ের নাম (বাংলা)" />
          <input name="nid" placeholder="NID Number" />
          <input name="breg" placeholder="Birth Registration" />
          <input name="dob" type="date" />
          <input name="email" type="email" placeholder="Email" />
          <input name="religion" placeholder="Religion" />
          <input name="gender" placeholder="Gender" />
          <input name="marital_status" placeholder="Marital Status" />
          <input name="quota" placeholder="Quota" />
          <input name="dep_status" placeholder="Department Status" />

          {/* Present Address */}
          <input name="present_careof" placeholder="Present Care Of" />
          <input name="present_village" placeholder="Present Village" />
          <input name="present_district" placeholder="Present District" />
          <input name="present_upazila" placeholder="Present Upazila" />
          <input name="present_post" placeholder="Present Post" />
          <input name="present_postcode" placeholder="Present Postcode" />

          {/* Permanent Address */}
          <input name="permanent_careof" placeholder="Permanent Care Of" />
          <input name="permanent_village" placeholder="Permanent Village" />
          <input name="permanent_district" placeholder="Permanent District" />
          <input name="permanent_upazila" placeholder="Permanent Upazila" />
          <input name="permanent_post" placeholder="Permanent Post" />
          <input name="permanent_postcode" placeholder="Permanent Postcode" />

          {/* Education (সংক্ষেপে) */}
          <input name="ssc_roll" placeholder="SSC Roll" />
          <input name="ssc_year" placeholder="SSC Year" />
          <input name="hsc_roll" placeholder="HSC Roll" />
          <input name="hsc_year" placeholder="HSC Year" />

          <button 
            type="submit"
            style={{ 
              gridColumn: "span 2", 
              padding: "14px", 
              background: "#006400", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              fontSize: "17px",
              cursor: "pointer",
              marginTop: "15px"
            }}
          >
            Save Applicant Data
          </button>
        </form>
      </div>

      {/* Full Table */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>ID</th>
              <th>Mobile</th>
              <th>Name</th>
              <th>Name BN</th>
              <th>Father</th>
              <th>NID</th>
              <th>DOB</th>
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
                <td>{row.dob ? new Date(row.dob).toLocaleDateString('en-GB') : ''}</td>
                <td>{new Date(row.created_at).toLocaleDateString('en-GB')}</td>
                <td>
                  <button onClick={() => alert(`Edit coming soon for ${row.mobile}`)} style={{ marginRight: "8px" }}>
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
                    style={{ background: "red", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px" }}
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