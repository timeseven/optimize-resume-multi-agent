"use client";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSignout } from "@/features/auth/hooks/useAuthApiHooks";
import { JobOverview } from "@/features/jobs/components/job-overview";
import { GapAnalysis } from "@/features/optimization/components/gap-analysis";
import { InterviewPreparation } from "@/features/optimization/components/interview-preparation";
import { MatchScore } from "@/features/optimization/components/match-score";
import { Recommendations } from "@/features/optimization/components/recommendations";
import { ResumeOptimization } from "@/features/optimization/components/resume-optimization";
import { useGetTask } from "@/features/optimization/hooks/useOptimizationApiHooks";
import { ProfileOverview } from "@/features/resumes/components/profile-overview";
import useSelectionStore from "@/stores/useSelectionStore";

import { CheckCircle, ArrowLeft, LogOut } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const ResultPage = () => {
  const { resetSelection } = useSelectionStore();
  const navigate = useRouter();
  const params = useParams();
  const taskId = params.taskId;
  const { data: task } = useGetTask(Number(taskId));
  const { mutateAsync: signout } = useSignout();

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
                  Resume Optimization Results
                </h1>
                <p className="text-gray-600">
                  Analysis results and recommendations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  navigate.push("/history");
                }}
              >
                History
              </Button>
              <Button
                variant="outline"
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
        {/* Analysis Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Analysis Complete</p>
              <p className="text-sm text-blue-700">
                Resume: Even(Zhigeng) Qian • Position: Full Stack Developer at
                Health Metrics
              </p>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ProfileOverview
            personal_info={task?.outputs?.resume_extractor?.personal_info}
          />
          <JobOverview job_info={task?.outputs?.job_analyzer?.job_info} />
        </div>

        {/* Match Score */}
        <MatchScore gap_detector={task?.outputs?.gap_detector} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="gaps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="optimization">Resume Tips</TabsTrigger>
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
          </TabsList>

          {/* Gap Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <GapAnalysis gap_detector={task?.outputs?.gap_detector} />
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Recommendations gap_detector={task?.outputs?.gap_detector} />
          </TabsContent>

          {/* Resume Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <ResumeOptimization gap_detector={task?.outputs?.gap_detector} />
          </TabsContent>

          {/* Interview Preparation Tab */}
          <TabsContent value="interview" className="space-y-6">
            <InterviewPreparation gap_detector={task?.outputs?.gap_detector} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultPage;
