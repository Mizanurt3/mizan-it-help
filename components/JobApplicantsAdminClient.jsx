// components/JobApplicantsAdminClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// ==================== Constants ====================
const districtList = [
  { value: "26", name: "Bagerhat" }, { value: "64", name: "Bandarban" }, { value: "32", name: "Barguna" },
  { value: "29", name: "Barishal" }, { value: "30", name: "Bhola" }, { value: "10", name: "Bogura" },
  { value: "54", name: "Brahmanbaria" }, { value: "56", name: "Chandpur" }, { value: "13", name: "Chapai Nawabganj" },
  { value: "60", name: "Chattogram" }, { value: "19", name: "Chuadanga" }, { value: "61", name: "Cox`s Bazar" },
  { value: "55", name: "Cumilla" }, { value: "40", name: "Dhaka" }, { value: "3", name: "Dinajpur" },
  { value: "45", name: "Faridpur" }, { value: "59", name: "Feni" }, { value: "8", name: "Gaibandha" },
  { value: "41", name: "Gazipur" }, { value: "47", name: "Gopalganj" }, { value: "53", name: "Habiganj" },
  { value: "36", name: "Jamalpur" }, { value: "23", name: "Jashore" }, { value: "28", name: "Jhalakathi" },
  { value: "20", name: "Jhenaidah" }, { value: "9", name: "Joypurhat" }, { value: "62", name: "Khagrachhari" },
  { value: "25", name: "Khulna" }, { value: "38", name: "Kishoreganj" }, { value: "7", name: "Kurigram" },
  { value: "17", name: "Kushtia" }, { value: "57", name: "Lakshmipur" }, { value: "5", name: "Lalmonirhat" },
  { value: "48", name: "Madaripur" }, { value: "21", name: "Magura" }, { value: "39", name: "Manikganj" },
  { value: "18", name: "Meherpur" }, { value: "52", name: "Moulvibazar" }, { value: "44", name: "Munshiganj" },
  { value: "34", name: "Mymensingh" }, { value: "11", name: "Naogaon" }, { value: "22", name: "Narail" },
  { value: "43", name: "Narayanganj" }, { value: "42", name: "Narsingdi" }, { value: "12", name: "Natore" },
  { value: "33", name: "Netrokona" }, { value: "4", name: "Nilphamari" }, { value: "58", name: "Noakhali" },
  { value: "16", name: "Pabna" }, { value: "1", name: "Panchagarh" }, { value: "31", name: "Patuakhali" },
  { value: "27", name: "Pirojpur" }, { value: "46", name: "Rajbari" }, { value: "14", name: "Rajshahi" },
  { value: "63", name: "Rangamati" }, { value: "6", name: "Rangpur" }, { value: "24", name: "Satkhira" },
  { value: "49", name: "Shariatpur" }, { value: "35", name: "Sherpur" }, { value: "15", name: "Sirajganj" },
  { value: "50", name: "Sunamganj" }, { value: "51", name: "Sylhet" }, { value: "37", name: "Tangail" },
  { value: "2", name: "Thakurgaon" }
];

const upazilaData = {
  "40": ["Dhaka Sadar", "Savar", "Keraniganj", "Dohar", "Nawabganj", "Tejgaon", "Mirpur", "Mohammadpur", "Gulshan"], 
  "41": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sripur", "Kaliganj"], 
  "60": ["Chattogram Sadar", "Anwara", "Banshkhali", "Boalkhali", "Fatikchhari", "Hathazari", "Mirsharai", "Patiya", "Rangunia", "Sandwip"], 
  "55": ["Cumilla Sadar", "Barura", "Brahmanpara", "Burichong", "Chandina", "Daudkandi", "Debidwar", "Homna", "Laksam", "Monoharganj"], 
  "14": ["Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Tanore"], 
  "25": ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Koyra", "Paikgacha", "Phultala", "Rupsa", "Terokhada"], 
  "6": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirganj", "Pirgachha"], 
  "51": ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Fenchuganj", "Golapganj", "Jaintiapur", "Kanaighat", "Zakiganj"], 
  "34": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha"], 
  "3": ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole"], 
  "10": ["Bogura Sadar", "Adamdighi", "Dhunat", "Gabtali", "Nandigram", "Sajahanpur", "Sherpur", "Shibganj", "Sonatala"], 
  "23": ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Benapole", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"], 
  "17": ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"], 
  "38": ["Kishoreganj Sadar", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliar Char", "Mithamain", "Nikli"], 
  "57": ["Lakshmipur Sadar", "Komol Nagar", "Raipur", "Ramganj", "Ramgati"], 
  "48": ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"], 
  "45": ["Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"], 
  "47": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"], 
  "46": ["Rajbari Sadar", "Baliakandi", "Goalanda", "Pangsha"], 
  "49": ["Shariatpur Sadar", "Damudya", "Gosairhat", "Naria", "Zanjira"], 
  "36": ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"], 
  "35": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"], 
  "37": ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur"], 
  "29": ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Uzirpur"], 
  "30": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"], 
  "31": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj"], 
  "27": ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"], 
  "32": ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata"], 
  "28": ["Jhalakathi Sadar", "Kathalia", "Nalchity", "Rajapur"], 
  "61": ["Cox's Bazar Sadar", "Chakaria", "Eidgaon", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhiya"], 
  "59": ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Sonagazi"], 
  "58": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Senbagh", "Sonaimuri", "Subarnachar"], 
  "56": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab", "Shahrasti"], 
  "54": ["Brahmanbaria Sadar", "Akhaura", "Ashuganj", "Banchharampur", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"], 
  "53": ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj"], 
  "52": ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"], 
  "50": ["Sunamganj Sadar", "Bishwambarpur", "Chhatak", "Dakshin Sunamganj", "Derai", "Dharampasha", "Jagannathpur", "Jamalganj", "Sulla", "Tahirpur"], 
  "63": ["Rangamati Sadar", "Barkal", "Juraichhari", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"], 
  "62": ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"], 
  "64": ["Bandarban Sadar", "Lama", "Naikhongchhari", "Ruma", "Thanchi"], 
  "26": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"], 
  "8": ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"], 
  "7": ["Kurigram Sadar", "Bhurungamari", "Chilmari", "Nageshwari", "Rajarhat", "Raumari", "Ulipur"], 
  "5": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"], 
  "4": ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"], 
  "1": ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tentulia"], 
  "2": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"], 
  "9": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"], 
  "11": ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"], 
  "12": ["Natore Sadar", "Baraigram", "Bagatipara", "Gurudaspur", "Lalpur", "Singra"], 
  "15": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"], 
  "16": ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"], 
  "18": ["Meherpur Sadar", "Gangni", "Mujibnagar"], 
  "19": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"], 
  "20": ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"], 
  "21": ["Magura Sadar", "Mohammadpur", "Shalikupa"], 
  "22": ["Narail Sadar", "Kalia", "Lohagara"], 
  "24": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"], 
  "33": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"]
};

const religions = ["Islam", "Hinduism", "Buddhism", "Christianity", "Others"];
const genders = ["Male", "Female", "Others"];
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
const quotas = ["General", "Freedom Fighter", "Women", "Ethnic Minority", "Disabled", "Non-Quota"];
const groups = ["Science", "Humanities", "Business Studies", "Vocational", "Others"];

const sscExams = ["S.S.C", "Dakhil", "S.S.C Vocational", "O Level/Cambridge", "S.S.C Equivalent", "Dakhil Vocational"];
const boards = ["Barishal", "Chittagong", "Cumilla", "Dhaka", "Dinajpur", "Jashore", "Madrasah", "Mymensingh", "Rajshahi", "Sylhet", "Open University", "Others"];
const resultTypes = ["1st Division", "2nd Division", "3rd Division", "GPA(out of 4)", "GPA(out of 5)"];
const years = Array.from({ length: 12 }, (_, i) => (2015 + i).toString());

export default function JobApplicantsAdminClient() {
  const searchParams = useSearchParams();

  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [userMobile, setUserMobile] = useState(null);

  const [presentUpazilas, setPresentUpazilas] = useState([]);
  const [permanentUpazilas, setPermanentUpazilas] = useState([]);

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

  // ==================== Get userMobile from URL ====================
  useEffect(() => {
    const urlMobile = searchParams.get("userMobile");
    if (urlMobile) {
      setUserMobile(urlMobile);
      loadApplicants(urlMobile);
    }
  }, [searchParams]);

  async function loadApplicants(currentUserMobile) {
    setLoading(true);
    try {
      const res = await fetch(`/api/job/fetch-all?userMobile=${currentUserMobile}`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
        setFilteredApplicants(data);
      } else {
        setMessage({ type: "error", text: "Failed to load applicants" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error while loading data" });
    }
    setLoading(false);
  }

  // Search Filter
  useEffect(() => {
    const filtered = applicants.filter(app =>
      app.customerMobile?.includes(searchTerm) || 
      app.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplicants(filtered);
  }, [searchTerm, applicants]);

  function handleDistrictChange(type, districtValue) {
    const upazilas = upazilaData[districtValue] || ["Sadar"];
    if (type === "present") {
      setPresentUpazilas(upazilas);
      setForm(prev => ({ ...prev, present_district: districtValue, present_upazila: "" }));
    } else {
      setPermanentUpazilas(upazilas);
      setForm(prev => ({ ...prev, permanent_district: districtValue, permanent_upazila: "" }));
    }
  }

  function handleEdit(app) {
    setForm({
      mobile: app.customerMobile || "",
      name: app.name || "", name_bn: app.name_bn || "",
      father: app.father || "", father_bn: app.father_bn || "",
      mother: app.mother || "", mother_bn: app.mother_bn || "",
      religion: app.religion || "", gender: app.gender || "",
      marital_status: app.marital_status || "", 
      spouse_name: app.spouse_name || "",
      email: app.email || "", 
      quota: app.quota || "", 
      dep_status: app.dep_status || "",
      nid: app.nid || "", breg: app.breg || "", passport: app.passport || "",
      dob: app.dob ? app.dob.split("T")[0] : "",
      present_careof: app.present_careof || "", present_village: app.present_village || "",
      present_district: app.present_district || "", present_post: app.present_post || "",
      present_postcode: app.present_postcode || "", present_upazila: app.present_upazila || "",
      permanent_careof: app.permanent_careof || "", permanent_village: app.permanent_village || "",
      permanent_district: app.permanent_district || "", permanent_post: app.permanent_post || "",
      permanent_postcode: app.permanent_postcode || "", permanent_upazila: app.permanent_upazila || "",
      ssc_exam: app.ssc_exam || "", ssc_board: app.ssc_board || "", ssc_roll: app.ssc_roll || "",
      ssc_year: app.ssc_year || "", ssc_group: app.ssc_group || "", 
      ssc_result_type: app.ssc_result_type || "", ssc_result: app.ssc_result || "",
      hsc_exam: app.hsc_exam || "", hsc_board: app.hsc_board || "", hsc_roll: app.hsc_roll || "",
      hsc_year: app.hsc_year || "", hsc_group: app.hsc_group || "", 
      hsc_result_type: app.hsc_result_type || "", hsc_result: app.hsc_result || "",
      gra_exam: app.gra_exam || "", gra_subject: app.gra_subject || "", gra_institute: app.gra_institute || "",
      gra_year: app.gra_year || "", gra_duration: app.gra_duration || "", 
      gra_result_type: app.gra_result_type || "", gra_result: app.gra_result || "",
      mas_exam: app.mas_exam || "", mas_subject: app.mas_subject || "", mas_institute: app.mas_institute || "",
      mas_year: app.mas_year || "", mas_duration: app.mas_duration || "", 
      mas_result_type: app.mas_result_type || "", mas_result: app.mas_result || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!userMobile) {
      setMessage({ type: "error", text: "Please login first" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    const payload = { ...form, userMobile };

    const res = await fetch("/api/job/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.status === "success") {
      setMessage({ type: "success", text: "✅ Saved Successfully!" });
      loadApplicants(userMobile);
      resetForm();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.message || "Save Failed") });
    }
    setSaving(false);
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
  }

  async function handleDelete(customerMobile) {
    if (!confirm(`Delete applicant ${customerMobile}?`)) return;
    if (!userMobile) return;

    const res = await fetch(`/api/job/delete?customerMobile=${customerMobile}&userMobile=${userMobile}`, {
      method: "DELETE"
    });

    const result = await res.json();
    if (result.status === "success") {
      setMessage({ type: "success", text: "✅ Deleted Successfully" });
      loadApplicants(userMobile);
    } else {
      setMessage({ type: "error", text: "❌ " + (result.message || "Delete failed") });
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1450px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#006400" }}>
        Job Applicants Management (My Data Only)
      </h1>

      {message.text && (
        <div style={{
          padding: "15px", marginBottom: "20px", borderRadius: "8px",
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "green" : "red", textAlign: "center"
        }}>
          {message.text}
        </div>
      )}

      {/* Search and Clear Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Mobile or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "420px", padding: "12px 16px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={resetForm} 
          style={{ padding: "12px 30px", background: "#666", color: "white", border: "none", borderRadius: "8px", fontSize: "16px" }}
        >
          Clear Form
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading your data...</p>
      ) : (
        <div style={{ overflowX: "auto", marginBottom: "40px" }}>
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#006400", color: "white" }}>
                <th>Customer Mobile</th>
                <th>Name</th>
                <th>Name (BN)</th>
                <th>Father</th>
                <th>NID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(app => (
                <tr key={app.id || app.customerMobile}>
                  <td>{app.customerMobile}</td>
                  <td>{app.name}</td>
                  <td>{app.name_bn}</td>
                  <td>{app.father}</td>
                  <td>{app.nid}</td>
                  <td>
                    <button onClick={() => handleEdit(app)} style={{ marginRight: "12px", padding: "8px 18px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}>Edit</button>
                    <button onClick={() => handleDelete(app.customerMobile)} style={{ padding: "8px 18px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================== FORM ====================== */}
      <form onSubmit={handleSave} style={{ background: "#f9f9f9", padding: "35px", borderRadius: "12px", boxShadow: "0 4px 25px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "25px", color: "#006400" }}>
          {form.mobile ? `Edit Applicant - ${form.mobile}` : "Add New Applicant"}
        </h2>

        {/* Basic Information */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>Basic Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <input placeholder="Customer Mobile *" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
            <input placeholder="Name (English)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="নাম (বাংলা)" value={form.name_bn} onChange={e => setForm({ ...form, name_bn: e.target.value })} />
            <input placeholder="Father's Name" value={form.father} onChange={e => setForm({ ...form, father: e.target.value })} />
            <input placeholder="Father BN" value={form.father_bn} onChange={e => setForm({ ...form, father_bn: e.target.value })} />
            <input placeholder="Mother's Name" value={form.mother} onChange={e => setForm({ ...form, mother: e.target.value })} />
            <input placeholder="Mother BN" value={form.mother_bn} onChange={e => setForm({ ...form, mother_bn: e.target.value })} />
            <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            <select value={form.religion} onChange={e => setForm({ ...form, religion: e.target.value })}>
              <option value="">Religion</option>{religions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option value="">Gender</option>{genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={form.marital_status} onChange={e => setForm({ ...form, marital_status: e.target.value })}>
              <option value="">Marital Status</option>{maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input placeholder="Spouse Name" value={form.spouse_name} onChange={e => setForm({ ...form, spouse_name: e.target.value })} />
            <select value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })}>
              <option value="">Quota</option>{quotas.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <input placeholder="Dep Status" value={form.dep_status} onChange={e => setForm({ ...form, dep_status: e.target.value })} />
            <input placeholder="NID" value={form.nid} onChange={e => setForm({ ...form, nid: e.target.value })} />
            <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        {/* Present Address */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>Present Address</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <select value={form.present_district} onChange={e => handleDistrictChange("present", e.target.value)} required>
              <option value="">Select District</option>
              {districtList.map(d => <option key={d.value} value={d.value}>{d.name}</option>)}
            </select>
            <select value={form.present_upazila} onChange={e => setForm({ ...form, present_upazila: e.target.value })} required>
              <option value="">Select Upazila</option>
              {presentUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input placeholder="Care Of" value={form.present_careof} onChange={e => setForm({ ...form, present_careof: e.target.value })} />
            <input placeholder="Village/Road/House" value={form.present_village} onChange={e => setForm({ ...form, present_village: e.target.value })} />
            <input placeholder="Post Office" value={form.present_post} onChange={e => setForm({ ...form, present_post: e.target.value })} />
            <input placeholder="Post Code" value={form.present_postcode} onChange={e => setForm({ ...form, present_postcode: e.target.value })} />
          </div>
        </div>

        {/* Permanent Address */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>Permanent Address</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <select value={form.permanent_district} onChange={e => handleDistrictChange("permanent", e.target.value)} required>
              <option value="">Select District</option>
              {districtList.map(d => <option key={d.value} value={d.value}>{d.name}</option>)}
            </select>
            <select value={form.permanent_upazila} onChange={e => setForm({ ...form, permanent_upazila: e.target.value })} required>
              <option value="">Select Upazila</option>
              {permanentUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input placeholder="Care Of" value={form.permanent_careof} onChange={e => setForm({ ...form, permanent_careof: e.target.value })} />
            <input placeholder="Village/Road/House" value={form.permanent_village} onChange={e => setForm({ ...form, permanent_village: e.target.value })} />
            <input placeholder="Post Office" value={form.permanent_post} onChange={e => setForm({ ...form, permanent_post: e.target.value })} />
            <input placeholder="Post Code" value={form.permanent_postcode} onChange={e => setForm({ ...form, permanent_postcode: e.target.value })} />
          </div>
        </div>

        {/* SSC Section */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>SSC / Equivalent</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <select value={form.ssc_exam} onChange={e => setForm({ ...form, ssc_exam: e.target.value })}>
              <option value="">Select Exam</option>
              {sscExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
            <select value={form.ssc_board} onChange={e => setForm({ ...form, ssc_board: e.target.value })}>
              <option value="">Select Board</option>
              {boards.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={form.ssc_result_type} onChange={e => setForm({ ...form, ssc_result_type: e.target.value })}>
              <option value="">Result Type</option>
              {resultTypes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={form.ssc_year} onChange={e => setForm({ ...form, ssc_year: e.target.value })}>
              <option value="">Passing Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <input placeholder="Roll No" value={form.ssc_roll} onChange={e => setForm({ ...form, ssc_roll: e.target.value })} />
            <input placeholder="Group" value={form.ssc_group} onChange={e => setForm({ ...form, ssc_group: e.target.value })} />
            <input placeholder="Result" value={form.ssc_result} onChange={e => setForm({ ...form, ssc_result: e.target.value })} />
          </div>
        </div>

        {/* HSC Section */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>HSC / Equivalent</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <select value={form.hsc_exam} onChange={e => setForm({ ...form, hsc_exam: e.target.value })}>
              <option value="">Select Exam</option>
              {sscExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
            <select value={form.hsc_board} onChange={e => setForm({ ...form, hsc_board: e.target.value })}>
              <option value="">Select Board</option>
              {boards.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={form.hsc_result_type} onChange={e => setForm({ ...form, hsc_result_type: e.target.value })}>
              <option value="">Result Type</option>
              {resultTypes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={form.hsc_year} onChange={e => setForm({ ...form, hsc_year: e.target.value })}>
              <option value="">Passing Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <input placeholder="Roll No" value={form.hsc_roll} onChange={e => setForm({ ...form, hsc_roll: e.target.value })} />
            <input placeholder="Group" value={form.hsc_group} onChange={e => setForm({ ...form, hsc_group: e.target.value })} />
            <input placeholder="Result" value={form.hsc_result} onChange={e => setForm({ ...form, hsc_result: e.target.value })} />
          </div>
        </div>

        {/* Graduation Section */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>Graduation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <input placeholder="Exam" value={form.gra_exam} onChange={e => setForm({ ...form, gra_exam: e.target.value })} />
            <input placeholder="Subject" value={form.gra_subject} onChange={e => setForm({ ...form, gra_subject: e.target.value })} />
            <input placeholder="Institute" value={form.gra_institute} onChange={e => setForm({ ...form, gra_institute: e.target.value })} />
            <input placeholder="Year" value={form.gra_year} onChange={e => setForm({ ...form, gra_year: e.target.value })} />
            <input placeholder="Duration" value={form.gra_duration} onChange={e => setForm({ ...form, gra_duration: e.target.value })} />
            <select value={form.gra_result_type} onChange={e => setForm({ ...form, gra_result_type: e.target.value })}>
              <option value="">Result Type</option>
              {resultTypes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input placeholder="Result" value={form.gra_result} onChange={e => setForm({ ...form, gra_result: e.target.value })} />
          </div>
        </div>

        {/* Masters Section */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#006400", color: "white", padding: "12px 18px", borderRadius: "8px" }}>Masters</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "18px" }}>
            <input placeholder="Exam" value={form.mas_exam} onChange={e => setForm({ ...form, mas_exam: e.target.value })} />
            <input placeholder="Subject" value={form.mas_subject} onChange={e => setForm({ ...form, mas_subject: e.target.value })} />
            <input placeholder="Institute" value={form.mas_institute} onChange={e => setForm({ ...form, mas_institute: e.target.value })} />
            <input placeholder="Year" value={form.mas_year} onChange={e => setForm({ ...form, mas_year: e.target.value })} />
            <input placeholder="Duration" value={form.mas_duration} onChange={e => setForm({ ...form, mas_duration: e.target.value })} />
            <select value={form.mas_result_type} onChange={e => setForm({ ...form, mas_result_type: e.target.value })}>
              <option value="">Result Type</option>
              {resultTypes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input placeholder="Result" value={form.mas_result} onChange={e => setForm({ ...form, mas_result: e.target.value })} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <button 
            type="submit" 
            disabled={saving || !userMobile} 
            style={{ padding: "16px 70px", background: "#006400", color: "white", border: "none", borderRadius: "8px", fontSize: "18px" }}
          >
            {saving ? "Saving..." : form.mobile ? "Update Applicant" : "Save New Applicant"}
          </button>
        </div>
      </form>


    </div>
  );
}