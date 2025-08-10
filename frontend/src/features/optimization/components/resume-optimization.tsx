import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { GapDetector } from "../types";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
export const ResumeOptimization = ({
  gap_detector,
}: {
  gap_detector?: GapDetector;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume Optimization
        </CardTitle>
        <CardDescription>
          Improve your resume to better match the job requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Recommended Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {gap_detector?.resume_optimization.keyword_suggestions.map(
                (keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                )
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Include these keywords naturally throughout your resume to improve
              ATS compatibility.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Section Improvements</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> Focus on quantifying your achievements
                and highlighting projects that demonstrate the missing technical
                skills (PHP, .NET) through related technologies or transferable
                experience.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
