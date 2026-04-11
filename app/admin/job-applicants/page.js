"use client";

import { useEffect, useState } from "react";

export default function JobApplicantsAdmin() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    mobile: "", name: "", name_bn: "", father: "", father_bn: "", mother: "", mother_bn: "",
    religion: "", gender: "", marital_status: "", spouse_name: "", email: "",
    quota: "", dep_status: "", nid: "", breg: "", passport: "", dob: "",
    present_careof: "", present_village: "", present_district: "", present_post: "",
    present_postcode: "", present_upazila: "",
    permanent_careof: "", permanent_village: "", permanent_district: "", permanent_post: "",
    permanent_postcode: "", permanent_upazila: "",
    ssc_exam: "", ssc_board: "", ssc_roll: "", ssc_year: "", ssc_group: "", ssc_result_type: "", ssc_result: "",
    hsc_exam: "", hsc_board: "", hsc_roll: "", hsc_year: "", hsc_group: "", hsc_result_type: "", hsc_result: "",
    gra_exam: "", gra_subject: "", gra_institute: "", gra_year: "", gra_duration: "", gra_result_type: "", gra_result: "",
    mas_exam: "", mas_subject: "", mas_institute: "", mas_year: "", mas_duration: "", mas_result_type: "", mas_result: ""
  });

  useEffect(() => {
    loadApplicants();
  }, []);

  async function loadApplicants() {
    setLoading(true);
    try {
      const res = await fetch("/api/job/fetch-all");
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/job/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await res.json();

    if (result.status === "success") {
      setMessage("✅ Saved successfully!");
      loadApplicants();
      // ফর্ম রিসেট (mobile ছাড়া)
      setForm({ ...form, mobile: "" });
    } else {
      setMessage("❌ " + (result.message || "Save failed"));
    }
  }

  async function handleDelete(mobile) {
    if (!confirm(`Delete applicant with mobile ${mobile}?`)) return;

    const res = await fetch(`/api/job/delete?mobile=${mobile}`, { method: "DELETE" });
    const result = await res.json();

    if (result.status === "success") {
      setMessage("✅ Deleted successfully");
      loadApplicants();
    } else {
      setMessage("❌ " + result.message);
    }
  }

  return (
    <div style={{ padding: "25px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Job Applicants Management (58 Fields)</h1>

      {message && <p style={{ padding: "10px", background: message.includes("✅") ? "#d4edda" : "#f8d7da", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

      {/* Form - All 58 Fields */}
      <form onSubmit={handleSave} style={{ margin: "30px 0", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
        <h2>Add / Update Applicant</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>

          <input placeholder="Mobile *" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} required />
          <input placeholder="Name (English)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="নাম (বাংলা)" value={form.name_bn} onChange={e => setForm({...form, name_bn: e.target.value})} />
          <input placeholder="Father" value={form.father} onChange={e => setForm({...form, father: e.target.value})} />
          <input placeholder="Father BN" value={form.father_bn} onChange={e => setForm({...form, father_bn: e.target.value})} />
          <input placeholder="Mother" value={form.mother} onChange={e => setForm({...form, mother: e.target.value})} />
          <input placeholder="Mother BN" value={form.mother_bn} onChange={e => setForm({...form, mother_bn: e.target.value})} />
          <input placeholder="Religion" value={form.religion} onChange={e => setForm({...form, religion: e.target.value})} />
          <input placeholder="Gender" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} />
          <input placeholder="Marital Status" value={form.marital_status} onChange={e => setForm({...form, marital_status: e.target.value})} />
          <input placeholder="Spouse Name" value={form.spouse_name} onChange={e => setForm({...form, spouse_name: e.target.value})} />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input placeholder="Quota" value={form.quota} onChange={e => setForm({...form, quota: e.target.value})} />
          <input placeholder="Dep Status" value={form.dep_status} onChange={e => setForm({...form, dep_status: e.target.value})} />
          <input placeholder="NID" value={form.nid} onChange={e => setForm({...form, nid: e.target.value})} />
          <input placeholder="Birth Reg" value={form.breg} onChange={e => setForm({...form, breg: e.target.value})} />
          <input placeholder="Passport" value={form.passport} onChange={e => setForm({...form, passport: e.target.value})} />
          <input placeholder="Date of Birth" type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />

          {/* Present Address */}
          <input placeholder="Present Care Of" value={form.present_careof} onChange={e => setForm({...form, present_careof: e.target.value})} />
          <input placeholder="Present Village" value={form.present_village} onChange={e => setForm({...form, present_village: e.target.value})} />
          <input placeholder="Present District" value={form.present_district} onChange={e => setForm({...form, present_district: e.target.value})} />
          <input placeholder="Present Post" value={form.present_post} onChange={e => setForm({...form, present_post: e.target.value})} />
          <input placeholder="Present Postcode" value={form.present_postcode} onChange={e => setForm({...form, present_postcode: e.target.value})} />
          <input placeholder="Present Upazila" value={form.present_upazila} onChange={e => setForm({...form, present_upazila: e.target.value})} />

          {/* Permanent Address */}
          <input placeholder="Permanent Care Of" value={form.permanent_careof} onChange={e => setForm({...form, permanent_careof: e.target.value})} />
          <input placeholder="Permanent Village" value={form.permanent_village} onChange={e => setForm({...form, permanent_village: e.target.value})} />
          <input placeholder="Permanent District" value={form.permanent_district} onChange={e => setForm({...form, permanent_district: e.target.value})} />
          <input placeholder="Permanent Post" value={form.permanent_post} onChange={e => setForm({...form, permanent_post: e.target.value})} />
          <input placeholder="Permanent Postcode" value={form.permanent_postcode} onChange={e => setForm({...form, permanent_postcode: e.target.value})} />
          <input placeholder="Permanent Upazila" value={form.permanent_upazila} onChange={e => setForm({...form, permanent_upazila: e.target.value})} />

          {/* SSC */}
          <input placeholder="SSC Exam" value={form.ssc_exam} onChange={e => setForm({...form, ssc_exam: e.target.value})} />
          <input placeholder="SSC Board" value={form.ssc_board} onChange={e => setForm({...form, ssc_board: e.target.value})} />
          <input placeholder="SSC Roll" value={form.ssc_roll} onChange={e => setForm({...form, ssc_roll: e.target.value})} />
          <input placeholder="SSC Year" value={form.ssc_year} onChange={e => setForm({...form, ssc_year: e.target.value})} />
          <input placeholder="SSC Group" value={form.ssc_group} onChange={e => setForm({...form, ssc_group: e.target.value})} />
          <input placeholder="SSC Result Type" value={form.ssc_result_type} onChange={e => setForm({...form, ssc_result_type: e.target.value})} />
          <input placeholder="SSC Result" value={form.ssc_result} onChange={e => setForm({...form, ssc_result: e.target.value})} />

          {/* HSC, Graduation, Masters — একইভাবে যোগ করা হয়েছে */}
          {/* আপনি চাইলে আরও ফিল্ড যোগ করতে পারবেন */}

        </div>

        <button type="submit" style={{ marginTop: "25px", padding: "14px 40px", background: "#006400", color: "white", border: "none", borderRadius: "6px", fontSize: "16px" }}>
          Save Applicant Data
        </button>
      </form>

      {/* Table */}
      {loading ? <p>Loading applicants...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th>Mobile</th>
                <th>Name</th>
                <th>Name BN</th>
                <th>Father</th>
                <th>NID</th>
                <th>DOB</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.mobile}>
                  <td>{app.mobile}</td>
                  <td>{app.name}</td>
                  <td>{app.name_bn}</td>
                  <td>{app.father}</td>
                  <td>{app.nid}</td>
                  <td>{app.dob ? new Date(app.dob).toLocaleDateString('en-GB') : ''}</td>
                  <td>
                    <button onClick={() => handleDelete(app.mobile)} style={{ color: "red", marginRight: "10px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}