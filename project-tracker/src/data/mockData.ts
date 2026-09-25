import type { Domain, Project, Blocker, Risk, GovernanceLog, User, Task, DailyUpdate } from '../types'
import { DOMAIN_PALETTE } from '../constants/theme'

export const MOCK_USER: User = {
  id: 'u1',
  name: 'James Mitchell',
  email: 'james.mitchell@company.com',
  role: 'Manager',
  domain: 'IT Operations',
  isActive: true,
}

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'James Mitchell', email: 'james.mitchell@company.com', role: 'Manager', domain: 'IT Operations', isActive: true },
  { id: 'u2', name: 'Emily Carter', email: 'emily.carter@company.com', role: 'Team Lead', reportsToId: 'u1', domain: 'RPA', isActive: true },
  { id: 'u3', name: 'David Harris', email: 'david.harris@company.com', role: 'Team Lead', reportsToId: 'u1', domain: 'Procurement', isActive: true },
  { id: 'u4', name: 'Michael Thompson', email: 'michael.thompson@company.com', role: 'Team Lead', reportsToId: 'u1', domain: 'IT Operations', isActive: true },
  { id: 'u5', name: 'Patrick Nelson', email: 'patrick.nelson@company.com', role: 'Developer', reportsToId: 'u2', isActive: true },
  { id: 'u6', name: 'Ryan Mitchell', email: 'ryan.mitchell@company.com', role: 'Developer', reportsToId: 'u2', isActive: true },
  { id: 'u7', name: 'Brian Walker', email: 'brian.walker@company.com', role: 'Developer', reportsToId: 'u3', isActive: true },
  { id: 'u8', name: 'Steven Young', email: 'steven.young@company.com', role: 'Developer', reportsToId: 'u3', isActive: true },
  { id: 'u9', name: 'Nathan Clark', email: 'nathan.clark@company.com', role: 'Developer', reportsToId: 'u4', isActive: true },
  { id: 'u10', name: 'Daniel White', email: 'daniel.white@company.com', role: 'Developer', reportsToId: 'u4', isActive: true },
  { id: 'u11', name: 'Tyler Brown', email: 'tyler.brown@company.com', role: 'Developer', reportsToId: 'u4', isActive: true },
  { id: 'u12', name: 'Eric Turner', email: 'eric.turner@company.com', role: 'Developer', reportsToId: 'u4', isActive: true },
  { id: 'u13', name: 'Adam Cooper', email: 'adam.cooper@company.com', role: 'Developer', reportsToId: 'u2', isActive: true },
  { id: 'u14', name: 'Amber Phillips', email: 'amber.phillips@company.com', role: 'Developer', reportsToId: 'u3', isActive: true },
  { id: 'u15', name: 'Christopher Martin', email: 'christopher.martin@company.com', role: 'Developer', reportsToId: 'u3', isActive: true },
]

export const MOCK_DOMAINS: Domain[] = [
  { id: 'd1', name: 'HR', description: 'Human Resources automation and digital transformation', owner: 'Sarah Johnson', ownerEmail: 'sarah.johnson@company.com', isActive: true, projectCount: 3, color: DOMAIN_PALETTE[0], createdAt: '2024-01-15', updatedAt: '2025-03-01' },
  { id: 'd2', name: 'Finance', description: 'Financial systems, reporting, and compliance automation', owner: 'Robert Williams', ownerEmail: 'robert.williams@company.com', isActive: true, projectCount: 4, color: DOMAIN_PALETTE[1], createdAt: '2024-01-15', updatedAt: '2025-04-10' },
  { id: 'd3', name: 'Power Automate Admin', description: 'Enterprise Power Automate governance and platform management', owner: 'James Mitchell', ownerEmail: 'james.mitchell@company.com', isActive: true, projectCount: 2, color: DOMAIN_PALETTE[2], createdAt: '2024-02-01', updatedAt: '2025-05-01' },
  { id: 'd4', name: 'RPA', description: 'Robotic Process Automation development and delivery', owner: 'Emily Carter', ownerEmail: 'emily.carter@company.com', isActive: true, projectCount: 5, color: DOMAIN_PALETTE[3], createdAt: '2024-01-20', updatedAt: '2025-04-20' },
  { id: 'd5', name: 'IT Operations', description: 'IT infrastructure, monitoring, and operations management', owner: 'Michael Thompson', ownerEmail: 'michael.thompson@company.com', isActive: true, projectCount: 3, color: DOMAIN_PALETTE[4], createdAt: '2024-01-15', updatedAt: '2025-03-15' },
  { id: 'd6', name: 'Compliance', description: 'Regulatory compliance, audits, and governance frameworks', owner: 'Laura Bennett', ownerEmail: 'laura.bennett@company.com', isActive: true, projectCount: 2, color: DOMAIN_PALETTE[5], createdAt: '2024-02-10', updatedAt: '2025-02-28' },
  { id: 'd7', name: 'Procurement', description: 'Procurement automation, vendor management, and sourcing', owner: 'David Harris', ownerEmail: 'david.harris@company.com', isActive: true, projectCount: 2, color: DOMAIN_PALETTE[6], createdAt: '2024-03-01', updatedAt: '2025-04-05' },
  { id: 'd8', name: 'Operations', description: 'Core business operations, field services, and asset management', owner: 'Jessica Taylor', ownerEmail: 'jessica.taylor@company.com', isActive: true, projectCount: 3, color: DOMAIN_PALETTE[7], createdAt: '2024-01-15', updatedAt: '2025-05-10' },
]

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1', teamLeadId: 'u4', projectId: 'PRJ-HR-001', name: 'Employee Self-Service Portal', description: 'Unified portal for employee HR requests, leave management, and payroll visibility.', domainId: 'd1', domainName: 'HR', subDomain: 'Employee Experience', businessUnit: 'Human Resources', businessOwner: 'Sarah Johnson', projectManager: 'James Mitchell', developer: 'Nathan Clark', qaOwner: 'Hannah Moore', supportOwner: 'IT Support Team',
    plannedStartDate: '2025-01-10', devStartDate: '2025-01-20', sitStartDate: '2025-03-01', uatStartDate: '2025-04-01', goLiveDate: '2025-05-01',
    status: 'On Track', priority: 'High', riskLevel: 'Low', deliveryMethodology: 'Agile', slaTarget: 90, completionPercentage: 78, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'UAT progressing well. On schedule for go-live.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'Green status maintained for 3 consecutive reviews.', createdAt: '2025-01-05', updatedAt: '2025-05-15',
  },
  {
    id: 'p2', teamLeadId: 'u4', projectId: 'PRJ-HR-002', name: 'Recruitment Automation Bot', description: 'RPA bot to automate CV screening, shortlisting, and interview scheduling workflows.', domainId: 'd1', domainName: 'HR', subDomain: 'Talent Acquisition', businessUnit: 'Human Resources', businessOwner: 'Rachel Green', projectManager: 'Emily Carter', developer: 'Daniel White', qaOwner: 'Sophia Adams', supportOwner: 'RPA Support',
    plannedStartDate: '2025-02-01', devStartDate: '2025-02-15', sitStartDate: '2025-04-01', uatStartDate: '2025-05-01', goLiveDate: '2025-06-15',
    status: 'Delayed', priority: 'Medium', riskLevel: 'Medium', deliveryMethodology: 'Scrum', slaTarget: 85, completionPercentage: 45, budgetStatus: 'On Budget', healthIndicator: 'At Risk', comments: 'SIT delayed due to environment issues. UAT pushed by 2 weeks.', delayCount: 2, escalationStatus: false, slaCompliance: false, governanceRemarks: 'Environment provisioning blocker raised. Mitigation plan in place.', createdAt: '2025-01-28', updatedAt: '2025-05-12',
  },
  {
    id: 'p3', teamLeadId: 'u4', projectId: 'PRJ-FIN-001', name: 'Budget Forecasting Dashboard', description: 'Power BI-powered budget tracking and forecasting tool integrated with SAP ERP.', domainId: 'd2', domainName: 'Finance', subDomain: 'Financial Planning', businessUnit: 'Finance & Accounts', businessOwner: 'Robert Williams', projectManager: 'James Mitchell', developer: 'Tyler Brown', qaOwner: 'Olivia Parker', supportOwner: 'Finance IT',
    plannedStartDate: '2024-11-01', devStartDate: '2024-11-15', sitStartDate: '2025-01-15', uatStartDate: '2025-02-15', goLiveDate: '2025-03-31',
    actualCompletionDate: '2025-04-05', status: 'On Track', priority: 'Critical', riskLevel: 'Low', deliveryMethodology: 'Waterfall', slaTarget: 95, completionPercentage: 100, budgetStatus: 'Under Budget', healthIndicator: 'Healthy', comments: 'Successfully delivered. Post go-live monitoring complete.', delayCount: 1, escalationStatus: false, slaCompliance: true, governanceRemarks: 'Delivered within scope. Minor go-live delay due to SAP cutover.', createdAt: '2024-10-25', updatedAt: '2025-04-10',
  },
  {
    id: 'p4', teamLeadId: 'u3', projectId: 'PRJ-FIN-002', name: 'Invoice Processing Automation', description: 'End-to-end accounts payable automation with OCR and approval workflow integration.', domainId: 'd2', domainName: 'Finance', subDomain: 'Accounts Payable', businessUnit: 'Finance & Accounts', businessOwner: 'Amanda Lewis', projectManager: 'David Harris', developer: 'Brian Walker', qaOwner: 'Christine Hall', supportOwner: 'Finance IT',
    plannedStartDate: '2025-03-01', devStartDate: '2025-03-15', sitStartDate: '2025-05-01', uatStartDate: '2025-06-01', goLiveDate: '2025-07-15',
    status: 'Breached', priority: 'High', riskLevel: 'High', deliveryMethodology: 'Agile', slaTarget: 90, completionPercentage: 30, budgetStatus: 'Over Budget', healthIndicator: 'Critical', comments: 'SLA breached. Significant rework required for OCR accuracy. Escalated to leadership.', delayCount: 4, escalationStatus: true, slaCompliance: false, governanceRemarks: 'Formal escalation raised. Executive steering committee review scheduled.', createdAt: '2025-02-20', updatedAt: '2025-05-16',
  },
  {
    id: 'p5', teamLeadId: 'u2', projectId: 'PRJ-RPA-001', name: 'Meter Reading Automation', description: 'Automated meter data collection, validation, and billing system integration using UiPath.', domainId: 'd4', domainName: 'RPA', subDomain: 'Field Operations', businessUnit: 'Distribution', businessOwner: 'Kevin Wright', projectManager: 'Emily Carter', developer: 'Patrick Nelson', qaOwner: 'Megan Collins', supportOwner: 'RPA CoE',
    plannedStartDate: '2025-01-05', devStartDate: '2025-01-20', sitStartDate: '2025-03-10', uatStartDate: '2025-04-10', goLiveDate: '2025-05-20',
    status: 'On Track', priority: 'Critical', riskLevel: 'Low', deliveryMethodology: 'Agile', slaTarget: 92, completionPercentage: 88, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'UAT sign-off received. Go-live readiness checklist complete.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'Exemplary delivery. Reference project for future RPA CoE engagements.', createdAt: '2024-12-20', updatedAt: '2025-05-14',
  },
  {
    id: 'p6', teamLeadId: 'u2', projectId: 'PRJ-RPA-002', name: 'Vendor Onboarding Bot', description: 'Automated vendor registration, document verification, and ERP entry using Power Automate + RPA.', domainId: 'd4', domainName: 'RPA', subDomain: 'Procurement Automation', businessUnit: 'Procurement', businessOwner: 'David Harris', projectManager: 'James Mitchell', developer: 'Ryan Mitchell', qaOwner: 'Natalie Scott', supportOwner: 'Procurement IT',
    plannedStartDate: '2025-04-01', devStartDate: '2025-04-15', sitStartDate: '2025-06-01', uatStartDate: '2025-07-01', goLiveDate: '2025-08-15',
    status: 'On Track', priority: 'Medium', riskLevel: 'Low', deliveryMethodology: 'Scrum', slaTarget: 88, completionPercentage: 22, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'Development sprint 2 in progress. On track.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'No governance concerns at this stage.', createdAt: '2025-03-25', updatedAt: '2025-05-10',
  },
  {
    id: 'p7', teamLeadId: 'u4', projectId: 'PRJ-ITO-001', name: 'IT Service Desk Chatbot', description: 'AI-powered virtual agent for automated IT support ticket creation and resolution.', domainId: 'd5', domainName: 'IT Operations', subDomain: 'Service Management', businessUnit: 'IT', businessOwner: 'Michael Thompson', projectManager: 'James Mitchell', developer: 'Eric Turner', qaOwner: 'Lisa Anderson', supportOwner: 'IT Help Desk',
    plannedStartDate: '2025-02-15', devStartDate: '2025-03-01', sitStartDate: '2025-05-01', uatStartDate: '2025-06-01', goLiveDate: '2025-07-01',
    status: 'Delayed', priority: 'High', riskLevel: 'Medium', deliveryMethodology: 'Agile', slaTarget: 87, completionPercentage: 55, budgetStatus: 'On Budget', healthIndicator: 'At Risk', comments: 'AI model training taking longer than estimated. SIT pushed by 3 weeks.', delayCount: 1, escalationStatus: false, slaCompliance: false, governanceRemarks: 'Resource augmentation approved. Recovery plan submitted.', createdAt: '2025-02-10', updatedAt: '2025-05-13',
  },
  {
    id: 'p8', teamLeadId: 'u3', projectId: 'PRJ-COM-001', name: 'Compliance Audit Tracker', description: 'Centralized platform for regulatory compliance tracking, evidence collection, and audit management.', domainId: 'd6', domainName: 'Compliance', subDomain: 'Regulatory Management', businessUnit: 'Legal & Compliance', businessOwner: 'Laura Bennett', projectManager: 'David Harris', developer: 'Steven Young', qaOwner: 'Karen Bailey', supportOwner: 'Compliance Team',
    plannedStartDate: '2025-01-20', devStartDate: '2025-02-01', sitStartDate: '2025-04-01', uatStartDate: '2025-05-01', goLiveDate: '2025-06-01',
    status: 'On Track', priority: 'Critical', riskLevel: 'Low', deliveryMethodology: 'Waterfall', slaTarget: 95, completionPercentage: 70, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'UAT user training completed. Final sign-off expected next week.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'High visibility project. Board-level reporting enabled.', createdAt: '2025-01-15', updatedAt: '2025-05-15',
  },
  {
    id: 'p9', teamLeadId: 'u2', projectId: 'PRJ-OPS-001', name: 'Asset Management Digitization', description: 'Digital transformation of field asset tracking, maintenance scheduling, and lifecycle management.', domainId: 'd8', domainName: 'Operations', subDomain: 'Asset Management', businessUnit: 'Grid Operations', businessOwner: 'Jessica Taylor', projectManager: 'Emily Carter', developer: 'Adam Cooper', qaOwner: 'Nicole Rivera', supportOwner: 'Field Operations IT',
    plannedStartDate: '2024-12-01', devStartDate: '2024-12-15', sitStartDate: '2025-02-15', uatStartDate: '2025-04-01', goLiveDate: '2025-05-30',
    status: 'Breached', priority: 'High', riskLevel: 'High', deliveryMethodology: 'Hybrid', slaTarget: 88, completionPercentage: 60, budgetStatus: 'Over Budget', healthIndicator: 'Critical', comments: 'Integration issues with legacy SCADA system. Go-live date at risk.', delayCount: 3, escalationStatus: true, slaCompliance: false, governanceRemarks: 'Escalated. Architecture review board involved. Vendor engaged for SCADA connector.', createdAt: '2024-11-25', updatedAt: '2025-05-16',
  },
  {
    id: 'p10', teamLeadId: 'u3', projectId: 'PRJ-PRO-001', name: 'Supplier Performance Portal', description: 'Vendor scorecard and performance management portal integrated with Oracle ERP.', domainId: 'd7', domainName: 'Procurement', subDomain: 'Supplier Management', businessUnit: 'Procurement', businessOwner: 'David Harris', projectManager: 'James Mitchell', developer: 'Amber Phillips', qaOwner: 'Gregory Evans', supportOwner: 'Procurement IT',
    plannedStartDate: '2025-03-15', devStartDate: '2025-04-01', sitStartDate: '2025-06-01', uatStartDate: '2025-07-01', goLiveDate: '2025-08-01',
    status: 'On Track', priority: 'Medium', riskLevel: 'Low', deliveryMethodology: 'Agile', slaTarget: 85, completionPercentage: 18, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'Requirements finalized. Development sprint 1 kickoff complete.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'No concerns. Governance review scheduled for Q3.', createdAt: '2025-03-10', updatedAt: '2025-05-08',
  },
  {
    id: 'p11', teamLeadId: 'u4', projectId: 'PRJ-PAA-001', name: 'Power Platform CoE Dashboard', description: 'Centralized monitoring dashboard for Power Platform usage, governance, and adoption across the organization.', domainId: 'd3', domainName: 'Power Automate Admin', subDomain: 'Platform Governance', businessUnit: 'IT', businessOwner: 'James Mitchell', projectManager: 'James Mitchell', developer: 'Nathan Clark', qaOwner: 'Hannah Moore', supportOwner: 'Platform Team',
    plannedStartDate: '2025-04-01', devStartDate: '2025-04-10', sitStartDate: '2025-05-20', uatStartDate: '2025-06-10', goLiveDate: '2025-07-01',
    status: 'On Track', priority: 'High', riskLevel: 'Low', deliveryMethodology: 'Agile', slaTarget: 90, completionPercentage: 35, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'Dashboard framework built. Data connectors in progress.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'On track. Weekly sync with EPMO confirmed.', createdAt: '2025-03-28', updatedAt: '2025-05-15',
  },
  {
    id: 'p12', teamLeadId: 'u3', projectId: 'PRJ-FIN-003', name: 'Treasury Management System', description: 'Automated cash flow management, bank reconciliation, and treasury reporting platform.', domainId: 'd2', domainName: 'Finance', subDomain: 'Treasury', businessUnit: 'Finance & Accounts', businessOwner: 'Robert Williams', projectManager: 'David Harris', developer: 'Christopher Martin', qaOwner: 'Victoria Thompson', supportOwner: 'Finance IT',
    plannedStartDate: '2025-05-01', devStartDate: '2025-05-15', sitStartDate: '2025-07-15', uatStartDate: '2025-08-15', goLiveDate: '2025-10-01',
    status: 'On Track', priority: 'High', riskLevel: 'Medium', deliveryMethodology: 'Waterfall', slaTarget: 92, completionPercentage: 8, budgetStatus: 'On Budget', healthIndicator: 'Healthy', comments: 'Project initiated. Architecture design phase in progress.', delayCount: 0, escalationStatus: false, slaCompliance: true, governanceRemarks: 'Governance framework applied. Kick-off with steering committee done.', createdAt: '2025-04-25', updatedAt: '2025-05-14',
  },
]

export const MOCK_BLOCKERS: Blocker[] = [
  { id: 'b1', projectId: 'p4', projectName: 'Invoice Processing Automation', blockerType: 'Technical', severity: 'Critical', description: 'OCR engine accuracy falls below 80% for scanned invoices. Vendor SLA breach risk.', raisedBy: 'Brian Walker', raisedDate: '2025-05-05', assignedOwner: 'David Harris', eta: '2025-05-25', resolutionNotes: 'Evaluating alternative OCR providers. Azure AI Document Intelligence POC underway.', status: 'Escalated', createdAt: '2025-05-05', updatedAt: '2025-05-15' },
  { id: 'b2', projectId: 'p9', projectName: 'Asset Management Digitization', blockerType: 'Dependency', severity: 'Critical', description: 'Legacy SCADA system REST API unavailable. Vendor has not provided connector documentation.', raisedBy: 'Adam Cooper', raisedDate: '2025-04-20', assignedOwner: 'Michael Thompson', eta: '2025-06-01', resolutionNotes: 'Vendor escalation raised. Interim workaround via CSV export being considered.', status: 'Escalated', createdAt: '2025-04-20', updatedAt: '2025-05-14' },
  { id: 'b3', projectId: 'p2', projectName: 'Recruitment Automation Bot', blockerType: 'Environment', severity: 'High', description: 'UAT environment not provisioned. Server request pending with IT Ops for 3 weeks.', raisedBy: 'Daniel White', raisedDate: '2025-04-28', assignedOwner: 'Michael Thompson', eta: '2025-05-22', resolutionNotes: '', status: 'Open', createdAt: '2025-04-28', updatedAt: '2025-05-10' },
  { id: 'b4', projectId: 'p7', projectName: 'IT Service Desk Chatbot', blockerType: 'Resource', severity: 'High', description: 'AI/ML specialist unavailable. Current developer lacks Copilot Studio expertise for knowledge base tuning.', raisedBy: 'Eric Turner', raisedDate: '2025-05-01', assignedOwner: 'James Mitchell', eta: '2025-05-30', resolutionNotes: 'Training plan submitted. External consultant engagement being evaluated.', status: 'In Progress', createdAt: '2025-05-01', updatedAt: '2025-05-13' },
  { id: 'b5', projectId: 'p1', projectName: 'Employee Self-Service Portal', blockerType: 'Approval', severity: 'Medium', description: 'Security review approval pending from IT Security team for Azure AD integration.', raisedBy: 'Nathan Clark', raisedDate: '2025-05-08', assignedOwner: 'Sarah Johnson', eta: '2025-05-20', resolutionNotes: 'Review meeting scheduled. DPIA document submitted.', status: 'In Progress', createdAt: '2025-05-08', updatedAt: '2025-05-15' },
  { id: 'b6', projectId: 'p5', projectName: 'Meter Reading Automation', blockerType: 'Technical', severity: 'Low', description: 'Minor data mapping issue between meter system and billing module. Non-critical path.', raisedBy: 'Patrick Nelson', raisedDate: '2025-05-10', assignedOwner: 'Patrick Nelson', eta: '2025-05-18', resolutionNotes: 'Fix deployed to SIT. Regression testing in progress.', status: 'Resolved', createdAt: '2025-05-10', updatedAt: '2025-05-16' },
  { id: 'b7', projectId: 'p8', projectName: 'Compliance Audit Tracker', blockerType: 'Requirement', severity: 'Medium', description: 'New regulatory requirements added scope post-design freeze. Impact assessment needed.', raisedBy: 'Steven Young', raisedDate: '2025-05-12', assignedOwner: 'Laura Bennett', eta: '2025-05-28', resolutionNotes: '', status: 'Open', createdAt: '2025-05-12', updatedAt: '2025-05-12' },
]

export const MOCK_RISKS: Risk[] = [
  { id: 'r1', projectId: 'p4', description: 'OCR vendor unable to meet accuracy SLA — may require full vendor replacement.', impact: 'High', probability: 'High', mitigation: 'Parallel evaluation of Azure AI Document Intelligence as fallback.', owner: 'David Harris', status: 'Open' },
  { id: 'r2', projectId: 'p9', description: 'SCADA system decommission timeline overlap with go-live — dual running cost risk.', impact: 'High', probability: 'Medium', mitigation: 'Architecture decision record raised. Phased go-live approach proposed.', owner: 'Jessica Taylor', status: 'Open' },
  { id: 'r3', projectId: 'p7', description: 'Low adoption risk if chatbot UX does not meet end user expectations.', impact: 'Medium', probability: 'Medium', mitigation: 'User acceptance workshops planned. Iterative feedback loops built into UAT.', owner: 'Michael Thompson', status: 'Mitigated' },
  { id: 'r4', projectId: 'p2', description: 'Data privacy compliance risk due to CV data handling in cloud environment.', impact: 'High', probability: 'Low', mitigation: 'Data residency confirmed. DPIA completed and approved by legal.', owner: 'Sarah Johnson', status: 'Mitigated' },
]

export const MOCK_TASKS: Task[] = [
  { id: 't1', projectId: 'p5', title: 'Fix meter-to-billing data mapping', description: 'Resolve field mismatch between meter reads and billing module.', assignedToId: 'u5', status: 'Completed', createdAt: '2025-05-10', updatedAt: '2025-05-16' },
  { id: 't2', projectId: 'p5', title: 'Regression testing for SIT fixes', description: 'Re-run SIT suite after data mapping fix.', assignedToId: 'u5', status: 'In Progress', createdAt: '2025-05-14', updatedAt: '2025-05-17' },
  { id: 't3', projectId: 'p6', title: 'Build vendor document verification flow', description: 'Automate document checks against ERP master data.', assignedToId: 'u6', status: 'In Progress', createdAt: '2025-05-05', updatedAt: '2025-05-16' },
  { id: 't4', projectId: 'p6', title: 'ERP entry integration testing', description: 'Validate vendor record creation in Oracle ERP.', assignedToId: 'u6', status: 'Not Started', createdAt: '2025-05-12', updatedAt: '2025-05-12' },
  { id: 't5', projectId: 'p4', title: 'Tune OCR accuracy thresholds', description: 'Improve extraction accuracy for scanned invoices.', assignedToId: 'u7', status: 'Blocked', createdAt: '2025-05-06', updatedAt: '2025-05-15' },
  { id: 't6', projectId: 'p4', title: 'Rework approval workflow rules', description: 'Adjust approval routing after scope change.', assignedToId: 'u7', status: 'In Progress', createdAt: '2025-05-11', updatedAt: '2025-05-16' },
  { id: 't7', projectId: 'p8', title: 'Compile audit evidence checklist', description: 'Assemble evidence packs for upcoming regulatory audit.', assignedToId: 'u8', status: 'In Progress', createdAt: '2025-05-08', updatedAt: '2025-05-16' },
  { id: 't8', projectId: 'p8', title: 'UAT training material prep', description: 'Prepare training deck and walkthrough for UAT users.', assignedToId: 'u8', status: 'Completed', createdAt: '2025-05-02', updatedAt: '2025-05-14' },
  { id: 't9', projectId: 'p1', title: 'Azure AD integration for SSO', description: 'Wire single sign-on for the employee portal.', assignedToId: 'u9', status: 'In Progress', createdAt: '2025-05-09', updatedAt: '2025-05-16' },
  { id: 't10', projectId: 'p1', title: 'Leave management module testing', description: 'Functional testing of leave request workflows.', assignedToId: 'u9', status: 'Not Started', createdAt: '2025-05-13', updatedAt: '2025-05-13' },
  { id: 't11', projectId: 'p2', title: 'CV screening model tuning', description: 'Improve shortlisting accuracy of the screening model.', assignedToId: 'u10', status: 'Blocked', createdAt: '2025-05-04', updatedAt: '2025-05-15' },
  { id: 't12', projectId: 'p2', title: 'Interview scheduling workflow', description: 'Automate calendar invites for shortlisted candidates.', assignedToId: 'u10', status: 'In Progress', createdAt: '2025-05-10', updatedAt: '2025-05-16' },
  { id: 't13', projectId: 'p3', title: 'Power BI dashboard performance tuning', description: 'Reduce report load time on the budget forecasting dashboard.', assignedToId: 'u11', status: 'Completed', createdAt: '2025-03-20', updatedAt: '2025-04-08' },
  { id: 't14', projectId: 'p3', title: 'SAP data refresh automation', description: 'Schedule and monitor the nightly SAP-to-Power BI data refresh.', assignedToId: 'u11', status: 'Completed', createdAt: '2025-03-25', updatedAt: '2025-04-09' },
  { id: 't15', projectId: 'p7', title: 'Train NLU model on ticket taxonomy', description: 'Improve intent recognition across the IT ticket category set.', assignedToId: 'u12', status: 'Blocked', createdAt: '2025-05-03', updatedAt: '2025-05-15' },
  { id: 't16', projectId: 'p7', title: 'Build ServiceNow ticket creation connector', description: 'Wire the chatbot to auto-create tickets in ServiceNow.', assignedToId: 'u12', status: 'In Progress', createdAt: '2025-05-09', updatedAt: '2025-05-16' },
  { id: 't17', projectId: 'p9', title: 'Build SCADA legacy connector workaround', description: 'Interim CSV-export bridge while vendor API access is blocked.', assignedToId: 'u13', status: 'Blocked', createdAt: '2025-04-22', updatedAt: '2025-05-14' },
  { id: 't18', projectId: 'p9', title: 'Field asset lifecycle data model', description: 'Design the asset lifecycle schema for maintenance scheduling.', assignedToId: 'u13', status: 'In Progress', createdAt: '2025-04-28', updatedAt: '2025-05-15' },
  { id: 't19', projectId: 'p10', title: 'Vendor scorecard UI', description: 'Build the supplier performance scorecard screens.', assignedToId: 'u14', status: 'In Progress', createdAt: '2025-04-05', updatedAt: '2025-05-12' },
  { id: 't20', projectId: 'p10', title: 'Oracle ERP integration spike', description: 'Prototype the Oracle ERP data feed for vendor scores.', assignedToId: 'u14', status: 'Not Started', createdAt: '2025-05-10', updatedAt: '2025-05-10' },
  { id: 't21', projectId: 'p12', title: 'Bank reconciliation data model design', description: 'Design the schema for automated bank statement reconciliation.', assignedToId: 'u15', status: 'In Progress', createdAt: '2025-05-16', updatedAt: '2025-05-18' },
  { id: 't22', projectId: 'p12', title: 'Treasury reporting requirements gathering', description: 'Interview treasury stakeholders on required cash-flow reports.', assignedToId: 'u15', status: 'Not Started', createdAt: '2025-05-15', updatedAt: '2025-05-15' },
]

function isoDateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(`${dateStr}T00:00:00`).getDay()
  return day === 0 || day === 6
}

/** Deterministic hash so the generated demo history is stable across reloads instead of using Math.random(). */
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

const NOTES_BY_STATUS: Record<string, string[]> = {
  'Not Started': ['Queued up, starting next.', 'Waiting on prior task to wrap before picking this up.'],
  'In Progress': ['Made steady progress today.', 'Working through the remaining edge cases.', 'About halfway through, on track.', 'Paired with QA to validate an early build.'],
  Blocked: ['Still stuck on the same dependency.', 'Escalated, waiting on a response.', 'No movement — blocked on external input.'],
  Completed: ['Wrapped this up and handed off for review.', 'Done — verified in SIT.', 'Finished and closed out.'],
}

function pickNote(seed: number, status: string): string {
  const pool = NOTES_BY_STATUS[status] ?? NOTES_BY_STATUS['In Progress']
  return pool[seed % pool.length]
}

const TODAY = isoDateDaysAgo(0)
/** Deliberately partial so the Pending Updates panel/banner have something to demo — not generated. */
const SUBMITTED_TODAY = new Set(['u5', 'u7', 'u9', 'u11', 'u13', 'u15'])

function generateDailyUpdates(): DailyUpdate[] {
  const developers = MOCK_USERS.filter((u) => u.role === 'Developer')
  const updates: DailyUpdate[] = []
  let counter = 0

  // Last 10 business days before today.
  const pastDates: string[] = []
  for (let back = 1; pastDates.length < 10; back++) {
    const d = isoDateDaysAgo(back)
    if (!isWeekend(d)) pastDates.push(d)
  }

  for (const dev of developers) {
    const myTasks = MOCK_TASKS.filter((t) => t.assignedToId === dev.id)
    if (myTasks.length === 0) continue

    for (const date of pastDates) {
      const submitSeed = hashStr(`${dev.id}|${date}|submit`)
      if (submitSeed % 100 >= 85) continue // ~15% of days missed, like a real team

      const entries: DailyUpdate['entries'] = []
      myTasks.forEach((task, taskIdx) => {
        const touchSeed = hashStr(`${dev.id}|${date}|${task.id}|touch`)
        if (touchSeed % 100 >= 65) return // not every task gets touched every day
        const statusSeed = hashStr(`${dev.id}|${date}|${task.id}|status`)
        const progression: DailyUpdate['entries'][number]['status'][] = taskIdx === 0
          ? ['In Progress', 'In Progress', 'Blocked', 'Completed']
          : ['Not Started', 'In Progress', 'In Progress', 'Blocked']
        const status = progression[statusSeed % progression.length]
        entries.push({ taskId: task.id, status, note: pickNote(statusSeed, status) })
      })
      if (entries.length === 0) continue

      counter += 1
      updates.push({ id: `du${counter}`, developerId: dev.id, date, entries, submittedAt: `${date}T17:${30 + (counter % 25)}:00` })
    }

    if (SUBMITTED_TODAY.has(dev.id)) {
      const entries = myTasks.slice(0, 1).map((task) => ({ taskId: task.id, status: task.status, note: pickNote(hashStr(`${dev.id}|today`), task.status) }))
      counter += 1
      updates.push({ id: `du${counter}`, developerId: dev.id, date: TODAY, entries, submittedAt: `${TODAY}T16:50:00` })
    }
  }

  return updates
}

export const MOCK_DAILY_UPDATES: DailyUpdate[] = generateDailyUpdates()

export const MOCK_GOVERNANCE_LOGS: GovernanceLog[] = [
  { id: 'gl1', entityType: 'Project', entityId: 'p4', entityName: 'Invoice Processing Automation', action: 'Status Changed', performedBy: 'James Mitchell', timestamp: '2025-05-15T10:30:00', changes: 'Status: Delayed → Breached. Escalation flag raised.' },
  { id: 'gl2', entityType: 'Blocker', entityId: 'b1', entityName: 'OCR Accuracy Issue', action: 'Blocker Escalated', performedBy: 'David Harris', timestamp: '2025-05-14T14:15:00', changes: 'Status: Open → Escalated. Owner: David Harris assigned.' },
  { id: 'gl3', entityType: 'Project', entityId: 'p9', entityName: 'Asset Management Digitization', action: 'Status Changed', performedBy: 'Emily Carter', timestamp: '2025-05-13T09:00:00', changes: 'Status: Delayed → Breached. Delay count: 2 → 3.' },
  { id: 'gl4', entityType: 'Domain', entityId: 'd8', entityName: 'Operations', action: 'Domain Updated', performedBy: 'James Mitchell', timestamp: '2025-05-10T11:00:00', changes: 'Owner updated. ProjectCount: 2 → 3.' },
  { id: 'gl5', entityType: 'Project', entityId: 'p3', entityName: 'Budget Forecasting Dashboard', action: 'Project Completed', performedBy: 'James Mitchell', timestamp: '2025-04-10T16:00:00', changes: 'Status: On Track → Completed. ActualCompletionDate set.' },
  { id: 'gl6', entityType: 'Blocker', entityId: 'b6', entityName: 'Meter Data Mapping Issue', action: 'Blocker Resolved', performedBy: 'Patrick Nelson', timestamp: '2025-05-16T08:30:00', changes: 'Status: Open → Resolved. Resolution notes added.' },
  { id: 'gl7', entityType: 'Project', entityId: 'p11', entityName: 'Power Platform CoE Dashboard', action: 'Project Created', performedBy: 'James Mitchell', timestamp: '2025-03-28T09:00:00', changes: 'New project onboarded. Domain: Power Automate Admin.' },
  { id: 'gl8', entityType: 'Project', entityId: 'p2', entityName: 'Recruitment Automation Bot', action: 'Completion % Updated', performedBy: 'Emily Carter', timestamp: '2025-05-12T15:00:00', changes: 'Completion: 38% → 45%. SIT start pushed by 2 weeks.' },
]

export const CHART_DOMAIN_DATA = MOCK_DOMAINS.map((d) => ({
  name: d.name,
  value: d.projectCount,
  color: d.color,
}))

export const CHART_SLA_DATA = [
  { month: 'Dec', breached: 0, compliant: 3 },
  { month: 'Jan', breached: 1, compliant: 5 },
  { month: 'Feb', breached: 1, compliant: 6 },
  { month: 'Mar', breached: 2, compliant: 7 },
  { month: 'Apr', breached: 1, compliant: 8 },
  { month: 'May', breached: 2, compliant: 7 },
]

export const CHART_HEALTH_DATA = [
  { month: 'Dec', healthy: 3, atRisk: 1, critical: 0 },
  { month: 'Jan', healthy: 5, atRisk: 2, critical: 0 },
  { month: 'Feb', healthy: 6, atRisk: 2, critical: 1 },
  { month: 'Mar', healthy: 7, atRisk: 3, critical: 1 },
  { month: 'Apr', healthy: 8, atRisk: 2, critical: 2 },
  { month: 'May', healthy: 8, atRisk: 2, critical: 2 },
]

export const CHART_RELEASE_DATA = [
  { month: 'Dec 24', releases: 1 },
  { month: 'Jan 25', releases: 2 },
  { month: 'Feb 25', releases: 1 },
  { month: 'Mar 25', releases: 3 },
  { month: 'Apr 25', releases: 2 },
  { month: 'May 25', releases: 1 },
  { month: 'Jun 25', releases: 4 },
  { month: 'Jul 25', releases: 3 },
]
