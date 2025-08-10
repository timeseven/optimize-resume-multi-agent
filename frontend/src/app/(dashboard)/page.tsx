"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { MainHeader } from "@/components/main-header";
import { ResumeSection } from "@/features/resumes/components/resume-section";
import { SelectionStatus } from "@/features/optimization/components/selection-status";
import { JobSection } from "@/features/jobs/components/job-section";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MainHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Status */}
        <SelectionStatus />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumes Section */}
          <ResumeSection />
          {/* Jobs Section */}
          <JobSection />
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>How it works:</strong> Select one resume and one job
              description, then click &quot;Start Analysis&quot; to generate an
              optimization report comparing your resume against the job
              requirements.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
