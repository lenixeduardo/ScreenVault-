export type CaptureCategory =
  | 'financial'
  | 'tasks'
  | 'messages'
  | 'documents'
  | 'code'
  | 'links'
  | 'dates'
  | 'others';

export interface Capture {
  id: string;
  image_url: string;
  image_path: string;
  title: string | null;
  summary: string | null;
  extracted_text: string | null;
  category: CaptureCategory;
  tags: string[];
  is_important: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysisResult {
  title: string;
  summary: string;
  extracted_text: string;
  category: CaptureCategory;
  tags: string[];
  metadata: {
    dates?: string[];
    amounts?: string[];
    people?: string[];
    urls?: string[];
    [key: string]: unknown;
  };
}

export interface CapturesResponse {
  data: Capture[];
  count: number;
  limit: number;
  offset: number;
}