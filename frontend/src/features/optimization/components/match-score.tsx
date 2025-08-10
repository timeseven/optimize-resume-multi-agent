import { Target } from "lucide-react";
import { GapDetector } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreBackground, getScoreColor } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export const MatchScore = ({
  gap_detector,
}: {
  gap_detector?: GapDetector;
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Overall Match Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div
            className={`text-center p-6 rounded-lg ${getScoreBackground(
              gap_detector?.overall_match_score || 0
            )}`}
          >
            <div
              className={`text-4xl font-bold ${getScoreColor(
                gap_detector?.overall_match_score || 0
              )}`}
            >
              {gap_detector?.overall_match_score}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Match Score</p>
          </div>
          <div className="flex-1">
            <Progress
              value={gap_detector?.overall_match_score}
              className="mb-2"
            />
            <p className="text-gray-700">{gap_detector?.match_summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
