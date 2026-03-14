"use client";
import React from "react";
import Link from "next/link";
export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12 px-4">
      <br />
      <br />
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        উৎসব ফটোকপি & কম্পিউটার
      </h1>

      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 underline">
        সার্ভিস চার্জ মূল্য তালিকা
      </h2>

      {/* Pricing Table */}
      <div className="w-full max-w-2xl overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg shadow-lg bg-white">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">সার্ভিস</th>
              <th className="py-3 px-4 text-right">মূল্য</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3 px-4">ফটোকপি 1 কপি (1 সাইড)</td>
              <td className="py-3 px-4 text-right">৩ টাকা</td>
            </tr>
            <tr>
              <td className="py-3 px-4">ফটোকপি 1 কপি (ডাবল সাইড)</td>
              <td className="py-3 px-4 text-right">৫ টাকা</td>
            </tr>
            <tr>
              <td className="py-3 px-4">ছবি 2 কপি (পাসপোর্ট)</td>
              <td className="py-3 px-4 text-right">২০ টাকা</td>
            </tr>
            <tr>
              <td className="py-3 px-4">ছবি 4 কপি (পাসপোর্ট)</td>
              <td className="py-3 px-4 text-right">৩০ টাকা</td>
            </tr>
            <tr>
              <td className="py-3 px-4">ছবি 4 কপি (পাসপোর্ট) (ইনহ্যান্স করলে)</td>
              <td className="py-3 px-4 text-right">৪০ টাকা</td>
            </tr>
            <tr>
              <td className="py-3 px-4">NID নতুন নিবন্ধন</td>
              <td className="py-3 px-4 text-right">১৫০ টাকা</td>
            </tr>
            <tr>
              <td className="py-3 px-4">NID নতুন নিবন্ধন (পৌরসভা হলে)</td>
              <td className="py-3 px-4 text-right">১২০ টাকা</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Message */}
      <p className="mt-10 text-lg font-semibold text-gray-700">
        ধন্যবাদ 🌸
      </p>
       {/* ✅ Extra Links */}
      <div className="flex space-x-4 mt-4">
        <Link 
          href="/" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Home
        </Link>
        <Link 
          href="/about-us" 
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          ℹ️ About Us
        </Link>
      </div>
    </div>
  );
}
