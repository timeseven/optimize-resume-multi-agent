"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  MoreVertical,
  Trash2,
  Building,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { formatDate, getScoreColor } from "@/lib/utils";
import useSelectionStore from "@/stores/useSelectionStore";
import { useDeleteTask } from "../hooks/useOptimizationApiHooks";
import { toast } from "sonner";
import { queryClient } from "@/providers/react-query-provider";

export const AnalysisHistory = ({
  filteredAnalyses,
}: {
  filteredAnalyses?: {
    id: number;
    resumeName: string;
    jobTitle: string;
    company: string;
    analysisDate: Date | string;
    matchScore: number;
  }[];
}) => {
  const { resetSelection } = useSelectionStore();
  const navigate = useRouter();
  const { mutateAsync: deleteTask } = useDeleteTask();
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      toast.error(`Failed to delete task: ${error}`);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Analysis History
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetSelection();
            navigate.push("/");
          }}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {filteredAnalyses?.map((analysis) => (
        <Card key={analysis.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {analysis.resumeName} → {analysis.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-3 h-3" />
                    <span>{analysis.company}</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(analysis.analysisDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                    analysis.matchScore
                  )}`}
                >
                  {analysis.matchScore}% Match
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate.push(`/result/${analysis.id}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteTask(analysis.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
