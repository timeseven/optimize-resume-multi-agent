export interface ResumeRead {
  id: number;
  user_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  raw_text: string;
  parsed_json: JSON | null;
  created_at: Date;
}
