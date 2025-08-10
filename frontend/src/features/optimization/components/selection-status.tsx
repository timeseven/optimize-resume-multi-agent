"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useSelectionStore from "@/stores/useSelectionStore";
import { useOptimize } from "../hooks/useOptimizationApiHooks";
import { toast } from "sonner";
import { useState } from "react";
export const SelectionStatus = () => {
  const { selectedResume, selectedJob } = useSelectionStore();
  const navigate = useRouter();
  const { mutateAsync: optimize, isPending: isAnalyzing } = useOptimize();
  const [isRedirecting, setRedirecting] = useState(false);
  const handleStartAnalysis = async () => {
    if (!selectedResume || !selectedJob) return;
    try {
      const task_id = await optimize({
        resume_id: selectedResume,
        job_id: selectedJob,
      });
      setRedirecting(true);
      navigate.push(`/result/${task_id}`);
    } catch (error) {
      toast.error(`Failed to optimize: ${error}`);
    }
  };
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              selectedResume ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span
            className={
              selectedResume ? "text-green-700 font-medium" : "text-gray-500"
            }
          >
            {selectedResume ? "Resume Selected" : "Select Resume"}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              selectedJob ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span
            className={
              selectedJob ? "text-green-700 font-medium" : "text-gray-500"
            }
          >
            {selectedJob ? "Job Selected" : "Select Job"}
          </span>
        </div>
        <div className="ml-auto">
          <Button
            onClick={handleStartAnalysis}
            disabled={
              !selectedResume || !selectedJob || isAnalyzing || isRedirecting
            }
            className="min-w-[140px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Start Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
