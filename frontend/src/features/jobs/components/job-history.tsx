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
import {
  Briefcase,
  MoreVertical,
  Trash2,
  Building,
  MapPin,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useDeleteJob } from "../hooks/useJobApiHooks";
import { toast } from "sonner";
import { queryClient } from "@/providers/react-query-provider";

export const JobHistory = ({
  filteredJobs,
}: {
  filteredJobs?: {
    id: number;
    title: string;
    company: string;
    location: string;
    industry: string;
    analysisCount: number;
    created_at: Date | string;
    lastAnalyzed_at: Date | string;
  }[];
}) => {
  const { mutateAsync: deleteJob } = useDeleteJob();

  const handleDeleteJob = async (job_id: number) => {
    try {
      await deleteJob(job_id);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (error) {
      toast.error(`Failed to delete job: ${error}`);
    }
  };
  return (
    <>
      {" "}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Saved Job Descriptions
        </h2>
      </div>
      {filteredJobs?.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-3 h-3" />
                    <span>{job.company}</span>
                    {job.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {job?.industry && (
                      <Badge variant="outline" className="text-xs">
                        {job.industry}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {job.analysisCount} analyses
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right text-sm text-gray-500">
                  <div>Added {formatDate(job.created_at)}</div>
                  {job.lastAnalyzed_at && (
                    <div>Last used {formatDate(job.lastAnalyzed_at)}</div>
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
                      onClick={() => handleDeleteJob(job.id)}
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
