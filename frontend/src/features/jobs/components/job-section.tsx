"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Briefcase,
  Calendar,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import useSelectionStore from "@/stores/useSelectionStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateJob, useGetJobs } from "../hooks/useJobApiHooks";
import { queryClient } from "@/providers/react-query-provider";

// Zod schema for job validation
const jobFormSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Please enter the job title")
    .min(2, "Job title must be at least 2 characters"),
  companyName: z
    .string()
    .min(1, "Please enter the company name")
    .min(2, "Company name must be at least 2 characters"),
  jobDescription: z
    .string()
    .min(1, "Please enter the job description")
    .min(10, "Job description must be at least 10 characters"),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export const JobSection = () => {
  const { selectedJob, setSelectedJob } = useSelectionStore();
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const { data: jobs } = useGetJobs();
  const { mutateAsync: createJob, isPending: isAddingJob } = useCreateJob();

  // React Hook Form setup
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
    },
  });

  const handleAddJob = async (values: JobFormValues) => {
    console.log("handleadd", values);
    try {
      await createJob({
        title: values.jobTitle,
        company: values.companyName,
        job_description: values.jobDescription,
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      handleDialogClose(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsJobDialogOpen(open);
    if (!open) {
      form.reset();
      setSubmitError("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Saved Jobs ({jobs?.length})
        </h2>

        <Dialog open={isJobDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Enter the job details and description to save for future
                analysis
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddJob)}
                className="space-y-4 py-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Full Stack Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Health Metrics"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the complete job description here..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include requirements, responsibilities, and any other
                        relevant details
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}
                    disabled={isAddingJob}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingJob}>
                    {isAddingJob ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Job"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {jobs && jobs?.length > 0 ? (
        <div className="space-y-4">
          {jobs?.map((job) => (
            <Card
              key={job.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedJob === job.id
                  ? "ring-2 ring-green-500 border-green-500 bg-green-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => setSelectedJob(job.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-3 h-3" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                  </div>
                  {selectedJob === job.id && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {job.job_description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Added {formatDate(job.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="w-full text-center">No Jobs</div>
      )}
    </div>
  );
};
