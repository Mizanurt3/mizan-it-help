"use client";

import { useEffect, useState } from "react";

export default function JobApplicantsAdmin() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingMobile, setEditingMobile] = useState(null); // Edit mode চেক করার জন্য

  // 58 Fields Form State
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

  // Edit করার জন্য ফর্মে ডাটা লোড করা
  function handleEdit(applicant) {
    setForm({
      mobile: applicant.mobile || "",
      name: applicant.name || "",
      name_bn: applicant.name_bn || "",
      father: applicant.father || "",
      father_bn: applicant.father_bn || "",
      mother: applicant.mother || "",
      mother_bn: applicant.mother_bn || "",
      religion: applicant.religion || "",
      gender: applicant.gender || "",
      marital_status: applicant.marital_status || "",
      spouse_name: applicant.spouse_name || "",
      email: applicant.email || "",
      quota: applicant.quota || "",
      dep_status: applicant.dep_status || "",
      nid: applicant.nid || "",
      breg: applicant.breg || "",
      passport: applicant.passport || "",
      dob: applicant.dob ? applicant.dob.split("T")[0] : "", // date format fix
      present_careof: applicant.present_careof || "",
      present_village: applicant.present_village || "",
      present_district: applicant.present_district || "",
      present_post: applicant.present_post || "",
      present_postcode: applicant.present_postcode || "",
      present_upazila: applicant.present_upazila || "",
      permanent_careof: applicant.permanent_careof || "",
      permanent_village: applicant.permanent_village || "",
      permanent_district: applicant.permanent_district || "",
      permanent_post: applicant.permanent_post || "",
      permanent_postcode: applicant.permanent_postcode || "",
      permanent_upazila: applicant.permanent_upazila || "",
      ssc_exam: applicant.ssc_exam || "",
      ssc_board: applicant.ssc_board || "",
      ssc_roll: applicant.ssc_roll || "",
      ssc_year: applicant.ssc_year || "",
      ssc_group: applicant.ssc_group || "",
      ssc_result_type: applicant.ssc_result_type || "",
      ssc_result: applicant.ssc_result || "",
      hsc_exam: applicant.hsc_exam || "",
      hsc_board: applicant.hsc_board || "",
      hsc_roll: applicant.hsc_roll || "",
      hsc_year: applicant.hsc_year || "",
      hsc_group: applicant.hsc_group || "",
      hsc_result_type: applicant.hsc_result_type || "",
      hsc_result: applicant.hsc_result || "",
      gra_exam: applicant.gra_exam || "",
      gra_subject: applicant.gra_subject || "",
      gra_institute: applicant.gra_institute || "",
      gra_year: applicant.gra_year || "",
      gra_duration: applicant.gra_duration || "",
      gra_result_type: applicant.gra_result_type || "",
      gra_result: applicant.gra_result || "",
      mas_exam: applicant.mas_exam || "",
      mas_subject: applicant.mas_subject || "",
      mas_institute: applicant.mas_institute || "",
      mas_year: applicant.mas_year || "",
      mas_duration: applicant.mas_duration || "",
      mas_result_type: applicant.mas_result_type || "",
      mas_result: applicant.mas_result || ""
    });
    setEditingMobile(applicant.mobile);
    setMessage(`Editing: ${applicant.mobile}`);
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
      resetForm();
    } else {
      setMessage("❌ " + (result.message || "Save failed"));
    }
  }

  function resetForm() {
    setForm({
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
    setEditingMobile(null);
  }

  async function handleDelete(mobile) {
    if (!confirm(`Delete ${mobile}?`)) return;

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
      <h1>Job Applicants Management</h1>

      {message && (
        <p style={{ 
          padding: "12px", 
          background: message.includes("✅") ? "#d4edda" : "#f8d7da", 
          color: message.includes("✅") ? "green" : "red", 
          borderRadius: "6px" 
        }}>
          {message}
        </p>
      )}

      {/* Form - All 58 Fields */}
      <form onSubmit={handleSave} style={{ margin: "30px 0", padding: "25px", border: "1px solid #ccc", borderRadius: "10px", background: "#f9f9f9" }}>
        <h2>{editingMobile ? `Edit Applicant (${editingMobile})` : "Add New Applicant"}</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
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

          {/* HSC */}
          <input placeholder="HSC Exam" value={form.hsc_exam} onChange={e => setForm({...form, hsc_exam: e.target.value})} />
          <input placeholder="HSC Board" value={form.hsc_board} onChange={e => setForm({...form, hsc_board: e.target.value})} />
          <input placeholder="HSC Roll" value={form.hsc_roll} onChange={e => setForm({...form, hsc_roll: e.target.value})} />
          <input placeholder="HSC Year" value={form.hsc_year} onChange={e => setForm({...form, hsc_year: e.target.value})} />
          <input placeholder="HSC Group" value={form.hsc_group} onChange={e => setForm({...form, hsc_group: e.target.value})} />
          <input placeholder="HSC Result Type" value={form.hsc_result_type} onChange={e => setForm({...form, hsc_result_type: e.target.value})} />
          <input placeholder="HSC Result" value={form.hsc_result} onChange={e => setForm({...form, hsc_result: e.target.value})} />

          {/* Graduation & Masters (সংক্ষেপে) */}
          <input placeholder="Graduation Exam" value={form.gra_exam} onChange={e => setForm({...form, gra_exam: e.target.value})} />
          <input placeholder="Graduation Subject" value={form.gra_subject} onChange={e => setForm({...form, gra_subject: e.target.value})} />
          <input placeholder="Graduation Institute" value={form.gra_institute} onChange={e => setForm({...form, gra_institute: e.target.value})} />
          <input placeholder="Graduation Year" value={form.gra_year} onChange={e => setForm({...form, gra_year: e.target.value})} />
          <input placeholder="Graduation Duration" value={form.gra_duration} onChange={e => setForm({...form, gra_duration: e.target.value})} />
          <input placeholder="Graduation Result" value={form.gra_result} onChange={e => setForm({...form, gra_result: e.target.value})} />

          <input placeholder="Masters Exam" value={form.mas_exam} onChange={e => setForm({...form, mas_exam: e.target.value})} />
          <input placeholder="Masters Subject" value={form.mas_subject} onChange={e => setForm({...form, mas_subject: e.target.value})} />
          <input placeholder="Masters Institute" value={form.mas_institute} onChange={e => setForm({...form, mas_institute: e.target.value})} />
          <input placeholder="Masters Year" value={form.mas_year} onChange={e => setForm({...form, mas_year: e.target.value})} />
          <input placeholder="Masters Duration" value={form.mas_duration} onChange={e => setForm({...form, mas_duration: e.target.value})} />
          <input placeholder="Masters Result" value={form.mas_result} onChange={e => setForm({...form, mas_result: e.target.value})} />
        </div>

        <div style={{ marginTop: "25px" }}>
          <button 
            type="submit" 
            style={{ padding: "14px 40px", background: "#006400", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", marginRight: "10px" }}
          >
            {editingMobile ? "Update Applicant" : "Save New Applicant"}
          </button>

          <button 
            type="button" 
            onClick={resetForm}
            style={{ padding: "14px 30px", background: "#666", color: "white", border: "none", borderRadius: "6px" }}
          >
            Clear Form
          </button>
        </div>
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
                    <button 
                      onClick={() => handleEdit(app)} 
                      style={{ marginRight: "10px", padding: "6px 12px", background: "#0070f3", color: "white", border: "none", borderRadius: "4px" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(app.mobile)} 
                      style={{ padding: "6px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px" }}
                    >
                      Delete
                    </button>
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