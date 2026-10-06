import type { PolicyDocument } from "@/types";

export const policyDocuments: PolicyDocument[] = [
  {
    id: "severity_matrix",
    title: "Incident Severity Classification Matrix",
    filename: "severity_matrix.pdf",
    content:
      "This document defines the standardized severity classification framework used across the organization to assess and prioritize incidents. All reported incidents must be evaluated against this matrix within 30 minutes of initial submission. The matrix considers potential impact to personnel safety, business operations, regulatory standing, and reputational risk to determine the appropriate severity level and corresponding response timeline.",
    sections: [
      {
        title: "Severity Levels",
        content:
          "Critical: Immediate threat to life, safety, or large-scale data breach. Requires executive notification within 15 minutes and activation of the crisis management team. Response deadline: immediate. High: Significant risk of injury, substantial operational disruption, or confirmed security incident affecting sensitive data. Department head must be notified within 1 hour. Response deadline: 4 hours. Medium: Potential risk that requires timely remediation but does not pose an immediate danger. Supervisor notification required within 4 hours. Response deadline: 24 hours. Low: Minor issue with limited impact. Can be addressed during normal business operations. Response deadline: 72 hours.",
      },
      {
        title: "Classification Criteria",
        content:
          "Each incident shall be evaluated on four dimensions: (1) Personnel Impact — whether any individual has been or could be physically harmed; (2) Operational Impact — the degree to which normal business functions are disrupted; (3) Regulatory Impact — whether the incident could result in non-compliance with applicable laws, regulations, or contractual obligations; (4) Reputational Impact — the potential for negative public or stakeholder perception. The highest-scoring dimension determines the overall severity level.",
      },
      {
        title: "Escalation Timelines",
        content:
          "Critical incidents must be escalated to the VP of Operations and the Chief Safety Officer within 15 minutes. High-severity incidents must reach department leadership within 1 hour. Medium-severity incidents require supervisor acknowledgment within 4 hours and a remediation plan within 24 hours. Low-severity incidents must be logged and reviewed during the next scheduled safety meeting. Failure to meet escalation timelines will be treated as a procedural violation subject to review.",
      },
    ],
  },
  {
    id: "escalation_policy",
    title: "Incident Escalation Policy",
    filename: "escalation_policy.pdf",
    content:
      "This policy establishes the chain of command and escalation procedures for all workplace incidents. It ensures that incidents are routed to the appropriate decision-makers based on severity, category, and organizational impact. All employees, contractors, and visitors are covered under this policy. The escalation path must be followed without exception; bypassing levels is only permitted for critical-severity incidents.",
    sections: [
      {
        title: "Escalation Chain",
        content:
          "Level 1 — Immediate Supervisor: Receives initial incident report, performs preliminary assessment, and determines if escalation is warranted. Must respond within 30 minutes during business hours. Level 2 — Department Manager: Reviews incidents escalated by supervisors, authorizes resource allocation for remediation, and coordinates cross-functional response if needed. Must respond within 1 hour. Level 3 — Director / VP: Engaged for high-severity incidents requiring budgetary approval, external communications, or regulatory notification. Must respond within 2 hours. Level 4 — Executive Leadership / Crisis Team: Activated for critical incidents with organization-wide impact. The crisis management team convenes within 30 minutes of notification.",
      },
      {
        title: "Notification Requirements",
        content:
          "All escalation notifications must include: (a) incident ID and timestamp, (b) brief description and current severity assessment, (c) affected personnel or systems, (d) actions taken so far, and (e) recommended next steps. Notifications shall be sent via the TriageGuard platform, with backup notification through the corporate messaging system. Phone calls are required for critical-severity escalations. All notifications are logged automatically for audit purposes.",
      },
    ],
  },
  {
    id: "incident_report_template",
    title: "Standard Incident Report Template",
    filename: "incident_report_template.pdf",
    content:
      "This document provides the required format and content guidelines for all formal incident reports. Completing a thorough incident report is mandatory for every incident classified as medium severity or above. Reports must be submitted within 48 hours of the incident occurrence and reviewed by the responsible department head within 72 hours. The template ensures consistency, completeness, and regulatory compliance across all reporting.",
    sections: [
      {
        title: "Required Report Sections",
        content:
          "Every incident report must contain the following sections: (1) Executive Summary — a concise overview of the incident in 2-3 sentences; (2) Incident Details — date, time, location, involved parties, and a chronological account of events; (3) Root Cause Analysis — identification of contributing factors using the 5-Whys or Fishbone methodology; (4) Impact Assessment — description of actual and potential consequences; (5) Corrective Actions — specific remediation steps with owners and deadlines; (6) Preventive Measures — systemic changes to prevent recurrence; (7) Supporting Evidence — photographs, witness statements, system logs, or other documentation.",
      },
      {
        title: "Submission and Review Process",
        content:
          "Draft reports are created automatically by the TriageGuard system based on AI-extracted incident data. The assigned incident owner must review, edit, and approve the draft before it is marked as final. Final reports require sign-off from the department head and are archived in the compliance document management system. Reports related to regulatory incidents must also be forwarded to the Legal and Compliance team within 5 business days. Quarterly trend analysis is generated from submitted reports to identify systemic risks.",
      },
    ],
  },
  {
    id: "phishing_response_playbook",
    title: "Phishing Incident Response Playbook",
    filename: "phishing_response_playbook.pdf",
    content:
      "This playbook provides step-by-step instructions for responding to confirmed or suspected phishing attacks targeting the organization. It covers initial detection and reporting, credential compromise containment, forensic investigation, employee communication, and post-incident hardening. All IT Security team members and designated department security liaisons must be familiar with this playbook. It is reviewed and updated quarterly to reflect the evolving threat landscape.",
    sections: [
      {
        title: "Immediate Response Steps",
        content:
          "Upon confirmation of a phishing incident: (1) Isolate the affected user account by forcing a password reset and revoking active sessions within 15 minutes; (2) Block the malicious URL/domain at the email gateway and web proxy; (3) Scan the user's device for malware using the endpoint detection and response (EDR) tool; (4) Preserve the phishing email as evidence by exporting it with full headers; (5) Notify the IT Security Manager and initiate the incident response log. If credentials were entered on the phishing page, treat this as a confirmed compromise and activate the credential breach sub-procedure.",
      },
      {
        title: "Credential Compromise Containment",
        content:
          "When corporate credentials have been entered on a phishing page: (a) Reset the user's password across all integrated systems (SSO, email, VPN, cloud services) immediately; (b) Review authentication logs for the past 72 hours to identify any unauthorized access; (c) Check for mail forwarding rules, delegate access, or OAuth app grants added to the compromised account; (d) If MFA was not enabled, enforce MFA enrollment before restoring access; (e) Notify any third-party service providers whose APIs or integrations may be accessible through the compromised credentials.",
      },
      {
        title: "Post-Incident Actions",
        content:
          "Within 48 hours of containment: conduct a root cause analysis to determine how the phishing email bypassed existing filters; update email filtering rules and threat intelligence feeds; issue a targeted security awareness notification to the affected department and a general advisory organization-wide; schedule a mandatory phishing awareness refresher for the affected employee within 7 days; document findings in the incident report and update the phishing indicators of compromise (IOC) database.",
      },
    ],
  },
  {
    id: "hse_near_miss_policy",
    title: "Health, Safety & Environment Near-Miss Reporting Policy",
    filename: "hse_near_miss_policy.pdf",
    content:
      "This policy governs the reporting, investigation, and corrective action process for near-miss events — incidents that did not result in injury, illness, or damage but had the potential to do so. Near-miss reporting is a critical component of the organization's proactive safety culture. All employees and contractors are required to report near-miss events within 24 hours of occurrence. The organization maintains a strict non-punitive reporting policy to encourage full disclosure.",
    sections: [
      {
        title: "Definition and Reporting Criteria",
        content:
          "A near-miss is defined as an unplanned event that did not result in injury, illness, or damage but had the potential to do so under slightly different circumstances. Examples include: unsecured loads, tripping hazards in walkways, equipment operating outside normal parameters, chemical containers without proper labeling, and unauthorized personnel in restricted areas. All near-miss events must be reported through the TriageGuard platform or by notifying the immediate supervisor. Reports should include the date, time, location, description of the event, potential consequences, and any immediate corrective actions taken.",
      },
      {
        title: "Investigation and Corrective Actions",
        content:
          "Every reported near-miss is assigned to the relevant department safety coordinator for investigation within 48 hours. The investigation must determine root causes using systematic analysis methods and identify corrective actions to eliminate or mitigate the hazard. Corrective actions must have assigned owners and deadlines. High-potential near-misses — those that could have resulted in serious injury or fatality — are escalated to the HSE Director and require a formal investigation report within 5 business days. Trends in near-miss data are reviewed monthly by the Safety Committee to identify systemic issues.",
      },
    ],
  },
  {
    id: "facilities_emergency_procedure",
    title: "Facilities Emergency Response Procedures",
    filename: "facilities_emergency_procedure.pdf",
    content:
      "This document outlines emergency response procedures for facilities-related incidents including water leaks, electrical failures, HVAC system malfunctions, structural damage, and equipment breakdowns. It defines roles and responsibilities for the Facilities Management team, building marshals, and emergency services coordinators. All procedures are aligned with local building codes and OSHA requirements. Drills are conducted semi-annually to ensure readiness.",
    sections: [
      {
        title: "Water and Electrical Emergencies",
        content:
          "Water Leak / Flooding: (1) Shut off the nearest water supply valve if it is safe to do so; (2) Move equipment and documents away from the affected area; (3) Contact Facilities Management at extension 4500 or through the TriageGuard emergency channel; (4) Do not use electrical equipment in the flooded area. Electrical Failure: (1) Do not attempt to restore power manually; (2) Evacuate the affected area if backup lighting does not activate within 60 seconds; (3) Contact Facilities Management immediately; (4) For electrical fires, use only CO2 or dry chemical extinguishers — never water.",
      },
      {
        title: "HVAC and Equipment Failures",
        content:
          "HVAC Malfunction: If temperature exceeds 85°F (29°C) or drops below 60°F (15°C), or if unusual odors are detected through the ventilation system: (1) Report immediately to Facilities Management; (2) Evacuate the area if gas or chemical odors are present; (3) Do not attempt to adjust or repair HVAC units. Equipment Breakdown: (1) Power down the affected equipment using the emergency stop if available; (2) Secure the area to prevent unauthorized use; (3) Submit a maintenance request through the facilities portal with equipment ID and description of the malfunction; (4) Do not attempt repairs unless you are authorized maintenance personnel.",
      },
      {
        title: "Building Evacuation Coordination",
        content:
          "When a facilities emergency requires evacuation: Floor marshals activate the buddy system and guide personnel to designated assembly points. Facilities Management coordinates with emergency services and provides building schematics showing utility shutoff locations and hazardous material storage areas. All personnel must be accounted for within 10 minutes of evacuation initiation. Re-entry is not permitted until the Facilities Director and, if applicable, the Fire Department issue an all-clear.",
      },
    ],
  },
  {
    id: "fire_safety_compliance",
    title: "Fire Safety Compliance and Inspection Standards",
    filename: "fire_safety_compliance.pdf",
    content:
      "This document establishes the fire safety compliance requirements for all company facilities, including inspection schedules, equipment maintenance standards, and regulatory obligations under NFPA codes and local fire ordinances. Compliance with this policy is mandatory and is audited quarterly by the HSE team. Non-compliance findings must be remediated within the timelines specified by severity level. Failure to maintain fire safety equipment in working order is classified as a high-severity compliance violation.",
    sections: [
      {
        title: "Inspection Schedules and Requirements",
        content:
          "Fire extinguishers: Monthly visual inspection (check pressure gauge, pin, tamper seal) and annual professional servicing. Inspection tags must be signed and dated. Sprinkler systems: Quarterly flow tests and annual comprehensive inspection by a licensed fire protection contractor. Fire alarms: Monthly functional tests and annual inspection per NFPA 72. Emergency exits: Weekly verification that all exit paths are unobstructed and illuminated. Emergency lighting: Monthly 30-second functional test and annual 90-minute full-duration test. All inspection records must be maintained for a minimum of 3 years and be available for regulatory review on demand.",
      },
      {
        title: "Non-Compliance and Remediation",
        content:
          "Overdue inspections are flagged automatically by the TriageGuard compliance monitoring module. Inspections overdue by 1-7 days are classified as low severity with a 72-hour remediation deadline. Inspections overdue by 8-21 days are classified as medium severity and require supervisor sign-off on a corrective action plan within 48 hours. Inspections overdue by more than 21 days are classified as high severity and trigger immediate escalation to the HSE Director and notification to the building owner. Areas with overdue fire safety inspections that store flammable or hazardous materials are subject to restricted access until compliance is restored.",
      },
      {
        title: "Flammable Material Storage",
        content:
          "All areas designated for flammable material storage must meet the following requirements: fire-rated storage cabinets rated to the appropriate class; clearly posted signage indicating fire hazard and prohibited actions; fire extinguisher of the correct class within 25 feet of the storage area; automatic sprinkler coverage; no storage of flammable materials above shoulder height; weekly housekeeping inspection to remove debris and ensure proper ventilation. Storage rooms containing flammable materials are subject to enhanced inspection frequency — biweekly visual checks in addition to the standard monthly cycle.",
      },
    ],
  },
];
