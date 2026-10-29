import { Bureau, Institution, Case, OverlapGroup, Alert, SlaRule, AuditLogEntry, User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Dr. Ramesh Sharma',
    email: 'r.sharma@aicte-india.org',
    role: 'BUREAU_OFFICER',
    bureauCode: 'RB',
    designation: 'Director, Regulation Bureau'
  },
  {
    id: 'u-2',
    name: 'Dr. Ananya Roy',
    email: 'a.roy@aicte-india.org',
    role: 'BUREAU_OFFICER',
    bureauCode: 'PGRC',
    designation: 'Deputy Director, PGRC'
  },
  {
    id: 'u-3',
    name: 'Er. Suresh Patel',
    email: 's.patel@aicte-india.org',
    role: 'REGIONAL_OFFICER',
    bureauCode: 'APPROVAL',
    region: 'Western',
    designation: 'Regional Officer (Western Region)'
  },
  {
    id: 'u-4',
    name: 'Prof. K. V. Venkat',
    email: 'advisor@aicte-india.org',
    role: 'SENIOR_MGMT',
    bureauCode: 'ADMIN',
    designation: 'Advisor-I (Competent Authority)'
  },
  {
    id: 'u-5',
    name: 'Admin System',
    email: 'admin@aicte-india.org',
    role: 'ADMIN',
    bureauCode: 'ADMIN',
    designation: 'System Administrator'
  }
];

export const mockBureaus: Bureau[] = [
  {
    id: 'b-1',
    code: 'RB',
    name: 'Regulation Bureau',
    description: 'Enforcement of AICTE Approval Process Handbook (APH) norms, unapproved programs, and excess intake.',
    activeCasesCount: 14
  },
  {
    id: 'b-2',
    code: 'PGRC',
    name: 'Public Grievance Redressal Cell',
    description: 'Redressal of grievances from faculty, staff, students, and parents concerning fees, harassment, and dues.',
    activeCasesCount: 18
  },
  {
    id: 'b-3',
    code: 'APPROVAL',
    name: 'Approval Bureau',
    description: 'Grant of approvals, extension of approvals (EOA), closure, and variations in intake.',
    activeCasesCount: 9
  },
  {
    id: 'b-4',
    code: 'RIFD',
    name: 'Research, Inst. & Faculty Dev.',
    description: 'Matters pertaining to research grants, faculty training, and academic quality assurance schemes.',
    activeCasesCount: 5
  }
];

export const mockInstitutions: Institution[] = [
  {
    id: 'inst-1',
    aictePermanentId: '1-10293847',
    name: 'Vishwa Institute of Technology',
    address: 'Survey No. 666, Bibwewadi Upper Indira Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    region: 'Western',
    institutionType: 'Private-Self-Financed',
    activeBureaus: ['RB', 'PGRC'],
    totalCases: 6,
    openCases: 3
  },
  {
    id: 'inst-2',
    aictePermanentId: '1-90817263',
    name: 'Aryavart College of Engineering & Tech',
    address: 'NH-24, Sitapur Road, Bakshi Ka Talab',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'Northern',
    institutionType: 'Private-Self-Financed',
    activeBureaus: ['RB', 'APPROVAL'],
    totalCases: 5,
    openCases: 2
  },
  {
    id: 'inst-3',
    aictePermanentId: '1-45678912',
    name: 'Apex Global Academy of Management',
    address: 'Sector 44, Institutional Area',
    city: 'Gurugram',
    state: 'Haryana',
    region: 'North-Western',
    institutionType: 'Private-Self-Financed',
    activeBureaus: ['RB', 'PGRC'],
    totalCases: 4,
    openCases: 2
  },
  {
    id: 'inst-4',
    aictePermanentId: '1-78912345',
    name: 'Government College of Engineering, Salem',
    address: 'Bangalore Highways, Karuppur',
    city: 'Salem',
    state: 'Tamil Nadu',
    region: 'Southern',
    institutionType: 'Govt',
    activeBureaus: ['PGRC'],
    totalCases: 2,
    openCases: 1
  },
  {
    id: 'inst-5',
    aictePermanentId: '1-23456789',
    name: 'Bengal Institute of Technology & Science',
    address: 'Sector V, Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    region: 'Eastern',
    institutionType: 'Govt-Aided',
    activeBureaus: ['RIFD'],
    totalCases: 3,
    openCases: 1
  },
  {
    id: 'inst-6',
    aictePermanentId: '1-34567890',
    name: 'Malwa Institute of Pharmacy & Research',
    address: 'Bypass Road, Rau',
    city: 'Indore',
    state: 'Madhya Pradesh',
    region: 'Central',
    institutionType: 'Private-Self-Financed',
    activeBureaus: ['RB'],
    totalCases: 4,
    openCases: 2
  },
  {
    id: 'inst-7',
    aictePermanentId: '1-56789012',
    name: 'Silicon Valley College of Technology',
    address: 'Electronic City, Phase 1',
    city: 'Bengaluru',
    state: 'Karnataka',
    region: 'South-Western',
    institutionType: 'Deemed University',
    activeBureaus: ['APPROVAL'],
    totalCases: 1,
    openCases: 1
  }
];

export const mockCases: Case[] = [
  {
    id: 'case-101',
    caseNumber: 'AICTE/RB/2026/0142',
    institutionId: 'inst-1',
    institutionName: 'Vishwa Institute of Technology',
    aictePermanentId: '1-10293847',
    region: 'Western',
    category: 'Norms Violation & Excess Intake',
    sourceBureau: 'RB',
    currentBureau: 'RB',
    assignedOfficer: 'Dr. Ramesh Sharma',
    complainantType: 'Anonymous',
    subject: 'Running unapproved second shift PGDM with 120 unauthorized seats',
    description: 'The college has admitted students beyond the sanctioned intake in Management program for 2025-2026 without prior AICTE approval.',
    status: 'UNDER_PROCESS',
    priority: 'High',
    receivedOn: '2026-10-12',
    lastActionOn: '2026-10-24',
    lastActionSummary: 'Explanation sought from Principal with 7-day show cause notice.',
    nextActionRequired: 'Review response to Show Cause Notice or dispatch expert inspection team.',
    expectedDisposalOn: '2026-11-10',
    isOverdue: false,
    overlapGroupId: 'overlap-1',
    overlapConfidence: 94,
    linkedCaseIds: ['case-102'],
    documents: [
      {
        id: 'doc-1',
        fileName: 'Show_Cause_Notice_RB_0142.pdf',
        fileSize: '1.4 MB',
        mimeType: 'application/pdf',
        uploadedBy: 'Dr. Ramesh Sharma',
        uploadedAt: '2026-10-24 11:30'
      },
      {
        id: 'doc-2',
        fileName: 'Brochure_Evidence_Excess_Seats.pdf',
        fileSize: '3.2 MB',
        mimeType: 'application/pdf',
        uploadedBy: 'Complainant',
        uploadedAt: '2026-10-12 16:45'
      }
    ],
    actions: [
      {
        id: 'act-1',
        actionType: 'CREATED',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-10-12 10:15',
        remarks: 'Case registered following email complaint with admission brochure evidence.',
        statusAfter: 'PENDING'
      },
      {
        id: 'act-2',
        actionType: 'STATUS_CHANGE',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-10-14 14:00',
        remarks: 'Scrutiny completed by Technical Scrutiny Committee. Prima facie violation found.',
        statusAfter: 'UNDER_PROCESS'
      },
      {
        id: 'act-3',
        actionType: 'REMARK',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-10-24 11:30',
        remarks: 'Issued formal Show Cause Notice to Chairman of Trust & Principal.',
        statusAfter: 'UNDER_PROCESS'
      }
    ]
  },
  {
    id: 'case-102',
    caseNumber: 'AICTE/PGRC/2026/0891',
    institutionId: 'inst-1',
    institutionName: 'Vishwa Institute of Technology',
    aictePermanentId: '1-10293847',
    region: 'Western',
    category: 'Non-payment of Faculty Salaries & Arrears',
    sourceBureau: 'PGRC',
    currentBureau: 'PGRC',
    assignedOfficer: 'Dr. Ananya Roy',
    complainantType: 'Faculty',
    subject: '14 Assistant Professors not paid salaries for 5 months and denial of 7th CPC scale',
    description: 'Faculty members submit joint petition stating management arbitrarily withholding salary cheques and threatening termination.',
    status: 'UNDER_PROCESS',
    priority: 'Critical',
    receivedOn: '2026-10-16',
    lastActionOn: '2026-10-25',
    lastActionSummary: 'Institution representative summoned for personal hearing on 05-Nov-2026.',
    nextActionRequired: 'Conduct hearing and cross-verify with Western Regional Office records.',
    expectedDisposalOn: '2026-11-05',
    isOverdue: false,
    overlapGroupId: 'overlap-1',
    overlapConfidence: 94,
    linkedCaseIds: ['case-101'],
    documents: [
      {
        id: 'doc-3',
        fileName: 'Faculty_Joint_Representation.pdf',
        fileSize: '890 KB',
        mimeType: 'application/pdf',
        uploadedBy: 'Dr. Ananya Roy',
        uploadedAt: '2026-10-16 15:20'
      }
    ],
    actions: [
      {
        id: 'act-4',
        actionType: 'CREATED',
        fromBureau: 'PGRC',
        toBureau: 'PGRC',
        performedBy: 'u-2',
        performedByName: 'Dr. Ananya Roy',
        performedAt: '2026-10-16 15:20',
        remarks: 'Direct faculty grievance received via CPGRAMS portal.',
        statusAfter: 'PENDING'
      },
      {
        id: 'act-5',
        actionType: 'STATUS_CHANGE',
        fromBureau: 'PGRC',
        toBureau: 'PGRC',
        performedBy: 'u-2',
        performedByName: 'Dr. Ananya Roy',
        performedAt: '2026-10-25 09:45',
        remarks: 'Personal hearing notice dispatched to Management and Regional Officer.',
        statusAfter: 'UNDER_PROCESS'
      }
    ]
  },
  {
    id: 'case-103',
    caseNumber: 'AICTE/RB/2026/0095',
    institutionId: 'inst-2',
    institutionName: 'Aryavart College of Engineering & Tech',
    aictePermanentId: '1-90817263',
    region: 'Northern',
    category: 'Infrastructural Deficiency',
    sourceBureau: 'RB',
    currentBureau: 'RB',
    assignedOfficer: 'Dr. Ramesh Sharma',
    complainantType: 'Student',
    subject: 'Severe shortfall in Computer Labs, Cad-Cam hardware and library journals',
    description: 'Students allege lab equipment is non-functional and shared with diploma wing without adequate physical partitions.',
    status: 'ESCALATED',
    priority: 'Critical',
    receivedOn: '2026-09-10',
    lastActionOn: '2026-10-20',
    lastActionSummary: 'Escalated to Member Secretary due to non-compliance within 30-day cure period.',
    nextActionRequired: 'Decision on withdrawal of approval or reduction in intake for AY 2027-28.',
    expectedDisposalOn: '2026-10-25',
    isOverdue: true,
    overlapGroupId: 'overlap-2',
    overlapConfidence: 86,
    linkedCaseIds: ['case-104'],
    documents: [
      {
        id: 'doc-4',
        fileName: 'Surprise_Inspection_Report_Sep2026.pdf',
        fileSize: '4.8 MB',
        mimeType: 'application/pdf',
        uploadedBy: 'Regional Inspection Team',
        uploadedAt: '2026-09-28 17:10'
      }
    ],
    actions: [
      {
        id: 'act-6',
        actionType: 'CREATED',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-09-10 11:00',
        remarks: 'Case initiated after surprise inspection findings.',
        statusAfter: 'PENDING'
      },
      {
        id: 'act-7',
        actionType: 'ESCALATION',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-10-20 16:30',
        remarks: 'Institution failed to submit compliance report within mandated 30 days. Escalating to Senior Management.',
        statusAfter: 'ESCALATED'
      }
    ]
  },
  {
    id: 'case-104',
    caseNumber: 'AICTE/APP/2026/0411',
    institutionId: 'inst-2',
    institutionName: 'Aryavart College of Engineering & Tech',
    aictePermanentId: '1-90817263',
    region: 'Northern',
    category: 'Extension of Approval / Expansion',
    sourceBureau: 'APPROVAL',
    currentBureau: 'APPROVAL',
    assignedOfficer: 'Er. Suresh Patel',
    complainantType: 'Anonymous',
    subject: 'Contradiction: Applied for 120 additional B.Tech CS seats while under scrutiny in RB',
    description: 'Institution has filed application for seat expansion despite severe infrastructural deficiencies pending in RB.',
    status: 'PENDING',
    priority: 'High',
    receivedOn: '2026-10-18',
    lastActionOn: '2026-10-18',
    lastActionSummary: 'Application received and marked for scrutiny.',
    nextActionRequired: 'Coordinate with Regulation Bureau to cross-check compliance status before scrutiny approval.',
    expectedDisposalOn: '2026-11-20',
    isOverdue: false,
    overlapGroupId: 'overlap-2',
    overlapConfidence: 86,
    linkedCaseIds: ['case-103'],
    documents: [],
    actions: [
      {
        id: 'act-8',
        actionType: 'CREATED',
        fromBureau: 'APPROVAL',
        toBureau: 'APPROVAL',
        performedBy: 'u-3',
        performedByName: 'Er. Suresh Patel',
        performedAt: '2026-10-18 10:00',
        remarks: 'Application flagged automatically by system due to existing open RB inquiry.',
        statusAfter: 'PENDING'
      }
    ]
  },
  {
    id: 'case-105',
    caseNumber: 'AICTE/PGRC/2026/0912',
    institutionId: 'inst-3',
    institutionName: 'Apex Global Academy of Management',
    aictePermanentId: '1-45678912',
    region: 'North-Western',
    category: 'Student Fee Extortion & Refund Refusal',
    sourceBureau: 'PGRC',
    currentBureau: 'PGRC',
    assignedOfficer: 'Dr. Ananya Roy',
    complainantType: 'Parent',
    subject: 'Refusal to refund tuition fee of INR 1,80,000 upon candidate seat withdrawal before cut-off date',
    description: 'Parent withdrew admission within AICTE calendar cut-off; college withheld entire fee and retaining original grade sheets.',
    status: 'UNDER_PROCESS',
    priority: 'Medium',
    receivedOn: '2026-10-05',
    lastActionOn: '2026-10-19',
    lastActionSummary: 'Second reminder issued with warning of penalty under Fee Refund Regulations.',
    nextActionRequired: 'If not refunded by 31-Oct, initiate processing of punitive grant deduction.',
    expectedDisposalOn: '2026-11-02',
    isOverdue: false,
    overlapGroupId: 'overlap-3',
    overlapConfidence: 89,
    linkedCaseIds: ['case-106'],
    documents: [],
    actions: [
      {
        id: 'act-9',
        actionType: 'CREATED',
        fromBureau: 'PGRC',
        toBureau: 'PGRC',
        performedBy: 'u-2',
        performedByName: 'Dr. Ananya Roy',
        performedAt: '2026-10-05 14:15',
        remarks: 'Grievance registered with receipt and withdrawal acknowledgment attached.',
        statusAfter: 'PENDING'
      }
    ]
  },
  {
    id: 'case-106',
    caseNumber: 'AICTE/RB/2026/0164',
    institutionId: 'inst-3',
    institutionName: 'Apex Global Academy of Management',
    aictePermanentId: '1-45678912',
    region: 'North-Western',
    category: 'Norms Violation & Excess Intake',
    sourceBureau: 'RB',
    currentBureau: 'RB',
    assignedOfficer: 'Dr. Ramesh Sharma',
    complainantType: 'General Public',
    subject: 'Illegal retention of original student academic certificates',
    description: 'Complaint regarding coercive retention of 10th and 12th original certificates of first year enrolled students.',
    status: 'PENDING',
    priority: 'High',
    receivedOn: '2026-10-21',
    lastActionOn: '2026-10-21',
    lastActionSummary: 'Case entered and queued for preliminary scrutiny.',
    nextActionRequired: 'Issue directive under Section 10 of AICTE Act to return original documents immediately.',
    expectedDisposalOn: '2026-11-15',
    isOverdue: false,
    overlapGroupId: 'overlap-3',
    overlapConfidence: 89,
    linkedCaseIds: ['case-105'],
    documents: [],
    actions: [
      {
        id: 'act-10',
        actionType: 'CREATED',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-10-21 09:30',
        remarks: 'New complaint filed against Apex Global regarding illegal certificate detention.',
        statusAfter: 'PENDING'
      }
    ]
  },
  {
    id: 'case-107',
    caseNumber: 'AICTE/PGRC/2026/0754',
    institutionId: 'inst-4',
    institutionName: 'Government College of Engineering, Salem',
    aictePermanentId: '1-78912345',
    region: 'Southern',
    category: 'Hostel Amenities & Student Welfare',
    sourceBureau: 'PGRC',
    currentBureau: 'PGRC',
    assignedOfficer: 'Dr. Ananya Roy',
    complainantType: 'Student',
    subject: 'Inadequate drinking water RO plant and unhygienic mess condition in Boys Hostel 3',
    description: 'Student union submitted grievance regarding water quality test failures.',
    status: 'DISPOSED',
    priority: 'Low',
    receivedOn: '2026-08-15',
    lastActionOn: '2026-09-20',
    lastActionSummary: 'Principal submitted compliance certificate with new water purification installation.',
    nextActionRequired: 'Case successfully resolved and closed.',
    expectedDisposalOn: '2026-09-30',
    disposedOn: '2026-09-20',
    isOverdue: false,
    linkedCaseIds: [],
    documents: [],
    actions: [
      {
        id: 'act-11',
        actionType: 'DISPOSAL',
        fromBureau: 'PGRC',
        toBureau: 'PGRC',
        performedBy: 'u-2',
        performedByName: 'Dr. Ananya Roy',
        performedAt: '2026-09-20 16:00',
        remarks: 'Compliance accepted. Water test reports verified by Regional Office.',
        statusAfter: 'DISPOSED'
      }
    ]
  },
  {
    id: 'case-108',
    caseNumber: 'AICTE/RIFD/2026/0034',
    institutionId: 'inst-5',
    institutionName: 'Bengal Institute of Technology & Science',
    aictePermanentId: '1-23456789',
    region: 'Eastern',
    category: 'Research Grant Utilization',
    sourceBureau: 'RIFD',
    currentBureau: 'RIFD',
    assignedOfficer: 'Prof. K. V. Venkat',
    complainantType: 'Faculty',
    subject: 'Diversion of MODROBS grant meant for Advanced Robotics Laboratory',
    description: 'Principal Investigator reports institute administrative office diverted allocated project funds to college general pool.',
    status: 'TRANSFERRED',
    priority: 'High',
    receivedOn: '2026-09-15',
    lastActionOn: '2026-10-14',
    lastActionSummary: 'Transferred to Regulation Bureau for financial audit investigation.',
    nextActionRequired: 'Regulation Bureau to appoint special chartered auditor.',
    expectedDisposalOn: '2026-10-30',
    isOverdue: false,
    linkedCaseIds: [],
    documents: [],
    actions: [
      {
        id: 'act-12',
        actionType: 'TRANSFER',
        fromBureau: 'RIFD',
        toBureau: 'RB',
        performedBy: 'u-4',
        performedByName: 'Prof. K. V. Venkat',
        performedAt: '2026-10-14 11:20',
        remarks: 'Matter involves financial diversion requiring formal regulatory proceedings.',
        statusAfter: 'TRANSFERRED'
      }
    ]
  },
  {
    id: 'case-109',
    caseNumber: 'AICTE/RB/2026/0088',
    institutionId: 'inst-6',
    institutionName: 'Malwa Institute of Pharmacy & Research',
    aictePermanentId: '1-34567890',
    region: 'Central',
    category: 'Faculty Cadre Ratio Deficiency',
    sourceBureau: 'RB',
    currentBureau: 'RB',
    assignedOfficer: 'Dr. Ramesh Sharma',
    complainantType: 'Anonymous',
    subject: 'Phantom / Ghost faculty listed in portal while physically absent',
    description: 'Aadhar biometric audit exposed 8 faculty members simultaneously registered at two different state colleges.',
    status: 'UNDER_PROCESS',
    priority: 'Critical',
    receivedOn: '2026-09-01',
    lastActionOn: '2026-10-10',
    lastActionSummary: 'Physical surprise biometric verification conducted by Central Regional Office.',
    nextActionRequired: 'Serve debarment notice to 8 faculty members and penalty notice to institution.',
    expectedDisposalOn: '2026-10-20',
    isOverdue: true,
    linkedCaseIds: [],
    documents: [],
    actions: [
      {
        id: 'act-13',
        actionType: 'STATUS_CHANGE',
        fromBureau: 'RB',
        toBureau: 'RB',
        performedBy: 'u-1',
        performedByName: 'Dr. Ramesh Sharma',
        performedAt: '2026-09-15 12:00',
        remarks: 'Biometric records mismatch corroborated by UIDAI logs.',
        statusAfter: 'UNDER_PROCESS'
      }
    ]
  }
];

export const mockOverlapGroups: OverlapGroup[] = [
  {
    id: 'overlap-1',
    institutionId: 'inst-1',
    institutionName: 'Vishwa Institute of Technology',
    aicteId: '1-10293847',
    region: 'Western',
    confidence: 94,
    reasons: [
      'Identical AICTE Permanent ID (1-10293847) [Score +50]',
      'Active concurrent handling by RB and PGRC [Score +20]',
      'Subject correlation: Management intake vs Faculty non-payment [Score +14]',
      'Cases registered within 4 days of each other [Score +10]'
    ],
    cases: [mockCases[0], mockCases[1]],
    state: 'SUGGESTED',
    createdAt: '2026-10-16 15:30',
    coordinationNote: 'Both cells are investigating governance breakdown in Vishwa Institute. Joint hearing strongly recommended.'
  },
  {
    id: 'overlap-2',
    institutionId: 'inst-2',
    institutionName: 'Aryavart College of Engineering & Tech',
    aicteId: '1-90817263',
    region: 'Northern',
    confidence: 86,
    reasons: [
      'Identical AICTE Permanent ID (1-90817263) [Score +50]',
      'Active handling across RB (deficiency) and Approval Bureau (expansion) [Score +20]',
      'Contradictory state: Expansion applied while facing approval suspension [Score +16]'
    ],
    cases: [mockCases[2], mockCases[3]],
    state: 'CONFIRMED',
    createdAt: '2026-10-18 10:30',
    reviewedBy: 'Er. Suresh Patel',
    reviewedAt: '2026-10-19 14:20',
    coordinationNote: 'Expansion application placed on formal hold pending resolution of RB inspection penalties.'
  },
  {
    id: 'overlap-3',
    institutionId: 'inst-3',
    institutionName: 'Apex Global Academy of Management',
    aicteId: '1-45678912',
    region: 'North-Western',
    confidence: 89,
    reasons: [
      'Identical AICTE Permanent ID (1-45678912) [Score +50]',
      'Simultaneous complaints in PGRC (fee extortion) and RB (certificate detention) [Score +20]',
      'Common root cause: coercive admission retention practices [Score +19]'
    ],
    cases: [mockCases[4], mockCases[5]],
    state: 'SUGGESTED',
    createdAt: '2026-10-21 10:00'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alt-1',
    type: 'OVERLAP',
    caseId: 'case-101',
    caseNumber: 'AICTE/RB/2026/0142',
    institutionName: 'Vishwa Institute of Technology',
    targetBureau: 'RB',
    message: 'High-confidence overlap detected: PGRC also actively handling Case #AICTE/PGRC/2026/0891 for Vishwa Institute (Score: 94%).',
    severity: 'danger',
    isRead: false,
    createdAt: '2026-10-24 10:00'
  },
  {
    id: 'alt-2',
    type: 'SLA',
    caseId: 'case-103',
    caseNumber: 'AICTE/RB/2026/0095',
    institutionName: 'Aryavart College of Engineering & Tech',
    targetBureau: 'RB',
    message: 'Case is OVERDUE by 5 days! Expected disposal was 25-Oct-2026.',
    severity: 'danger',
    isRead: false,
    createdAt: '2026-10-26 09:00'
  },
  {
    id: 'alt-3',
    type: 'ESCALATION',
    caseId: 'case-103',
    caseNumber: 'AICTE/RB/2026/0095',
    institutionName: 'Aryavart College of Engineering & Tech',
    targetBureau: 'ADMIN',
    message: 'Escalated to Senior Management due to 30-day notice non-compliance.',
    severity: 'warning',
    isRead: true,
    createdAt: '2026-10-20 16:30'
  },
  {
    id: 'alt-4',
    type: 'PENDING',
    caseId: 'case-109',
    caseNumber: 'AICTE/RB/2026/0088',
    institutionName: 'Malwa Institute of Pharmacy & Research',
    targetBureau: 'RB',
    message: 'No action recorded for 18 days on Ghost Faculty investigation.',
    severity: 'warning',
    isRead: false,
    createdAt: '2026-10-28 08:30'
  }
];

export const mockSlaRules: SlaRule[] = [
  { id: 'sla-1', category: 'Norms Violation & Excess Intake', bureau: 'RB', slaDays: 30, warnBeforeDays: 7 },
  { id: 'sla-2', category: 'Infrastructural Deficiency', bureau: 'RB', slaDays: 45, warnBeforeDays: 10 },
  { id: 'sla-3', category: 'Non-payment of Faculty Salaries & Arrears', bureau: 'PGRC', slaDays: 21, warnBeforeDays: 5 },
  { id: 'sla-4', category: 'Student Fee Extortion & Refund Refusal', bureau: 'PGRC', slaDays: 15, warnBeforeDays: 4 },
  { id: 'sla-5', category: 'Extension of Approval / Expansion', bureau: 'APPROVAL', slaDays: 30, warnBeforeDays: 7 },
  { id: 'sla-6', category: 'Research Grant Utilization', bureau: 'RIFD', slaDays: 45, warnBeforeDays: 10 }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    userId: 'u-1',
    userName: 'Dr. Ramesh Sharma',
    entity: 'Case',
    entityId: 'AICTE/RB/2026/0142',
    action: 'DISPATCH_NOTICE',
    details: 'Issued formal Show Cause Notice with 7-day compliance window',
    timestamp: '2026-10-24 11:30:12',
    ip: '10.24.50.11'
  },
  {
    id: 'log-2',
    userId: 'u-3',
    userName: 'Er. Suresh Patel',
    entity: 'OverlapGroup',
    entityId: 'overlap-2',
    action: 'CONFIRM_LINK',
    details: 'Confirmed cross-bureau relation between RB #0095 and Approval #0411',
    timestamp: '2026-10-19 14:20:44',
    ip: '10.24.50.88'
  },
  {
    id: 'log-3',
    userId: 'u-1',
    userName: 'Dr. Ramesh Sharma',
    entity: 'Case',
    entityId: 'AICTE/RB/2026/0095',
    action: 'ESCALATE',
    details: 'Escalated case to Advisor-I due to expiration of cure period',
    timestamp: '2026-10-20 16:30:05',
    ip: '10.24.50.11'
  }
];
