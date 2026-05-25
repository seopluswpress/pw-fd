/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | "Super Admin"
  | "Organization Admin"
  | "Facility Manager"
  | "Maintenance Manager"
  | "Technician"
  | "Supervisor"
  | "Auditor"
  | "Viewer";

export interface Organization {
  id: string;
  name: string;
  industry: "Hospitality" | "Hospital" | "Manufacturing" | "Warehouse" | "University" | "Enterprise Facility";
  tier: "Free Trial" | "Professional" | "Ultimate Enterprise";
  assetsCount: number;
}

export interface Asset {
  id: string;
  name: string;
  category: "HVAC" | "Electrical" | "Mechanical" | "Plumbing" | "Biomedical" | "IT & Telemetry";
  status: "Nominal" | "Warning" | "Critical" | "Out of Service";
  serialNumber: string;
  location: string;
  department: string;
  warrantyExpiry: string;
  vendorName: string;
  amcContractId: string;
  depreciationRate: number; // yearly %
  purchaseValue: number;
  healthScore: number; // 0 - 100
  utilizationRate: number; // 0 - 100
  parentId?: string; // Parent Asset (for parent-child asset trees)
  childrenIds?: string[];
  lastMaintenanceDate: string;
  telemetryStream: {
    temperature: number; // in C
    vibration: number; // mm/s RMS
    runHours: number;
    loadFactor: number; // %
  };
}

export interface MaintenanceSchedule {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  recurrence: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual";
  checklist: string[];
  lastRunDate: string;
  nextDueDate: string;
  slaLimitHrs: number;
  assignedTeam: string;
}

export interface WorkOrderTicket {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  status: "Open" | "Assigned" | "In Progress" | "Waiting for Approval" | "Waiting for Parts" | "Escalated" | "Completed" | "Closed";
  assignee: string;
  assigneeRole: string;
  reportedAt: string;
  slaDeadline: string;
  downtimeMinutes: number;
  rootCauseAnalysis?: string;
  troubleshootingSteps?: string[];
  suggestedSpares?: { partName: string; partNumber: string; estimatedCost: string; inStock: boolean }[];
  comments: { id: string; author: string; role: string; content: string; timestamp: string }[];
  voiceNoteUrl?: string;
  photoUrl?: string;
  checkInTime?: string;
  checkOutTime?: string;
  isAiOptimized?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  details: string;
  tenantId: string;
}

export interface SystemHealthMetric {
  id: string;
  serverNode: string;
  cpuLoad: number;
  memoryUsage: number;
  apiLatencyMs: number;
  activeSockets: number;
  status: "Nominal" | "Degraded" | "Outage";
}
