import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { GapDetector } from "../types";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Recommendations = ({
  gap_detector,
}: {
  gap_detector?: GapDetector;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Immediate Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Immediate Actions
          </CardTitle>
          <CardDescription>High priority items to address now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gap_detector?.recommendations.immediate_actions.map(
              (action, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">{action.priority}</Badge>
                    <span className="text-sm text-gray-500">
                      {action.timeline}
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">{action.action}</h4>
                  <p className="text-sm text-gray-600">
                    {action.expected_impact}
                  </p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Short-term Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <Clock className="w-5 h-5" />
            Short-term Goals
          </CardTitle>
          <CardDescription>3-6 month development plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gap_detector?.recommendations.short_term_improvements.map(
              (improvement, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Medium</Badge>
                    <span className="text-sm text-gray-500">
                      {improvement.timeline}
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">
                    {improvement.improvement}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {improvement.expected_outcome}
                  </p>
                  {improvement.resources_needed && (
                    <div className="text-xs text-gray-500">
                      Resources: {improvement.resources_needed.join(", ")}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Long-term Development */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <TrendingUp className="w-5 h-5" />
            Long-term Vision
          </CardTitle>
          <CardDescription>6-12 month career growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gap_detector?.recommendations.long_term_development.map(
              (development, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Long-term</Badge>
                    <span className="text-sm text-gray-500">
                      {development.timeline}
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">
                    {development.development_area}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {development.career_impact}
                  </p>
                  <div className="text-xs text-gray-500">
                    Investment: {development.investment_required}
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
