// app/api/job/save/route.js
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const data = {
      mobile: formData.get("mobile"),
      name: formData.get("name"),
      name_bn: formData.get("name_bn"),
      father: formData.get("father"),
      father_bn: formData.get("father_bn"),
      mother: formData.get("mother"),
      mother_bn: formData.get("mother_bn"),
      religion: formData.get("religion"),
      gender: formData.get("gender"),
      marital_status: formData.get("marital_status"),
      spouse_name: formData.get("spouse_name"),
      email: formData.get("email"),
      quota: formData.get("quota"),
      dep_status: formData.get("dep_status"),
      nid: formData.get("nid"),
      breg: formData.get("breg"),
      passport: formData.get("passport"),
      dob: formData.get("dob"),
      present_careof: formData.get("present_careof"),
      present_village: formData.get("present_village"),
      present_district: formData.get("present_district"),
      present_post: formData.get("present_post"),
      present_postcode: formData.get("present_postcode"),
      present_upazila: formData.get("present_upazila"),
      permanent_careof: formData.get("permanent_careof"),
      permanent_village: formData.get("permanent_village"),
      permanent_district: formData.get("permanent_district"),
      permanent_post: formData.get("permanent_post"),
      permanent_postcode: formData.get("permanent_postcode"),
      permanent_upazila: formData.get("permanent_upazila"),
      ssc_exam: formData.get("ssc_exam"),
      ssc_board: formData.get("ssc_board"),
      ssc_roll: formData.get("ssc_roll"),
      ssc_year: formData.get("ssc_year"),
      ssc_group: formData.get("ssc_group"),
      ssc_result_type: formData.get("ssc_result_type"),
      ssc_result: formData.get("ssc_result"),
      hsc_exam: formData.get("hsc_exam"),
      hsc_board: formData.get("hsc_board"),
      hsc_roll: formData.get("hsc_roll"),
      hsc_year: formData.get("hsc_year"),
      hsc_group: formData.get("hsc_group"),
      hsc_result_type: formData.get("hsc_result_type"),
      hsc_result: formData.get("hsc_result"),
      gra_exam: formData.get("gra_exam"),
      gra_subject: formData.get("gra_subject"),
      gra_institute: formData.get("gra_institute"),
      gra_year: formData.get("gra_year"),
      gra_duration: formData.get("gra_duration"),
      gra_result_type: formData.get("gra_result_type"),
      gra_result: formData.get("gra_result"),
      mas_exam: formData.get("mas_exam"),
      mas_subject: formData.get("mas_subject"),
      mas_institute: formData.get("mas_institute"),
      mas_year: formData.get("mas_year"),
      mas_duration: formData.get("mas_duration"),
      mas_result_type: formData.get("mas_result_type"),
      mas_result: formData.get("mas_result")
    };

    if (!data.mobile) {
      return Response.json({ status: "error", message: "Mobile number is required" }, { status: 400 });
    }

    const values = Object.values(data);

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
    console.error("Save Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to save data: " + error.message 
    }, { status: 500 });
  }
}