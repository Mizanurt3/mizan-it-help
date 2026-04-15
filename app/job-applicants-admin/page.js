import { Suspense } from 'react';
import JobApplicantsAdminClient from '@/components/JobApplicantsAdminClient';

export default function JobApplicantsAdminPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: "40px", 
        textAlign: "center", 
        fontSize: "18px",
        color: "#006400" 
      }}>
        Loading Job Applicants Management...
      </div>
    }>
      <JobApplicantsAdminClient />
    </Suspense>
  );
}