import {
  ApplicationInfo,
  CompanyInfo,
  Compensation,
  JobDescription,
  JobInfo,
  Qualifications,
  SkillsBreakdown,
} from "../optimization/types";

export interface JobCreate {
  title: string;
  company: string;
  job_description: string;
}

export interface JobRead {
  id: number;
  user_id: number;
  title: string;
  company: string;
  job_description: string;
  parsed_json: {
    application_info: ApplicationInfo;
    company_info: CompanyInfo;
    compensation: Compensation;
    job_description: JobDescription;
    job_info: JobInfo;
    qualifications: Qualifications;
    skills_breakdown: SkillsBreakdown;
  } | null;
  created_at: Date;
}
