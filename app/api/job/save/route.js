// app/api/job/save/route.js
import pool from "@/lib/db";

export async function POST(request) {
  try {
    let data;

    // JSON বা FormData — দুটোই হ্যান্ডেল করবে
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (contentType.includes("form-data") || contentType.includes("x-www-form-urlencoded")) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      return Response.json({ 
        status: "error", 
        message: "Unsupported Content-Type" 
      }, { status: 400 });
    }

    if (!data.mobile) {
      return Response.json({ status: "error", message: "Mobile number is required" }, { status: 400 });
    }

    const values = [
      data.mobile, data.name, data.name_bn, data.father, data.father_bn, 
      data.mother, data.mother_bn, data.religion, data.gender, data.marital_status,
      data.spouse_name, data.email, data.quota, data.dep_status, data.nid, 
      data.breg, data.passport, data.dob,
      data.present_careof, data.present_village, data.present_district, 
      data.present_post, data.present_postcode, data.present_upazila,
      data.permanent_careof, data.permanent_village, data.permanent_district, 
      data.permanent_post, data.permanent_postcode, data.permanent_upazila,
      data.ssc_exam, data.ssc_board, data.ssc_roll, data.ssc_year, 
      data.ssc_group, data.ssc_result_type, data.ssc_result,
      data.hsc_exam, data.hsc_board, data.hsc_roll, data.hsc_year, 
      data.hsc_group, data.hsc_result_type, data.hsc_result,
      data.gra_exam, data.gra_subject, data.gra_institute, data.gra_year, 
      data.gra_duration, data.gra_result_type, data.gra_result,
      data.mas_exam, data.mas_subject, data.mas_institute, data.mas_year, 
      data.mas_duration, data.mas_result_type, data.mas_result
    ];

    const result = await pool.query(`
      INSERT INTO job_applicants (
        mobile, name, name_bn, father, father_bn, mother, mother_bn, religion, gender,
        marital_status, spouse_name, email, quota, dep_status, nid, breg, passport, dob,
        present_careof, present_village, present_district, present_post, present_postcode, present_upazila,
        permanent_careof, permanent_village, permanent_district, permanent_post, permanent_postcode, permanent_upazila,
        ssc_exam, ssc_board, ssc_roll, ssc_year, ssc_group, ssc_result_type, ssc_result,
        hsc_exam, hsc_board, hsc_roll, hsc_year, hsc_group, hsc_result_type, hsc_result,
        gra_exam, gra_subject, gra_institute, gra_year, gra_duration, gra_result_type, gra_result,
        mas_exam, mas_subject, mas_institute, mas_year, mas_duration, mas_result_type, mas_result
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,$58)
      ON CONFLICT (mobile) DO UPDATE SET
        name = EXCLUDED.name, name_bn = EXCLUDED.name_bn, father = EXCLUDED.father,
        father_bn = EXCLUDED.father_bn, mother = EXCLUDED.mother, mother_bn = EXCLUDED.mother_bn,
        religion = EXCLUDED.religion, gender = EXCLUDED.gender, marital_status = EXCLUDED.marital_status,
        spouse_name = EXCLUDED.spouse_name, email = EXCLUDED.email, quota = EXCLUDED.quota,
        dep_status = EXCLUDED.dep_status, nid = EXCLUDED.nid, breg = EXCLUDED.breg,
        passport = EXCLUDED.passport, dob = EXCLUDED.dob,
        present_careof = EXCLUDED.present_careof, present_village = EXCLUDED.present_village,
        present_district = EXCLUDED.present_district, present_post = EXCLUDED.present_post,
        present_postcode = EXCLUDED.present_postcode, present_upazila = EXCLUDED.present_upazila,
        permanent_careof = EXCLUDED.permanent_careof, permanent_village = EXCLUDED.permanent_village,
        permanent_district = EXCLUDED.permanent_district, permanent_post = EXCLUDED.permanent_post,
        permanent_postcode = EXCLUDED.permanent_postcode, permanent_upazila = EXCLUDED.permanent_upazila,
        ssc_exam = EXCLUDED.ssc_exam, ssc_board = EXCLUDED.ssc_board, ssc_roll = EXCLUDED.ssc_roll,
        ssc_year = EXCLUDED.ssc_year, ssc_group = EXCLUDED.ssc_group,
        ssc_result_type = EXCLUDED.ssc_result_type, ssc_result = EXCLUDED.ssc_result,
        hsc_exam = EXCLUDED.hsc_exam, hsc_board = EXCLUDED.hsc_board, hsc_roll = EXCLUDED.hsc_roll,
        hsc_year = EXCLUDED.hsc_year, hsc_group = EXCLUDED.hsc_group,
        hsc_result_type = EXCLUDED.hsc_result_type, hsc_result = EXCLUDED.hsc_result,
        gra_exam = EXCLUDED.gra_exam, gra_subject = EXCLUDED.gra_subject,
        gra_institute = EXCLUDED.gra_institute, gra_year = EXCLUDED.gra_year,
        gra_duration = EXCLUDED.gra_duration, gra_result_type = EXCLUDED.gra_result_type,
        gra_result = EXCLUDED.gra_result,
        mas_exam = EXCLUDED.mas_exam, mas_subject = EXCLUDED.mas_subject,
        mas_institute = EXCLUDED.mas_institute, mas_year = EXCLUDED.mas_year,
        mas_duration = EXCLUDED.mas_duration, mas_result_type = EXCLUDED.mas_result_type,
        mas_result = EXCLUDED.mas_result,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, values);

    return Response.json({
      status: "success",
      message: "✅ Data saved/updated successfully!",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Save API Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to save data: " + error.message 
    }, { status: 500 });
  }
}