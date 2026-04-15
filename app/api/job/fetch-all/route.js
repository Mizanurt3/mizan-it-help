// app/api/job/fetch-all/route.js
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userMobile = searchParams.get("userMobile");

    if (!userMobile) {
      return Response.json({ 
        status: "error", 
        message: "userMobile is required" 
      }, { status: 400 });
    }

    const result = await pool.query(`
      SELECT 
        id, 
        "customerMobile", 
        "userMobile",
        name, 
        name_bn, 
        father, 
        father_bn, 
        mother, 
        mother_bn,
        religion, 
        gender, 
        marital_status, 
        spouse_name, 
        email, 
        quota, 
        dep_status,
        nid, 
        breg, 
        passport, 
        dob,
        present_careof, 
        present_village, 
        present_district, 
        present_post, 
        present_postcode, 
        present_upazila,
        permanent_careof, 
        permanent_village, 
        permanent_district, 
        permanent_post, 
        permanent_postcode, 
        permanent_upazila,
        ssc_exam, 
        ssc_board, 
        ssc_roll, 
        ssc_year, 
        ssc_group, 
        ssc_result_type, 
        ssc_result,
        hsc_exam, 
        hsc_board, 
        hsc_roll, 
        hsc_year, 
        hsc_group, 
        hsc_result_type, 
        hsc_result,
        gra_exam, 
        gra_subject, 
        gra_institute, 
        gra_year, 
        gra_duration, 
        gra_result_type, 
        gra_result,
        mas_exam, 
        mas_subject, 
        mas_institute, 
        mas_year, 
        mas_duration, 
        mas_result_type, 
        mas_result,
        "fetchedAt"
      FROM job_data 
      WHERE "userMobile" = $1
      ORDER BY "fetchedAt" DESC
    `, [userMobile]);

    return Response.json(result.rows);

  } catch (error) {
    console.error("Fetch All Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to fetch applicants: " + error.message 
    }, { status: 500 });
  }
}