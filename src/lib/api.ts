// Mirqab Backend API Client

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Detection {
  bbox: [number, number, number, number];
  confidence: number;
  class: string;
}

export interface Analysis {
  summary: string;
  environment: string;
  soldier_count: number;
  attire_and_camouflage: string;
  equipment: string;
}

export interface Report {
  report_id: string;
  timestamp: string;
  location: Location;
  analysis: Analysis;
  images: {
    original_base64: string;
    masked_base64: string;
  };
}

export interface DetectionReport {
  report_id: string;
  timestamp: string;
  location: Location;
  soldier_count: number;
  attire_and_camouflage: string;
  environment: string;
  equipment: string;
  image_snapshot_url: string;
  segmented_image_url: string;
  source_device_id: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'New' | 'In Progress' | 'Closed';
  assignee: string;
}

export interface Stats {
  totalDetections: number;
  criticalAlerts: number;
  mttd: string;
  mttr: string;
  alertsByStatus: {
    new: number;
    inProgress: number;
    closed: number;
  };
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  gemini_api_available: boolean;
}

export interface AnalyzeMediaResponse {
  success: boolean;
  detection?: boolean;
  has_camouflage?: boolean;
  soldier_count?: number;
  civilian_count?: number;
  total_detections?: number;
  detections?: Detection[];
  overlay_image?: string;
  original_image?: string;
  report?: Report;
  class_breakdown?: {
    camouflage_soldiers: number;
    civilians: number;
    total: number;
  };
  message?: string;
  error?: string;
}

export interface MoraqibResponse {
  success: boolean;
  question: string;
  answer: string;
  reports_used?: Array<{
    report_id: string;
    timestamp: string;
    soldier_count: number;
  }>;
  total_reports?: number;
  error?: string;
}

// API Functions
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}

export async function analyzeMedia(
  file: File,
  location?: { lat: string; lng: string }
): Promise<AnalyzeMediaResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (location) {
    formData.append('location', JSON.stringify(location));
  }

  const response = await fetch(`${API_BASE_URL}/api/analyze_media`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function testSegmentation(file: File): Promise<{ success: boolean; overlay_image?: string; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/test_segmentation`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function processVideo(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/process_video`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Video processing failed');
  }

  return response.blob();
}

export async function getDetectionReports(
  timeRange: '24h' | '7d' | '30d' | 'all' = '24h',
  limit: number = 100,
  offset: number = 0
): Promise<{ success: boolean; detections: DetectionReport[]; total: number; time_range: string; error?: string }> {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/detection-reports?${params}`);
  return response.json();
}

export async function getDetectionStats(
  timeRange: string = '24h'
): Promise<{ success: boolean; stats: Stats; error?: string }> {
  const params = new URLSearchParams({ time_range: timeRange });
  const response = await fetch(`${API_BASE_URL}/api/detection-stats?${params}`);
  return response.json();
}

export async function queryMoraqib(query: string): Promise<MoraqibResponse> {
  const formData = new FormData();
  formData.append('query', query);

  const response = await fetch(`${API_BASE_URL}/api/moraqib_query`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export function getStorageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}
