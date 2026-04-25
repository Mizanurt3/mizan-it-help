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
const quotas = ["Child of Freedom Fighter", "Child of War Heroine (Birangana)", "Ethnic Minority", "Not Applicable"];
const dep_statuses  = ["Govt. Employee", "Semi Govt. Employee", "Autonomous", "Departmental Candidate", "Not Applicable"];

const ssc_groups = ["Science", "Humanities", "Business Studies", "Vocational", "Others"];

const ssc_vocational_groups = [
    "Agro-Based Food",
    "Architectural Drafting with CAD",
    "Automotive",
    "Building Maintenance",
    "Ceramic",
    "Civil Construction",
    "Civil Drafting with CAD",
    "Computer and Information Technology",
    "Dress Making",
    "Dyeing, Printing and Finishing",
    "Electrical Maintenance Works",
    "Farm Machinery",
    "Fish Culture and Breeding",
    "Food Processing and Preservation",
    "Fruit and Vegetable Cultivation",
    "General Electrical Works",
    "General Electronics",
    "General Mechanics",
    "Glass",
    "Knitting",
    "Livestock Rearing and Farming",
    "Machine Tools Operation",
    "Mechanical Drafting with CAD",
    "Patient Care Technique",
    "Plumbing and Pipe Fittings",
    "Poultry Rearing and Farming",
    "Refrigeration and Air Conditioning",
    "Shrimp Culture and Breeding",
    "Welding and Fabrication",
    "Wood Working",
    "Other"
];

const sscExams = ["S.S.C", "Dakhil", "S.S.C Vocational", "O Level/Cambridge", "S.S.C Equivalent", "Dakhil Vocational"];

const hscExams = ["H.S.C", "Alim", "Business Management", "Diploma-in-Engineering", "A Level/Sr. Cambridge", "H.S.C Equivalent", "Diploma-in-Medival Technology","H.S.C Vocational","H.S.C (BM)","Diploma in Pharmacy", "C in ED"];
const hscGroups = [
    "Business Studies",
    "Education",
    "General",
    "Humanities",
    "Science",
    "Other"
];
const hscVocationalGroups = [
    "Agro Machinery",
    "Automobile",
    "Building Construction and Maintenance",
    "Clothing and Garments Finishing",
    "Computer Operation and Maintenance",
    "Drafting Civil",
    "Electrical Works and Maintenance",
    "Electronic Control and Communication",
    "Fish Culture and Breeding",
    "Industrial Wood Working",
    "Machine Tools Operation and Maintenance",
    "Poultry Rearing and Farming",
    "Refrigeration and Air-conditioning",
    "Welding and Fabrication",
    "Other"
];
//const boards = ["Barishal", "Chittagong", "Cumilla", "Dhaka", "Dinajpur", "Jashore", "Madrasah", "Mymensingh", "Rajshahi", "Sylhet", "Open University", "Others"];
const boards = [
    "Barishal",
    "Chittagong",
    "Cumilla",
    "Dhaka",
    "Dinajpur",
    "Jashore",
    "Madrasah",
    "Mymensingh",
    "Rajshahi",
    "Sylhet",
    "Open University",
    "Edexcel International",
    "Cambridge International - IGCE",
    "Pharmacy Council of Bangladesh",
    "The State Medical Faculty of Bangladesh",
    "Bangladesh Technical Education Board (BTEB)",
    "Other"
];
const resultTypes = ["1st Division", "2nd Division", "3rd Division", "GPA(out of 4)", "GPA(out of 5)"];
const years = Array.from({ length: 40 }, (_, i) => (1991 + i).toString());

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
    religion: "", gender: "", marital_status: "", spouse_name: "", email: "", others: "",
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
      others: app.others || "",
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
      quota: "", dep_status: "", nid: "", breg: "", passport: "", dob: "",others: "",
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
     {/* Basic Information */}
<div style={{ marginBottom: "40px" }}>
  <h3 style={{ 
    background: "#006400", 
    color: "white", 
    padding: "12px 18px", 
    borderRadius: "8px",
    marginBottom: "25px"
  }}>
    Basic Information
  </h3>

  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "240px 1fr", 
    gap: "18px 30px", 
    alignItems: "center" 
  }}>

    {/* Mobile Number */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Mobile Number <span style={{ color: "red" }}>*</span>
    </label>
    <input 
      placeholder="Enter Mobile Number" 
      value={form.mobile} 
      onChange={e => setForm({ ...form, mobile: e.target.value })} 
      required 
      style={{ width: "100%" }}
    />

    {/* Applicant's Name English */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Applicant's Name
    </label>
    <input 
      placeholder="Enter Name in English" 
      value={form.name} 
      onChange={e => setForm({ ...form, name: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Applicant's Name Bengali */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      আবেদনকারীর নাম (বাংলায়)
    </label>
    <input 
      placeholder="বাংলায় নাম লিখুন" 
      value={form.name_bn} 
      onChange={e => setForm({ ...form, name_bn: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Father's Name */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Father's Name
    </label>
    <input 
      placeholder="Father's Name" 
      value={form.father} 
      onChange={e => setForm({ ...form, father: e.target.value })} 
      style={{ width: "100%" }}
    />

    <label style={{ textAlign: "right", fontWeight: "500" }}>
      পিতার নাম (বাংলায়)
    </label>
    <input 
      placeholder="পিতার নাম (বাংলা)" 
      value={form.father_bn} 
      onChange={e => setForm({ ...form, father_bn: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Mother's Name */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Mother's Name
    </label>
    <input 
      placeholder="Mother's Name" 
      value={form.mother} 
      onChange={e => setForm({ ...form, mother: e.target.value })} 
      style={{ width: "100%" }}
    />

    <label style={{ textAlign: "right", fontWeight: "500" }}>
      মাতার নাম (বাংলায়)
    </label>
    <input 
      placeholder="মাতার নাম (বাংলা)" 
      value={form.mother_bn} 
      onChange={e => setForm({ ...form, mother_bn: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Date of Birth */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Date of Birth
    </label>
    <input 
      type="date" 
      value={form.dob} 
      onChange={e => setForm({ ...form, dob: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Gender */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Gender
    </label>
    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
      <option value="">Select Gender</option>
      {genders.map(g => <option key={g} value={g}>{g}</option>)}
    </select>

    {/* Marital Status */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Marital Status
    </label>
    <select value={form.marital_status} onChange={e => setForm({ ...form, marital_status: e.target.value })}>
      <option value="">Select Marital Status</option>
      {maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}
    </select>

    {/* Spouse Name */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Spouse Name
    </label>
    <input 
      placeholder="Spouse Name (If Married)" 
      value={form.spouse_name} 
      onChange={e => setForm({ ...form, spouse_name: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Religion */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Religion
    </label>
    <select value={form.religion} onChange={e => setForm({ ...form, religion: e.target.value })}>
      <option value="">Select Religion</option>
      {religions.map(r => <option key={r} value={r}>{r}</option>)}
    </select>

    {/* Nationality */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Nationality
    </label>
    <select value={form.nationality || "Bangladeshi"} onChange={e => setForm({ ...form, nationality: e.target.value })}>
      <option value="Bangladeshi">Bangladeshi</option>
    </select>

    {/* Quota */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Quota
    </label>
    <select value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })}>
      <option value="">Select Quota</option>
      {quotas.map(q => <option key={q} value={q}>{q}</option>)}
    </select>

    {/* dep_statuses */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Departmental Status*
    </label>
    <select value={form.dep_status} onChange={e => setForm({ ...form, dep_status: e.target.value })}>
      <option value="">Select Departmental Status*</option>
      {dep_statuses.map(q => <option key={q} value={q}>{q}</option>)}
    </select>

    {/* NID */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      NID Number
    </label>
    <input 
      placeholder="Enter NID Number" 
      value={form.nid} 
      onChange={e => setForm({ ...form, nid: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Birth Registration */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Birth Registration No
    </label>
    <input 
      placeholder="Birth REG NO" 
      value={form.breg} 
      onChange={e => setForm({ ...form, breg: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Passport */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Passport Number
    </label>
    <input 
      placeholder="Passport Number" 
      value={form.passport} 
      onChange={e => setForm({ ...form, passport: e.target.value })} 
      style={{ width: "100%" }}
    />

    {/* Email */}
    <label style={{ textAlign: "right", fontWeight: "500" }}>
      Email Address
    </label>
    <input 
      type="email" 
      placeholder="Enter Email Address" 
      value={form.email} 
      onChange={e => setForm({ ...form, email: e.target.value })} 
      style={{ width: "100%" }}
    />

     {/* others */}
     <label style={{ textAlign: "right", fontWeight: "500" }}>
      Others
    </label>
    <input 
      placeholder="Enter others Info like Body height, weight, disability info etc." 
      value={form.others}
      onChange={e => setForm({ ...form, others: e.target.value })} 
      style={{ width: "100%" }}
    />
    
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

       {/* SSC / Equivalent */}
{/* SSC / Equivalent Level */}
<div style={{ marginBottom: "40px" }}>
  <h3 style={{ 
    background: "#006400", 
    color: "white", 
    padding: "12px 18px", 
    borderRadius: "8px",
    marginBottom: "20px"
  }}>
    SSC / Equivalent Level
  </h3>

  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "25px" 
  }}>

    {/* Left Column */}
    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "16px", alignItems: "center" }}>
      
      <label style={{ textAlign: "right", fontWeight: "500" }}>Examination</label>
      <select 
        value={form.ssc_exam} 
        onChange={e => {
          const newExam = e.target.value;
          setForm({ 
            ...form, 
            ssc_exam: newExam,
            ssc_group: ""   // নতুন এক্সাম সিলেক্ট করলে গ্রুপ রিসেট
          });
        }}
      >
        <option value="">Select Exam</option>
        {sscExams.map(ex => (
          <option key={ex} value={ex}>{ex}</option>
        ))}
      </select>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Roll No</label>
      <input 
        placeholder="Enter Roll No" 
        value={form.ssc_roll} 
        onChange={e => setForm({ ...form, ssc_roll: e.target.value })} 
        style={{ width: "100%" }}
      />

      <label style={{ textAlign: "right", fontWeight: "500" }}>Group/Subject</label>
      <select 
        value={form.ssc_group} 
        onChange={e => setForm({ ...form, ssc_group: e.target.value })}
        style={{ borderColor: form.ssc_group ? "" : "#ff0000" }}   // যদি খালি থাকে তাহলে লাল বর্ডার
      >
        <option value="">Select</option>
        {(form.ssc_exam === "S.S.C Vocational" ? ssc_vocational_groups : ssc_groups).map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>

    </div>

    {/* Right Column */}
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "16px", alignItems: "center" }}>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Board</label>
      <select 
        value={form.ssc_board} 
        onChange={e => setForm({ ...form, ssc_board: e.target.value })}
      >
        <option value="">Select Board</option>
        {boards.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Result</label>
      <div style={{ display: "flex", gap: "10px" }}>
        <select 
          value={form.ssc_result_type} 
          onChange={e => setForm({ ...form, ssc_result_type: e.target.value })}
          style={{ flex: 1 }}
        >
          <option value="">GPA(out of 5)</option>
          {resultTypes.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input 
          placeholder="3.93" 
          value={form.ssc_result} 
          onChange={e => setForm({ ...form, ssc_result: e.target.value })} 
          style={{ flex: 1, width: "100%" }}
        />
      </div>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Passing Year</label>
      <select 
        value={form.ssc_year} 
        onChange={e => setForm({ ...form, ssc_year: e.target.value })}
      >
        <option value="">Select Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

    </div>

  </div>

  {/* If Applicable Checkbox */}
  <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
    <input 
      type="checkbox" 
      id="ssc_applicable"
      checked={form.ssc_applicable || false}
      onChange={e => setForm({ ...form, ssc_applicable: e.target.checked })}
    />
    <label htmlFor="ssc_applicable" style={{ margin: 0, cursor: "pointer" }}>
      If Applicable
    </label>
  </div>
</div>

{/* HSC / Equivalent Level */}
<div style={{ marginBottom: "40px" }}>
  <h3 style={{ 
    background: "#006400", 
    color: "white", 
    padding: "12px 18px", 
    borderRadius: "8px",
    marginBottom: "20px"
  }}>
    HSC / Equivalent Level
  </h3>

  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "25px" 
  }}>

    {/* Left Column */}
    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "16px", alignItems: "center" }}>
      
      <label style={{ textAlign: "right", fontWeight: "500" }}>Examination</label>
      <select 
        value={form.hsc_exam} 
        onChange={e => {
          const newExam = e.target.value;
          setForm({ 
            ...form, 
            hsc_exam: newExam,
            hsc_group: ""   // নতুন এক্সাম সিলেক্ট করলে গ্রুপ রিসেট
          });
        }}
      >
        <option value="">Select Exam</option>
        {hscExams.map(ex => (
          <option key={ex} value={ex}>{ex}</option>
        ))}
      </select>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Roll No</label>
      <input 
        placeholder="Enter Roll No" 
        value={form.hsc_roll} 
        onChange={e => setForm({ ...form, hsc_roll: e.target.value })} 
        style={{ width: "100%" }}
      />

      <label style={{ textAlign: "right", fontWeight: "500" }}>Group/Subject</label>
      <select 
        value={form.hsc_group} 
        onChange={e => setForm({ ...form, hsc_group: e.target.value })}
        style={{ borderColor: form.hsc_group ? "" : "#ff0000" }}
      >
        <option value="">Select</option>
        {(form.hsc_exam === "H.S.C Vocational" ? hscVocationalGroups : hscGroups).map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>

    </div>

    {/* Right Column */}
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "16px", alignItems: "center" }}>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Board</label>
      <select 
        value={form.hsc_board} 
        onChange={e => setForm({ ...form, hsc_board: e.target.value })}
      >
        <option value="">Select Board</option>
        {boards.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Result</label>
      <div style={{ display: "flex", gap: "10px" }}>
        <select 
          value={form.hsc_result_type} 
          onChange={e => setForm({ ...form, hsc_result_type: e.target.value })}
          style={{ flex: 1 }}
        >
          <option value="">GPA(out of 5)</option>
          {resultTypes.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input 
          placeholder="3.50" 
          value={form.hsc_result} 
          onChange={e => setForm({ ...form, hsc_result: e.target.value })} 
          style={{ flex: 1, width: "100%" }}
        />
      </div>

      <label style={{ textAlign: "right", fontWeight: "500" }}>Passing Year</label>
      <select 
        value={form.hsc_year} 
        onChange={e => setForm({ ...form, hsc_year: e.target.value })}
      >
        <option value="">Select Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

    </div>

  </div>

  {/* If Applicable Checkbox */}
  <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
    <input 
      type="checkbox" 
      id="hsc_applicable"
      checked={form.hsc_applicable || false}
      onChange={e => setForm({ ...form, hsc_applicable: e.target.checked })}
    />
    <label htmlFor="hsc_applicable" style={{ margin: 0, cursor: "pointer" }}>
      If Applicable
    </label>
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