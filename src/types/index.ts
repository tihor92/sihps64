export type Role = 'ADMIN' | 'BUREAU_OFFICER' | 'REGIONAL_OFFICER' | 'SENIOR_MGMT';

export type BureauCode = 'RB' | 'PGRC' | 'APPROVAL' | 'RIFD' | 'ADMIN';

export type Status = 'PENDING' | 'UNDER_PROCESS' | 'DISPOSED' | 'TRANSFERRED' | 'ESCALATED';

export type ActionType = 
  | 'CREATED'
  | 'REMARK'
  | 'STATUS_CHANGE'
  | 'TRANSFER'
  | 'ESCALATION'
  | 'LINK'
  | 'DISPOSAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  bureauCode: BureauCode;
  region?: string;
  designation: string;
}

export interface Bureau {
  id: string;
  code: BureauCode;
  name: string;
  description: string;
  activeCasesCount: number;
}

export interface Institution {
  id: string;
  aictePermanentId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  region: 'Northern' | 'North-Western' | 'Eastern' | 'Western' | 'Central' | 'Southern' | 'South-Western';
  institutionType: 'Govt' | 'Govt-Aided' | 'Private-Self-Financed' | 'Deemed University';
  activeBureaus: BureauCode[];
  totalCases: number;
  openCases: number;
}

export interface CaseDocument {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CaseAction {
  id: string;
  actionType: ActionType;
  fromBureau?: BureauCode;
  toBureau?: BureauCode;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  remarks: string;
  statusAfter?: Status;
}

export interface Case {
  id: string;
  caseNumber: string;
  institutionId: string;
  institutionName: string;
  aictePermanentId: string;
  region: string;
  category: string;
  sourceBureau: BureauCode;
  currentBureau: BureauCode;
  assignedOfficer: string;
  complainantType: 'Faculty' | 'Student' | 'Parent' | 'General Public' | 'Anonymous';
  subject: string;
  description: string;
  status: Status;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  receivedOn: string;
  lastActionOn: string;
  lastActionSummary: string;
  nextActionRequired: string;
  expectedDisposalOn: string;
  disposedOn?: string;
  isOverdue: boolean;
  overlapGroupId?: string;
  overlapConfidence?: number;
  linkedCaseIds: string[];
  actions: CaseAction[];
  documents: CaseDocument[];
}

export interface OverlapGroup {
  id: string;
  institutionId: string;
  institutionName: string;
  aicteId: string;
  region: string;
  confidence: number;
  reasons: string[];
  cases: Case[];
  state: 'SUGGESTED' | 'CONFIRMED' | 'DISMISSED';
  coordinationNote?: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Alert {
  id: string;
  type: 'OVERLAP' | 'PENDING' | 'ESCALATION' | 'SLA';
  caseId?: string;
  caseNumber?: string;
  institutionName?: string;
  targetBureau?: BureauCode;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  isRead: boolean;
  createdAt: string;
}

export interface SlaRule {
  id: string;
  category: string;
  bureau: BureauCode;
  slaDays: number;
  warnBeforeDays: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  entity: string;
  entityId: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

