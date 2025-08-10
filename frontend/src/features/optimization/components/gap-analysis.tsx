import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPriorityColor } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { GapDetector } from "../types";

export const GapAnalysis = ({
  gap_detector,
}: {
  gap_detector?: GapDetector;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Critical Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Critical Gaps
          </CardTitle>
          <CardDescription>
            Skills and areas that need immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {gap_detector?.critical_gaps.missing_technical_skills &&
            gap_detector?.critical_gaps.missing_technical_skills?.length >
              0 && (
              <div>
                <h4 className="font-medium mb-3">Technical Skills</h4>
                <div className="space-y-3">
                  {gap_detector?.critical_gaps.missing_technical_skills.map(
                    (skill, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.skill}</span>
                          <Badge
                            variant={getPriorityColor(skill.importance || "")}
                          >
                            {skill.importance}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {skill.gap_description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          <Separator />

          {gap_detector?.critical_gaps.missing_soft_skills &&
            gap_detector?.critical_gaps.missing_soft_skills?.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Soft Skills</h4>
                <div className="space-y-3">
                  {gap_detector?.critical_gaps.missing_soft_skills.map(
                    (skill, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.skill}</span>
                          <Badge
                            variant={getPriorityColor(skill.importance || "")}
                          >
                            {skill.importance}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {skill.gap_description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Your Strengths
          </CardTitle>
          <CardDescription>
            Areas where you excel and should highlight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gap_detector?.strengths.map((strength, index) => (
              <div key={index} className="border rounded-lg p-4 bg-green-50">
                <h4 className="font-medium text-green-800 mb-2">
                  {strength.area}
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  {strength.description}
                </p>
                <div className="bg-white rounded p-3 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-700">
                    How to highlight:
                  </p>
                  <p className="text-sm text-gray-600">
                    {strength.how_to_highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
