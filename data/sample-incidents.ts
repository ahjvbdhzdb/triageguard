import type { Incident } from "@/types";

export const sampleIncidents: Incident[] = [
  {
    id: "INC-2026-001",
    title: "Tripping Hazard — Unsecured Cable Near Warehouse 3",
    rawInput:
      "A contractor left a cable across the walkway near Warehouse 3. A worker nearly tripped while carrying equipment. No injury reported but the area remains unsafe. Cable is still in place.",
    status: "review",
    createdAt: "2026-10-06T09:14:00Z",
    submittedBy: "Maria Santos",
    extraction: {
      date: "2026-10-06",
      location: "Walkway adjacent to Warehouse 3",
      incidentType: "Near-miss / Tripping hazard",
      description:
        "A contractor left an unsecured cable running across the main walkway near Warehouse 3. A worker carrying equipment nearly tripped over the cable. No injury was sustained, but the hazard has not been remediated — the cable remains in place and the area continues to pose a risk to foot traffic.",
      peopleInvolved: ["Unidentified contractor", "Affected worker (unnamed)"],
      immediateRisk:
        "Tripping hazard in an active walkway with foot and equipment traffic. Risk of fall-related injury, especially for personnel carrying loads.",
      evidence: [
        "Verbal report from affected worker",
        "Cable still present at reported location",
      ],
    },
    classification: {
      category: "safety",
      severity: "high",
      rationale:
        "The unsecured cable in an active walkway presents a significant tripping hazard that could cause fall-related injuries, particularly for workers carrying heavy equipment. The hazard remains unresolved, increasing the likelihood of an actual incident.",
      confidence: 0.92,
    },
    policyReferences: [
      {
        document: "Health, Safety & Environment Near-Miss Reporting Policy",
        section: "Definition and Reporting Criteria",
        excerpt:
          "A near-miss is defined as an unplanned event that did not result in injury, illness, or damage but had the potential to do so under slightly different circumstances. Examples include: unsecured loads, tripping hazards in walkways...",
      },
      {
        document: "Incident Severity Classification Matrix",
        section: "Classification Criteria",
        excerpt:
          "Personnel Impact — whether any individual has been or could be physically harmed; Operational Impact — the degree to which normal business functions are disrupted.",
      },
    ],
    draftReport: {
      summary:
        "A contractor-created tripping hazard was reported near Warehouse 3 after a worker nearly fell while carrying equipment. The cable remains in place and poses ongoing risk to personnel in the area. Immediate remediation is required to secure or reroute the cable, followed by a contractor safety briefing to prevent recurrence.",
      recommendedActions: [
        {
          action:
            "Immediately secure or remove the cable from the walkway and place warning signage until permanent routing is completed.",
          owner: "Facilities Manager",
          deadline: "2026-10-06T17:00:00Z",
        },
        {
          action:
            "Conduct a safety briefing with the contracting company regarding cable management and walkway obstruction policies.",
          owner: "HSE Coordinator",
          deadline: "2026-10-08T17:00:00Z",
        },
        {
          action:
            "Perform a walkthrough of all contractor work areas to identify any additional tripping or obstruction hazards.",
          owner: "Site Safety Officer",
          deadline: "2026-10-09T17:00:00Z",
        },
        {
          action:
            "Install permanent cable covers or overhead cable routing for any cables that must cross walkways in the warehouse zone.",
          owner: "Facilities Engineering",
          deadline: "2026-10-20T17:00:00Z",
        },
      ],
    },
    auditLog: [
      {
        timestamp: "2026-10-06T09:14:00Z",
        actor: "Maria Santos",
        action: "incident_submitted",
        details:
          "Incident submitted via TriageGuard mobile app with text description.",
      },
      {
        timestamp: "2026-10-06T09:14:08Z",
        actor: "TriageGuard AI",
        action: "triage_completed",
        details:
          "Automated extraction, classification (safety / high / 0.92), policy matching, and draft report generation completed in 8 seconds.",
      },
    ],
  },
  {
    id: "INC-2026-002",
    title: "Phishing Attack — Credential Compromise via Fake HR Email",
    rawInput:
      "Employee John Martinez clicked a suspicious link in an email and entered their corporate credentials into what appeared to be a phishing page. The email appeared to come from HR regarding a benefits update.",
    status: "review",
    createdAt: "2026-10-05T14:32:00Z",
    submittedBy: "Lisa Chen",
    extraction: {
      date: "2026-10-05",
      location: "Corporate office — employee workstation",
      incidentType: "Phishing / Credential compromise",
      description:
        "Employee John Martinez received an email that appeared to originate from the HR department regarding a benefits update. The email contained a link to a fraudulent page designed to harvest corporate credentials. Martinez clicked the link and entered his username and password. The incident was reported after Martinez noticed the page URL did not match the corporate domain.",
      peopleInvolved: [
        "John Martinez (affected employee)",
        "Lisa Chen (reporting manager)",
      ],
      immediateRisk:
        "Corporate credentials have been compromised. Unauthorized access to email, internal systems, and sensitive data is possible. Lateral movement and data exfiltration risk until credentials are revoked.",
      evidence: [
        "Phishing email preserved with full headers",
        "URL of fraudulent credential harvesting page",
        "User confirmation of credential entry",
      ],
    },
    classification: {
      category: "security",
      severity: "critical",
      rationale:
        "Confirmed credential compromise through a phishing attack. Corporate credentials were entered into a malicious page, creating immediate risk of unauthorized access to email, internal applications, and sensitive data. This requires emergency response including credential revocation, session termination, and forensic review.",
      confidence: 0.96,
    },
    policyReferences: [
      {
        document: "Phishing Incident Response Playbook",
        section: "Immediate Response Steps",
        excerpt:
          "Upon confirmation of a phishing incident: (1) Isolate the affected user account by forcing a password reset and revoking active sessions within 15 minutes; (2) Block the malicious URL/domain at the email gateway and web proxy...",
      },
      {
        document: "Phishing Incident Response Playbook",
        section: "Credential Compromise Containment",
        excerpt:
          "When corporate credentials have been entered on a phishing page: (a) Reset the user's password across all integrated systems (SSO, email, VPN, cloud services) immediately; (b) Review authentication logs for the past 72 hours...",
      },
      {
        document: "Incident Escalation Policy",
        section: "Escalation Chain",
        excerpt:
          "Level 4 — Executive Leadership / Crisis Team: Activated for critical incidents with organization-wide impact. The crisis management team convenes within 30 minutes of notification.",
      },
    ],
    draftReport: {
      summary:
        "Employee John Martinez fell victim to a phishing email impersonating the HR department. Corporate credentials were entered into a fraudulent page, resulting in confirmed credential compromise. Immediate containment actions are required including password reset across all systems, session revocation, and forensic review of account activity. The phishing email bypassed existing email filters, indicating a gap in current detection capabilities.",
      recommendedActions: [
        {
          action:
            "Force immediate password reset for John Martinez across all integrated systems (SSO, email, VPN, cloud services) and revoke all active sessions.",
          owner: "IT Security Team",
          deadline: "2026-10-05T15:00:00Z",
        },
        {
          action:
            "Block the malicious URL and sender domain at the email gateway and web proxy. Add indicators to the threat intelligence feed.",
          owner: "IT Security Analyst",
          deadline: "2026-10-05T15:30:00Z",
        },
        {
          action:
            "Review authentication logs for Martinez's account for the past 72 hours to identify unauthorized access, mail forwarding rules, or OAuth app grants.",
          owner: "IT Security Team",
          deadline: "2026-10-06T12:00:00Z",
        },
        {
          action:
            "Scan Martinez's workstation with the EDR tool for malware and check for persistence mechanisms.",
          owner: "Endpoint Security Analyst",
          deadline: "2026-10-06T12:00:00Z",
        },
        {
          action:
            "Issue organization-wide phishing advisory about the HR benefits lure and schedule mandatory phishing awareness training for Martinez within 7 days.",
          owner: "IT Security Manager",
          deadline: "2026-10-07T17:00:00Z",
        },
      ],
    },
    auditLog: [
      {
        timestamp: "2026-10-05T14:32:00Z",
        actor: "Lisa Chen",
        action: "incident_submitted",
        details:
          "Incident submitted via TriageGuard web portal by reporting manager Lisa Chen.",
      },
      {
        timestamp: "2026-10-05T14:32:05Z",
        actor: "TriageGuard AI",
        action: "triage_completed",
        details:
          "Automated extraction, classification (security / critical / 0.96), policy matching, and draft report generation completed in 5 seconds. Escalation flag raised due to critical severity.",
      },
    ],
  },
  {
    id: "INC-2026-003",
    title: "Overdue Fire Extinguisher Inspection — Storage Room B",
    rawInput:
      "Fire extinguisher inspection in Storage Room B is 3 weeks overdue. Last inspection was recorded on September 15. The room stores flammable materials.",
    status: "review",
    createdAt: "2026-10-07T08:45:00Z",
    submittedBy: "David Park",
    extraction: {
      date: "2026-10-07",
      location: "Storage Room B",
      incidentType: "Compliance violation / Overdue fire safety inspection",
      description:
        "The fire extinguisher in Storage Room B has not been inspected since September 15, making the inspection approximately 3 weeks overdue. Storage Room B is designated for flammable material storage, which subjects it to enhanced inspection requirements. The overdue status was identified during a routine facility walkthrough.",
      peopleInvolved: [
        "David Park (reporting employee)",
        "Facilities Maintenance Team",
      ],
      immediateRisk:
        "Fire extinguisher in a flammable material storage area may not be functional. In the event of a fire, the extinguisher could fail to discharge, significantly increasing risk to personnel and property.",
      evidence: [
        "Inspection tag on extinguisher showing last date of September 15",
        "Facility walkthrough observation by David Park",
      ],
    },
    classification: {
      category: "compliance",
      severity: "medium",
      rationale:
        "The fire extinguisher inspection is 3 weeks overdue in an area storing flammable materials. Per the Fire Safety Compliance and Inspection Standards, inspections overdue by 8-21 days in standard areas are medium severity. The presence of flammable materials adds additional risk but does not yet meet the high-severity threshold of 21+ days overdue.",
      confidence: 0.88,
    },
    policyReferences: [
      {
        document: "Fire Safety Compliance and Inspection Standards",
        section: "Inspection Schedules and Requirements",
        excerpt:
          "Fire extinguishers: Monthly visual inspection (check pressure gauge, pin, tamper seal) and annual professional servicing. Inspection tags must be signed and dated.",
      },
      {
        document: "Fire Safety Compliance and Inspection Standards",
        section: "Non-Compliance and Remediation",
        excerpt:
          "Inspections overdue by 8-21 days are classified as medium severity and require supervisor sign-off on a corrective action plan within 48 hours.",
      },
      {
        document: "Fire Safety Compliance and Inspection Standards",
        section: "Flammable Material Storage",
        excerpt:
          "Storage rooms containing flammable materials are subject to enhanced inspection frequency — biweekly visual checks in addition to the standard monthly cycle.",
      },
    ],
    draftReport: {
      summary:
        "A fire extinguisher inspection in Storage Room B is 3 weeks overdue. The room stores flammable materials and is subject to enhanced inspection requirements. The extinguisher's operational status is uncertain, posing a risk in the event of a fire. Immediate inspection and corrective action plan are required to restore compliance.",
      recommendedActions: [
        {
          action:
            "Conduct an immediate visual inspection of the fire extinguisher in Storage Room B (pressure gauge, pin, tamper seal) and document results.",
          owner: "Facilities Maintenance Lead",
          deadline: "2026-10-07T17:00:00Z",
        },
        {
          action:
            "If the extinguisher fails inspection, replace it immediately with a serviced unit of the correct class for flammable material storage.",
          owner: "Facilities Maintenance Lead",
          deadline: "2026-10-08T12:00:00Z",
        },
        {
          action:
            "Submit a corrective action plan with supervisor sign-off addressing the root cause of the missed inspection cycle.",
          owner: "Facilities Manager",
          deadline: "2026-10-09T17:00:00Z",
        },
        {
          action:
            "Audit all fire extinguisher inspection records across the facility to identify any other overdue inspections.",
          owner: "HSE Coordinator",
          deadline: "2026-10-10T17:00:00Z",
        },
        {
          action:
            "Implement automated inspection reminders in the TriageGuard compliance module for all fire safety equipment with escalation triggers at 7, 14, and 21 days overdue.",
          owner: "HSE Director",
          deadline: "2026-10-21T17:00:00Z",
        },
      ],
    },
    auditLog: [
      {
        timestamp: "2026-10-07T08:45:00Z",
        actor: "David Park",
        action: "incident_submitted",
        details:
          "Incident submitted via TriageGuard web portal after routine facility walkthrough.",
      },
      {
        timestamp: "2026-10-07T08:45:06Z",
        actor: "TriageGuard AI",
        action: "triage_completed",
        details:
          "Automated extraction, classification (compliance / medium / 0.88), policy matching, and draft report generation completed in 6 seconds.",
      },
    ],
  },
];
