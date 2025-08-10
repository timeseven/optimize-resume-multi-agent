import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { GapDetector } from "../types";
import { AlertTriangle, CheckCircle, MessageSquare, Star } from "lucide-react";

export const InterviewPreparation = ({
  gap_detector,
}: {
  gap_detector?: GapDetector;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Star className="w-5 h-5" />
            Areas to Emphasize
          </CardTitle>
          <CardDescription>
            Highlight these strengths during interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gap_detector?.interview_preparation.areas_to_emphasize.map(
              (area, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium">{area}</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <MessageSquare className="w-5 h-5" />
            Address These Concerns
          </CardTitle>
          <CardDescription>
            Prepare responses for potential concerns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gap_detector?.interview_preparation.potential_concerns_to_address.map(
              (concern, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="font-medium">{concern}</span>
                </div>
              )
            )}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Strategy:</strong> Frame your willingness to learn these
              technologies as an asset. Mention any related experience and your
              proven ability to quickly adapt to new tech stacks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
