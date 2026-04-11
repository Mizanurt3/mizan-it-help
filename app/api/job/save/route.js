// app/api/job/save/route.js
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return Response.json({ status: "error", message: "Admin access only" }, { status: 403 });
    }

    const body = await request.json();

    const {
      mobile, name, name_bn, father, father_bn, mother, mother_bn,
      religion, gender, marital_status, spouse_name, email, quota, dep_status,
      nid, breg, passport, dob,
      present_careof, present_village, present_district, present_post,
      present_postcode, present_upazila,
      permanent_careof, permanent_village, permanent_district, permanent_post,
      permanent_postcode, permanent_upazila,
      ssc_exam, ssc_board, ssc_roll, ssc_year, ssc_group, ssc_result_type, ssc_result,
      hsc_exam, hsc_board, hsc_roll, hsc_year, hsc_group, hsc_result_type, hsc_result,
      gra_exam, gra_subject, gra_institute, gra_year, gra_duration, gra_result_type, gra_result,
      mas_exam, mas_subject, mas_institute, mas_year, mas_duration, mas_result_type, mas_result
    } = body;

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
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        father = EXCLUDED.father,
        father_bn = EXCLUDED.father_bn,
        mother = EXCLUDED.mother,
        mother_bn = EXCLUDED.mother_bn,
        religion = EXCLUDED.religion,
        gender = EXCLUDED.gender,
        marital_status = EXCLUDED.marital_status,
        spouse_name = EXCLUDED.spouse_name,
        email = EXCLUDED.email,
        quota = EXCLUDED.quota,
        dep_status = EXCLUDED.dep_status,
        nid = EXCLUDED.nid,
        breg = EXCLUDED.breg,
        passport = EXCLUDED.passport,
        dob = EXCLUDED.dob,
        present_careof = EXCLUDED.present_careof,
        present_village = EXCLUDED.present_village,
        present_district = EXCLUDED.present_district,
        present_post = EXCLUDED.present_post,
        present_postcode = EXCLUDED.present_postcode,
        present_upazila = EXCLUDED.present_upazila,
        permanent_careof = EXCLUDED.permanent_careof,
        permanent_village = EXCLUDED.permanent_village,
        permanent_district = EXCLUDED.permanent_district,
        permanent_post = EXCLUDED.permanent_post,
        permanent_postcode = EXCLUDED.permanent_postcode,
        permanent_upazila = EXCLUDED.permanent_upazila,
        ssc_exam = EXCLUDED.ssc_exam,
        ssc_board = EXCLUDED.ssc_board,
        ssc_roll = EXCLUDED.ssc_roll,
        ssc_year = EXCLUDED.ssc_year,
        ssc_group = EXCLUDED.ssc_group,
        ssc_result_type = EXCLUDED.ssc_result_type,
        ssc_result = EXCLUDED.ssc_result,
        hsc_exam = EXCLUDED.hsc_exam,
        hsc_board = EXCLUDED.hsc_board,
        hsc_roll = EXCLUDED.hsc_roll,
        hsc_year = EXCLUDED.hsc_year,
        hsc_group = EXCLUDED.hsc_group,
        hsc_result_type = EXCLUDED.hsc_result_type,
        hsc_result = EXCLUDED.hsc_result,
        gra_exam = EXCLUDED.gra_exam,
        gra_subject = EXCLUDED.gra_subject,
        gra_institute = EXCLUDED.gra_institute,
        gra_year = EXCLUDED.gra_year,
        gra_duration = EXCLUDED.gra_duration,
        gra_result_type = EXCLUDED.gra_result_type,
        gra_result = EXCLUDED.gra_result,
        mas_exam = EXCLUDED.mas_exam,
        mas_subject = EXCLUDED.mas_subject,
        mas_institute = EXCLUDED.mas_institute,
        mas_year = EXCLUDED.mas_year,
        mas_duration = EXCLUDED.mas_duration,
        mas_result_type = EXCLUDED.mas_result_type,
        mas_result = EXCLUDED.mas_result,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      mobile, name, name_bn, father, father_bn, mother, mother_bn, religion, gender,
      marital_status, spouse_name, email, quota, dep_status, nid, breg, passport, dob,
      present_careof, present_village, present_district, present_post, present_postcode, present_upazila,
      permanent_careof, permanent_village, permanent_district, permanent_post, permanent_postcode, permanent_upazila,
      ssc_exam, ssc_board, ssc_roll, ssc_year, ssc_group, ssc_result_type, ssc_result,
      hsc_exam, hsc_board, hsc_roll, hsc_year, hsc_group, hsc_result_type, hsc_result,
      gra_exam, gra_subject, gra_institute, gra_year, gra_duration, gra_result_type, gra_result,
      mas_exam, mas_subject, mas_institute, mas_year, mas_duration, mas_result_type, mas_result
    ]);

    return Response.json({
      status: "success",
      message: "Data saved successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Save API Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to save data" 
    }, { status: 500 });
  }
}