"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, LogOut } from "lucide-react";
import useSelectionStore from "@/stores/useSelectionStore";
import { AnalysisHistory } from "@/features/optimization/components/analysis-history";
import { useGetTasks } from "@/features/optimization/hooks/useOptimizationApiHooks";
import { useGetResumes } from "@/features/resumes/hooks/useResumeApiHooks";
import { useGetJobs } from "@/features/jobs/hooks/useJobApiHooks";
import { ResumeHistory } from "@/features/resumes/components/resume-history";
import { JobHistory } from "@/features/jobs/components/job-history";
import { useSignout } from "@/features/auth/hooks/useAuthApiHooks";
import { toast } from "sonner";

const HistoryPage = () => {
  const { resetSelection } = useSelectionStore();
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analyses");
  const { data: tasks } = useGetTasks();
  const { data: resumes } = useGetResumes();
  const { data: jobs } = useGetJobs();
  const { mutateAsync: signout } = useSignout();

  const analysisHistory = useMemo(() => {
    return tasks?.map((task) => {
      const jobData = jobs?.find((job) => job.id === task.job_id);
      const resumeData = resumes?.find(
        (resume) => resume.id === task.resume_id
      );
      return {
        id: task.id || 0,
        resumeName: resumeData?.file_name || "",
        jobTitle: jobData?.title || "",
        company: jobData?.company || "",
        analysisDate: task.finished_at || "",
        matchScore: task?.outputs?.gap_detector?.overall_match_score || 0,
      };
    });
  }, [tasks, resumes, jobs]);

  const uploadedResumes = useMemo(() => {
    return resumes?.map((resume) => {
      const latestTask = tasks
        ?.filter((task) => task.finished_at && task.resume_id === resume.id)
        .reduce((latest, current) => {
          if (!latest) return current;
          return new Date(current.finished_at!) > new Date(latest.finished_at!)
            ? current
            : latest;
        }, null as (typeof tasks)[0] | null);

      return {
        id: resume.id || 0,
        filename: resume.file_name || "",
        fileType: resume.file_type || "",
        fileSize: resume.file_size || 0,
        analysisCount:
          tasks?.filter((task) => task.resume_id === resume.id)?.length || 0,
        created_at: resume.created_at || "",
        lastAnalyzed_at: latestTask?.finished_at || "",
      };
    });
  }, [resumes, tasks]);

  const savedJobs = useMemo(() => {
    return jobs?.map((job) => {
      const latestTask = tasks
        ?.filter((task) => task.finished_at && task.job_id === job.id)
        .reduce((latest, current) => {
          if (!latest) return current;
          return new Date(current.finished_at!) > new Date(latest.finished_at!)
            ? current
            : latest;
        }, null as (typeof tasks)[0] | null);

      return {
        id: job.id || 0,
        title: job.title || "",
        company: job.company || "",
        location: job?.parsed_json?.job_info?.location || "",
        industry: job?.parsed_json?.job_info?.industry || "",
        analysisCount:
          tasks?.filter((task) => task.job_id === job.id)?.length || 0,
        created_at: job.created_at || "",
        lastAnalyzed_at: latestTask?.finished_at || "",
      };
    });
  }, [jobs, tasks]);

  const filteredAnalyses = analysisHistory?.filter(
    (analysis) =>
      analysis.resumeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResumes = uploadedResumes?.filter(
    (resume) =>
      resume.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.fileType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = savedJobs?.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetSelection();
                  navigate.push("/");
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  History & Management
                </h1>
                <p className="text-gray-600">
                  Manage your resumes, jobs, and analysis history
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  resetSelection();
                  navigate.push("/");
                }}
              >
                New Analysis
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await signout();
                    resetSelection();
                    navigate.push("/signin");
                  } catch (error) {
                    toast.error(`Signout failed: ${error}`);
                  }
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search analyses, resumes, or jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="analyses">
              Analyses ({analysisHistory?.length})
            </TabsTrigger>
            <TabsTrigger value="resumes">
              Resumes ({uploadedResumes?.length})
            </TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({savedJobs?.length})</TabsTrigger>
          </TabsList>

          {/* Analysis History Tab */}
          <TabsContent value="analyses" className="space-y-4">
            <AnalysisHistory filteredAnalyses={filteredAnalyses} />
          </TabsContent>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-4">
            <ResumeHistory filteredResumes={filteredResumes} />
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <JobHistory filteredJobs={filteredJobs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HistoryPage;
