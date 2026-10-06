export type Severity = "critical" | "high" | "medium" | "low";
export type Category = "safety" | "security" | "it" | "facilities" | "hr" | "compliance";
export type IncidentStatus = "pending" | "triaging" | "review" | "approved" | "escalated";

export interface Extraction {
  date: string;
  location: string;
  incidentType: string;
  description: string;
  peopleInvolved: string[];
  immediateRisk: string;
  evidence: string[];
}

export interface Classification {
  category: Category;
  severity: Severity;
  rationale: string;
  confidence: number;
}

export interface PolicyReference {
  document: string;
  section: string;
  excerpt: string;
}

export interface RecommendedAction {
  action: string;
  owner: string;
  deadline: string;
}

export interface DraftReport {
  summary: string;
  recommendedActions: RecommendedAction[];
}

export interface AuditEntry {
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface Attachment {
  name: string;
  type: string;       // MIME type, e.g. "image/png" or "video/mp4"
  dataUrl: string;     // base64 data URL for local demo storage
}

export interface Incident {
  id: string;
  title: string;
  rawInput: string;
  photoUrl?: string;
  attachments?: Attachment[];
  status: IncidentStatus;
  createdAt: string;
  submittedBy: string;
  extraction?: Extraction;
  classification?: Classification;
  policyReferences?: PolicyReference[];
  draftReport?: DraftReport;
  auditLog: AuditEntry[];
}

export interface PolicyDocument {
  id: string;
  title: string;
  filename: string;
  content: string;
  sections: { title: string; content: string }[];
}
