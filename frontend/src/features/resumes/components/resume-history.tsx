"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreVertical, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useDeleteResume } from "../hooks/useResumeApiHooks";
import { toast } from "sonner";
import { queryClient } from "@/providers/react-query-provider";

export const ResumeHistory = ({
  filteredResumes,
}: {
  filteredResumes?: {
    id: number;
    filename: string;
    fileType: string;
    fileSize: number;
    analysisCount: number;
    created_at: Date | string;
    lastAnalyzed_at: Date | string;
  }[];
}) => {
  const { mutateAsync: deleteResume } = useDeleteResume();

  const handleDeleteResume = async (resume_id: number) => {
    try {
      await deleteResume(resume_id);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    } catch (error) {
      toast.error(`Failed to delete resume: ${error}`);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Uploaded Resumes
        </h2>
      </div>

      {filteredResumes?.map((resume) => (
        <Card key={resume.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {resume.filename}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {resume.fileType.toUpperCase()}
                    </Badge>
                    <span>{resume.fileSize}</span>
                    <span>•</span>
                    <span>{resume.analysisCount} analyses</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right text-sm text-gray-500">
                  <div>Uploaded {formatDate(resume.created_at || "")}</div>
                  {resume.lastAnalyzed_at && (
                    <div>Last used {formatDate(resume.lastAnalyzed_at)}</div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteResume(resume.id)}
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
