"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ACCEPTED_FILE_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/consts";
import useSelectionStore from "@/stores/useSelectionStore";
import { useCreateResume, useGetResumes } from "../hooks/useResumeApiHooks";
import { toast } from "sonner";
import { queryClient } from "@/providers/react-query-provider";
import { formatDate, formatFileSize, getAnalysisStatus } from "@/lib/utils";

export const ResumeSection = () => {
  const { selectedResume, setSelectedResume } = useSelectionStore();
  const [isUploading, setIsUploading] = useState(false);
  const { data: resumes } = useGetResumes();
  const { mutateAsync: createResume } = useCreateResume();

  const validateFile = (file: File | null) => {
    if (!file) return true;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Max image size is 5MB.");
      return false;
    }
    if (!ACCEPTED_FILE_MIME_TYPES.includes(file.type)) {
      toast.error("Only .pdf, .docx files are allowed.");
      return false;
    }
    return true;
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await createResume(formData);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileInput");
    const file = e.target.files?.[0];
    console.log("file>>>>", file);
    if (file && validateFile(file)) handleFileUpload(file);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Resumes ({resumes?.length})
        </h2>
        <div className="relative">
          <Button variant="outline" size="sm" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </>
            )}
          </Button>
          <Input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
        </div>
      </div>

      {resumes && resumes?.length > 0 ? (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedResume === resume.id
                  ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => setSelectedResume(resume.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {resume.file_name}
                      </h3>
                    </div>
                  </div>
                  {selectedResume === resume.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {resume.raw_text}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {resume.file_type.toUpperCase()}
                    </Badge>
                    <span>{formatFileSize(resume.file_size)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Uploaded {formatDate(resume.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="w-full text-center">No Resumes</div>
      )}
    </div>
  );
};
