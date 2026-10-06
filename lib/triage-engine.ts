import type {
  Incident,
  Category,
  Severity,
  Extraction,
  Classification,
  PolicyReference,
  DraftReport,
} from "@/types";
import { policyDocuments } from "@/data/policies";

interface TriageInput {
  description: string;
  photoUrl?: string;
}

type TriageResult = Omit<
  Incident,
  "id" | "status" | "createdAt" | "submittedBy" | "auditLog"
>;

interface CategoryRule {
  keywords: string[];
  category: Category;
  severity: Severity;
}

const categoryRules: CategoryRule[] = [
  {
    keywords: ["fire", "smoke", "evacuation", "alarm"],
    category: "safety",
    severity: "critical",
  },
  {
    keywords: [
      "phishing",
      "credential",
      "suspicious link",
      "unauthorized access",
      "breach",
    ],
    category: "security",
    severity: "critical",
  },
  {
    keywords: ["harassment", "discrimination", "complaint"],
    category: "hr",
    severity: "high",
  },
  {
    keywords: ["cable", "trip", "fall", "unsafe", "spill", "leak"],
    category: "safety",
    severity: "high",
  },
  {
    keywords: [
      "overdue",
      "inspection",
      "compliance",
      "expired",
      "certificate",
    ],
    category: "compliance",
    severity: "medium",
  },
  {
    keywords: ["water", "electrical", "hvac", "equipment"],
    category: "facilities",
    severity: "medium",
  },
];

const defaultClassification: { category: Category; severity: Severity } = {
  category: "safety",
  severity: "medium",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyDescription(description: string): {
  category: Category;
  severity: Severity;
} {
  const lower = description.toLowerCase();

  for (const rule of categoryRules) {
    const matched = rule.keywords.some((keyword) => lower.includes(keyword));
    if (matched) {
      return { category: rule.category, severity: rule.severity };
    }
  }

  return { ...defaultClassification };
}

function computeConfidence(
  description: string,
  matchedCategory: Category,
): number {
  const lower = description.toLowerCase();
  const matchingRule = categoryRules.find(
    (rule) => rule.category === matchedCategory,
  );

  if (!matchingRule) return 0.7;

  const matchedKeywords = matchingRule.keywords.filter((kw) =>
    lower.includes(kw),
  );
  const ratio = matchedKeywords.length / matchingRule.keywords.length;

  return Math.min(0.98, 0.75 + ratio * 0.2);
}

function extractDate(): string {
  return new Date().toISOString().split("T")[0];
}

function extractLocation(description: string): string {
  const locationPatterns = [
    /(?:in|at|near|around)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+(?:\d+)?)/,
    /(?:Room|Building|Floor|Warehouse|Office|Area|Zone)\s+[A-Z0-9]+/i,
  ];

  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[0].replace(/^(in|at|near|around)\s+(the\s+)?/i, "").trim();
    }
  }

  return "On-site (specific location not identified)";
}

function extractIncidentType(category: Category, severity: Severity): string {
  const typeMap: Record<Category, string> = {
    safety:
      severity === "critical"
        ? "Life safety emergency"
        : "Safety hazard / Near-miss",
    security: "Information security incident",
    it: "IT systems incident",
    facilities: "Facilities maintenance issue",
    hr: "Human resources incident",
    compliance: "Regulatory compliance violation",
  };
  return typeMap[category];
}

function extractPeopleInvolved(description: string): string[] {
  const people: string[] = [];

  // Match common name patterns (e.g., "John Martinez", "Dr. Smith")
  const namePattern =
    /(?:(?:Mr|Mrs|Ms|Dr|Employee|Manager|Supervisor|Contractor)\.?\s+)?([A-Z][a-z]+\s+[A-Z][a-z]+)/g;
  let match: RegExpExecArray | null;
  while ((match = namePattern.exec(description)) !== null) {
    people.push(match[0].trim());
  }

  if (people.length === 0) {
    people.push("Not specified — requires follow-up");
  }

  return people;
}

function determineImmediateRisk(
  category: Category,
  severity: Severity,
  description: string,
): string {
  if (severity === "critical") {
    if (category === "safety") {
      return "Immediate threat to life and safety. Emergency response required.";
    }
    if (category === "security") {
      return "Active security threat. Potential unauthorized access to systems and data. Immediate containment required.";
    }
  }

  if (severity === "high") {
    if (category === "safety") {
      return `Significant physical hazard present. Risk of injury if not promptly remediated.`;
    }
    if (category === "hr") {
      return "Workplace environment issue requiring prompt intervention to prevent escalation.";
    }
  }

  if (category === "compliance") {
    return "Regulatory non-compliance that may result in penalties or increased risk exposure if not remediated within the required timeline.";
  }

  if (category === "facilities") {
    return "Facilities issue requiring maintenance attention. May affect normal operations if unaddressed.";
  }

  return "Moderate risk requiring timely assessment and corrective action.";
}

function generateExtraction(
  description: string,
  category: Category,
  severity: Severity,
): Extraction {
  return {
    date: extractDate(),
    location: extractLocation(description),
    incidentType: extractIncidentType(category, severity),
    description: description.trim(),
    peopleInvolved: extractPeopleInvolved(description),
    immediateRisk: determineImmediateRisk(category, severity, description),
    evidence: [
      "Incident report submitted via TriageGuard",
      "Details pending on-site verification",
    ],
  };
}

function generateClassification(
  description: string,
  category: Category,
  severity: Severity,
): Classification {
  const confidence = computeConfidence(description, category);

  const rationaleMap: Record<Category, string> = {
    safety: `The reported incident involves physical safety concerns. Based on the description, the severity is assessed as ${severity} due to the potential for personnel injury or environmental hazard.`,
    security: `The reported incident involves information security. Keywords indicate a ${severity}-severity threat to corporate systems or data. Immediate containment and investigation are recommended.`,
    it: `The reported incident affects IT systems or services. The ${severity} severity reflects the scope of disruption to business operations.`,
    facilities: `The reported incident involves a facilities or infrastructure issue. The ${severity} severity is based on the potential operational impact and safety considerations.`,
    hr: `The reported incident involves a human resources concern. The ${severity} severity reflects the potential impact on employee wellbeing and workplace environment.`,
    compliance: `The reported incident involves a regulatory or policy compliance gap. The ${severity} severity is determined by the degree of non-compliance and associated risk exposure.`,
  };

  return {
    category,
    severity,
    rationale: rationaleMap[category],
    confidence,
  };
}

function findPolicyReferences(
  category: Category,
  severity: Severity,
): PolicyReference[] {
  const references: PolicyReference[] = [];

  // Always include the severity matrix
  const severityMatrix = policyDocuments.find(
    (p) => p.id === "severity_matrix",
  );
  if (severityMatrix && severityMatrix.sections.length > 0) {
    references.push({
      document: severityMatrix.title,
      section: severityMatrix.sections[0].title,
      excerpt:
        severityMatrix.sections[0].content.substring(0, 200) + "...",
    });
  }

  // Category-specific policies
  const categoryPolicyMap: Record<Category, string[]> = {
    safety: ["hse_near_miss_policy", "facilities_emergency_procedure"],
    security: ["phishing_response_playbook", "escalation_policy"],
    it: ["escalation_policy"],
    facilities: [
      "facilities_emergency_procedure",
      "fire_safety_compliance",
    ],
    hr: ["escalation_policy", "incident_report_template"],
    compliance: ["fire_safety_compliance", "incident_report_template"],
  };

  const policyIds = categoryPolicyMap[category] || [];
  for (const policyId of policyIds) {
    const policy = policyDocuments.find((p) => p.id === policyId);
    if (policy && policy.sections.length > 0) {
      references.push({
        document: policy.title,
        section: policy.sections[0].title,
        excerpt:
          policy.sections[0].content.substring(0, 200) + "...",
      });
    }
  }

  // For critical severity, always include escalation policy
  if (severity === "critical") {
    const escalation = policyDocuments.find(
      (p) => p.id === "escalation_policy",
    );
    if (
      escalation &&
      !references.some((r) => r.document === escalation.title)
    ) {
      const level4Section =
        escalation.sections.find((s) =>
          s.content.includes("Level 4"),
        ) || escalation.sections[0];
      references.push({
        document: escalation.title,
        section: level4Section.title,
        excerpt: level4Section.content.substring(0, 200) + "...",
      });
    }
  }

  return references;
}

function generateTitle(
  description: string,
  category: Category,
): string {
  const lower = description.toLowerCase();
  const firstSentence = description.split(/[.!?]/)[0].trim();

  if (firstSentence.length <= 80) {
    return firstSentence;
  }

  const categoryPrefix: Record<Category, string> = {
    safety: "Safety Incident",
    security: "Security Incident",
    it: "IT Incident",
    facilities: "Facilities Issue",
    hr: "HR Incident",
    compliance: "Compliance Violation",
  };

  // Try to extract a meaningful short title
  const words = firstSentence.split(" ").slice(0, 10).join(" ");
  return `${categoryPrefix[category]} — ${words}`;
}

function generateDraftReport(
  description: string,
  category: Category,
  severity: Severity,
): DraftReport {
  const summaryPrefix =
    severity === "critical"
      ? "URGENT: "
      : severity === "high"
        ? "HIGH PRIORITY: "
        : "";

  const summary = `${summaryPrefix}An incident has been reported and automatically triaged. ${description.trim()} This requires ${severity === "critical" || severity === "high" ? "immediate" : "timely"} attention and corrective action per organizational policy.`;

  const actionsByCategory: Record<
    Category,
    { action: string; owner: string; daysUntilDeadline: number }[]
  > = {
    safety: [
      {
        action:
          "Secure the affected area and post warning signage to prevent further exposure to the hazard.",
        owner: "Site Safety Officer",
        daysUntilDeadline: 0,
      },
      {
        action:
          "Conduct an on-site investigation to document the hazard and determine root cause.",
        owner: "HSE Coordinator",
        daysUntilDeadline: 1,
      },
      {
        action:
          "Implement corrective actions to eliminate or mitigate the identified hazard.",
        owner: "Facilities Manager",
        daysUntilDeadline: 3,
      },
    ],
    security: [
      {
        action:
          "Contain the security threat by isolating affected accounts and systems.",
        owner: "IT Security Team",
        daysUntilDeadline: 0,
      },
      {
        action:
          "Conduct forensic investigation to determine the scope of the breach and any data exposure.",
        owner: "IT Security Analyst",
        daysUntilDeadline: 2,
      },
      {
        action:
          "Issue security advisory to affected departments and update threat detection rules.",
        owner: "IT Security Manager",
        daysUntilDeadline: 3,
      },
    ],
    it: [
      {
        action:
          "Assess the scope of the IT issue and implement a temporary workaround if possible.",
        owner: "IT Operations",
        daysUntilDeadline: 0,
      },
      {
        action:
          "Identify root cause and implement a permanent fix.",
        owner: "IT Engineering",
        daysUntilDeadline: 3,
      },
      {
        action:
          "Update monitoring and alerting to detect similar issues proactively.",
        owner: "IT Operations",
        daysUntilDeadline: 7,
      },
    ],
    facilities: [
      {
        action:
          "Dispatch maintenance team to assess and address the reported facilities issue.",
        owner: "Facilities Maintenance Lead",
        daysUntilDeadline: 0,
      },
      {
        action:
          "Complete repairs and verify that the affected area is safe for normal operations.",
        owner: "Facilities Manager",
        daysUntilDeadline: 3,
      },
      {
        action:
          "Review maintenance schedule to prevent recurrence of the issue.",
        owner: "Facilities Director",
        daysUntilDeadline: 7,
      },
    ],
    hr: [
      {
        action:
          "Initiate a confidential review of the reported incident with the involved parties.",
        owner: "HR Manager",
        daysUntilDeadline: 1,
      },
      {
        action:
          "Provide support resources to affected employee(s) as appropriate.",
        owner: "HR Business Partner",
        daysUntilDeadline: 1,
      },
      {
        action:
          "Complete investigation and determine appropriate corrective or disciplinary action.",
        owner: "HR Director",
        daysUntilDeadline: 14,
      },
    ],
    compliance: [
      {
        action:
          "Verify the current compliance status and document the specific gap or violation.",
        owner: "Compliance Officer",
        daysUntilDeadline: 0,
      },
      {
        action:
          "Develop and submit a corrective action plan with supervisor sign-off.",
        owner: "Department Manager",
        daysUntilDeadline: 2,
      },
      {
        action:
          "Implement corrective actions and update compliance records to restore compliant status.",
        owner: "Facilities Maintenance Lead",
        daysUntilDeadline: 5,
      },
    ],
  };

  const now = new Date();
  const actions = (actionsByCategory[category] || actionsByCategory.safety).map(
    (item) => {
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + item.daysUntilDeadline);
      deadline.setHours(17, 0, 0, 0);
      return {
        action: item.action,
        owner: item.owner,
        deadline: deadline.toISOString(),
      };
    },
  );

  return { summary, recommendedActions: actions };
}

export async function triageIncident(
  input: TriageInput,
): Promise<TriageResult> {
  // Simulate AI processing time
  await delay(1500);

  const { description, photoUrl } = input;

  // Step 1: Classify
  const { category, severity } = classifyDescription(description);

  // Step 2: Extract structured data
  const extraction = generateExtraction(description, category, severity);

  // Step 3: Generate classification with confidence
  const classification = generateClassification(
    description,
    category,
    severity,
  );

  // Step 4: Find matching policies
  const policyReferences = findPolicyReferences(category, severity);

  // Step 5: Generate draft report
  const draftReport = generateDraftReport(description, category, severity);

  // Step 6: Build the title
  const title = generateTitle(description, category);

  return {
    title,
    rawInput: description,
    ...(photoUrl && { photoUrl }),
    extraction,
    classification,
    policyReferences,
    draftReport,
  };
}
