export interface Optimize {
  resume_id: number;
  job_id: number;
}

export interface CriticalGaps {
  education_gaps: {
    requirement: string | null;
    current_status: string | null;
    gap_description: string | null;
    options: string[];
  }[];
  experience_gaps: {
    area: string | null;
    required_experience: string | null;
    current_experience: string | null;
    gap_description: string | null;
    bridging_suggestions: string[];
  }[];
  missing_technical_skills: {
    skill: string | null;
    importance: string | null;
    gap_description: string | null;
    learning_resource_suggestions: string[];
  }[];
  missing_soft_skills: {
    skill: string | null;
    importance: string | null;
    gap_description: string | null;
    development_suggestions: string[];
  }[];
}
export interface InterviewPreparation {
  likely_questions: string[];
  areas_to_emphasize: string[];
  potential_concerns_to_address: string[];
}
export interface Recommendations {
  immediate_actions: {
    action: string | null;
    timeline: string | null;
    priority: string | null;
    expected_impact: string | null;
  }[];
  short_term_improvements: {
    improvement: string | null;
    timeline: string | null;
    resources_needed: string[];
    expected_outcome: string | null;
  }[];
  long_term_development: {
    development_area: string | null;
    timeline: string | null;
    investment_required: string | null;
    career_impact: string | null;
  }[];
}
export interface ResumeOptimization {
  keyword_suggestions: string[];
  section_imporvements: {
    section: string | null;
    current_issue: string | null;
    improvement_suggestion: string | null;
  }[];
  formatting_suggestions: string[];
}

export interface Strengths {
  area: string | null;
  description: string | null;
  how_to_highlight: string | null;
}

export interface GapDetector {
  critical_gaps: CriticalGaps;
  interview_preparation: InterviewPreparation;
  match_summary: string | null;
  overall_match_score: number | null;
  recommendations: Recommendations;
  resume_optimization: ResumeOptimization;
  strengths: Strengths[];
}

export interface ApplicationInfo {
  application_deadline: string | null;
  contact_person: string | null;
  application_process: string | null;
  additional_instructions: string | null;
}

export interface CompanyInfo {
  compoany_description: string | null;
  company_size: string | null;
  company_culture: string[];
  growth_opportunities: string[];
}

export interface Compensation {
  salary_min: string | null;
  salary_max: string | null;
  currency: string | null;
  salary_type: string | null;
  benefits: string[];
}

export interface JobDescription {
  summary: string | null;
  responsibilities: string[];
  key_requirements: string[];
  day_to_day_tasks: string[];
}

export interface JobInfo {
  title: string | null;
  company: string | null;
  location: string | null;
  work_arrangement: string | null;
  employment_type: string | null;
  seniority_level: string | null;
  department: string | null;
  industry: string | null;
  job_function: string | null;
}

export interface Qualifications {
  required_education: string[];
  preferred_education: string[];
  required_experience: string | null;
  preferred_experience: string | null;
  required_skills: string[];
  preferred_skills: string[];
  certifications: string[];
  languages: string[];
}

export interface SkillsBreakdown {
  technical_skills: string[];
  programming_languages: string[];
  frameworks_libraries: string[];
  tools_platforms: string[];
  databases: string[];
  cloud_technologies: string[];
  methodologies: string[];
  soft_skills: string[];
}

export interface JobAnalyzer {
  application_info: ApplicationInfo;
  company_info: CompanyInfo;
  compensation: Compensation;
  job_description: JobDescription;
  job_info: JobInfo;
  qualifications: Qualifications;
  skills_breakdown: SkillsBreakdown;
}

export interface Additional {
  awards: string[];
  certifications: string[];
  interests: string[];
  publications: string[];
  volunteer_work: string[];
}

export interface Education {
  institution: string | null;
  degree: string | null;
  major: string | null;
  gap: string | null;
  start_date: string | null;
  location: string | null;
  honors: string | null;
  relevant_coursework: string[];
}

export interface PersonalInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  summary: string | null;
}

export interface Project {
  name: string | null;
  description: string | null;
  technologies: string[];
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  github: string | null;
  highlights: string[];
}

export interface Skills {
  technical: string[];
  programming_languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
  soft_skills: string[];
  languages: string[];
  certiffications: string[];
}

export interface WorkExperience {
  company: string | null;
  position: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  employment_type: string | null;
  description: string[];
  achievements: string[];
}

export interface ResumeEextractor {
  additional: Additional;
  education: Education[];
  personal_info: PersonalInfo;
  projects: Project[];
  skills: Skills;
  work_experience: WorkExperience[];
}

export interface Outputs {
  gap_detector: GapDetector;
  job_analyzer: JobAnalyzer;
  resume_extractor: ResumeEextractor;
}

export interface TaskOutputReadBase {
  id: number;
  user_id: number;
  job_id: number;
  resume_id: number;
  status: string;
  outputs: {
    gap_detector: {
      overall_match_score: number;
    };
  };
  created_at: Date;
  finished_at: Date | null;
}

export interface TaskOutputRead {
  id: number;
  user_id: number;
  job_id: number;
  resume_id: number;
  status: string;
  outputs: Outputs;
  created_at: Date;
  finished_at: Date | null;
}
