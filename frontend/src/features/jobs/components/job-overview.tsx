import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobInfo } from "@/features/optimization/types";
import { Briefcase } from "lucide-react";

export const JobOverview = ({ job_info }: { job_info?: JobInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Target Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-semibold">{job_info?.title}</h3>
          <p className="text-gray-600">{job_info?.company}</p>
          <p className="text-sm text-gray-500">{job_info?.location}</p>
          {job_info?.industry && (
            <Badge variant="outline">{job_info?.industry}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
