import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import type {
  Incident,
  Extraction,
  RecommendedAction,
  Severity,
  IncidentStatus,
} from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  AlertOctagon,
  User,
  BookOpen,
  ImageIcon,
  FileVideo,
  Paperclip,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const severityColor: Record<Severity, string> = {
  critical: "bg-red-600 text-white hover:bg-red-600",
  high: "bg-orange-500 text-white hover:bg-orange-500",
  medium: "bg-yellow-400 text-black hover:bg-yellow-400",
  low: "bg-blue-500 text-white hover:bg-blue-500",
};

const statusColor: Record<IncidentStatus, string> = {
  approved: "bg-green-600 text-white hover:bg-green-600",
  escalated: "bg-red-600 text-white hover:bg-red-600",
  review: "bg-amber-500 text-white hover:bg-amber-500",
  triaging: "bg-purple-500 text-white hover:bg-purple-500",
  pending: "bg-gray-400 text-white hover:bg-gray-400",
};

function now() {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Review() {
  const {
    incidents,
    selectedIncidentId,
    navigate,
    updateIncident,
    addAuditEntry,
  } = useStore();

  const incident: Incident | undefined = useMemo(
    () => incidents.find((i) => i.id === selectedIncidentId),
    [incidents, selectedIncidentId],
  );

  // ---- local editable state seeded from the incident -----------------------

  const [extractionEdits, setExtractionEdits] = useState<Partial<Extraction>>(
    {},
  );
  const [summaryEdit, setSummaryEdit] = useState<string | null>(null);
  const [actionsEdit, setActionsEdit] = useState<RecommendedAction[] | null>(
    null,
  );

  // Re-seed when incident changes
  const extraction = useMemo(() => {
    if (!incident?.extraction) return undefined;
    return { ...incident.extraction, ...extractionEdits };
  }, [incident?.extraction, extractionEdits]);

  const summary =
    summaryEdit ?? incident?.draftReport?.summary ?? "";
  const actions =
    actionsEdit ?? incident?.draftReport?.recommendedActions ?? [];

  // ---- guards --------------------------------------------------------------

  if (!incident) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8">
        <AlertOctagon className="size-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">
          No incident selected or incident not found.
        </p>
        <Button variant="outline" onClick={() => navigate("dashboard")}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const severity = incident.classification?.severity ?? "low";
  const category = incident.classification?.category ?? "it";
  const confidence = incident.classification?.confidence ?? 0;
  const isCritical = severity === "critical";

  // ---- actions -------------------------------------------------------------

  function handleApprove() {
    updateIncident(incident!.id, { status: "approved" });
    addAuditEntry(incident!.id, {
      timestamp: now(),
      actor: "Reviewer",
      action: "approved",
      details: "Incident approved after human review.",
    });
    navigate("dashboard");
  }

  function handleEscalate() {
    updateIncident(incident!.id, { status: "escalated" });
    addAuditEntry(incident!.id, {
      timestamp: now(),
      actor: "Reviewer",
      action: "escalated",
      details: "Incident escalated for further investigation.",
    });
    navigate("dashboard");
  }

  function handleSave() {
    const updates: Partial<Incident> = {};

    if (extraction && incident!.extraction) {
      updates.extraction = { ...incident!.extraction, ...extractionEdits };
    }

    if (summaryEdit !== null && incident!.draftReport) {
      updates.draftReport = {
        ...incident!.draftReport,
        summary: summaryEdit,
      };
    }

    if (actionsEdit !== null && incident!.draftReport) {
      updates.draftReport = {
        ...(updates.draftReport ?? incident!.draftReport),
        recommendedActions: actionsEdit,
      };
    }

    updateIncident(incident!.id, updates);
    addAuditEntry(incident!.id, {
      timestamp: now(),
      actor: "Reviewer",
      action: "edited",
      details: "Incident report fields edited and saved.",
    });
  }

  function updateAction(
    idx: number,
    field: keyof RecommendedAction,
    value: string,
  ) {
    const next = [...actions];
    next[idx] = { ...next[idx], [field]: value };
    setActionsEdit(next);
  }

  // ---- render --------------------------------------------------------------

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ===== Top bar ===== */}
      <header className="border-b bg-background px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 gap-1.5"
          onClick={() => navigate("dashboard")}
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Button>

        {/* Critical banner */}
        {isCritical && (
          <Alert variant="destructive" className="mb-4 border-red-600 bg-red-50 dark:bg-red-950">
            <AlertTriangle className="size-4" />
            <AlertTitle className="font-semibold">
              CRITICAL INCIDENT — Human Approval Required
            </AlertTitle>
            <AlertDescription>
              This incident has been classified as critical severity. Immediate
              human review and approval is mandatory before any action can
              proceed.
            </AlertDescription>
          </Alert>
        )}

        {/* Header row */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {incident.title}
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              ID: {incident.id} &middot; Submitted by {incident.submittedBy}{" "}
              &middot;{" "}
              {new Date(incident.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <Badge className={statusColor[incident.status]}>
              {incident.status.charAt(0).toUpperCase() +
                incident.status.slice(1)}
            </Badge>

            {/* Severity */}
            <Badge className={severityColor[severity]}>
              <Shield className="mr-1 size-3" />
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>

            {/* Category */}
            <Badge variant="outline" className="capitalize">
              {category}
            </Badge>

            {/* Confidence */}
            <div className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
              <span className="font-medium">
                {Math.round(confidence * 100)}%
              </span>
              <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(confidence * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">confidence</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Tabs content area ===== */}
      <main className="flex-1 overflow-auto px-4 py-4 pb-28 sm:px-6 sm:py-6">
        <Tabs defaultValue="report" className="w-full">
          <TabsList>
            <TabsTrigger value="report" className="gap-1.5">
              <FileText className="size-4" />
              Report
            </TabsTrigger>
            <TabsTrigger value="policy" className="gap-1.5">
              <BookOpen className="size-4" />
              Policy References
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-1.5">
              <FileText className="size-4" />
              Raw Input
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-1.5">
              <Clock className="size-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* ---------- Report Tab ---------- */}
          <TabsContent value="report" className="mt-4 space-y-6">
            {/* Extraction fields */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="size-5" />
                  Extracted Information
                </CardTitle>
                <CardDescription>
                  AI-extracted fields from the incident report. Edit as needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {extraction ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        value={extraction.date}
                        onChange={(e) =>
                          setExtractionEdits((p) => ({
                            ...p,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={extraction.location}
                        onChange={(e) =>
                          setExtractionEdits((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Incident Type
                      </label>
                      <Input
                        value={extraction.incidentType}
                        onChange={(e) =>
                          setExtractionEdits((p) => ({
                            ...p,
                            incidentType: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Immediate Risk
                      </label>
                      <Input
                        value={extraction.immediateRisk}
                        onChange={(e) =>
                          setExtractionEdits((p) => ({
                            ...p,
                            immediateRisk: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        rows={3}
                        value={extraction.description}
                        onChange={(e) =>
                          setExtractionEdits((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-medium">
                        People Involved
                      </label>
                      <Input
                        value={extraction.peopleInvolved.join(", ")}
                        onChange={(e) =>
                          setExtractionEdits((p) => ({
                            ...p,
                            peopleInvolved: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="Comma-separated names"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No extraction data available for this incident.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Draft report summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="size-5" />
                  Draft Report Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  value={summary}
                  onChange={(e) => setSummaryEdit(e.target.value)}
                  placeholder="No draft summary available..."
                />
              </CardContent>
            </Card>

            {/* Recommended actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="size-5" />
                  Recommended Actions
                </CardTitle>
                <CardDescription>
                  Edit action items, owners, and deadlines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {actions.length > 0 ? (
                  <div className="space-y-3">
                    {actions.map((action, idx) => (
                      <div
                        key={idx}
                        className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3"
                      >
                        <div className="space-y-1 sm:col-span-3">
                          <label className="text-xs font-medium text-muted-foreground">
                            Action
                          </label>
                          <Input
                            value={action.action}
                            onChange={(e) =>
                              updateAction(idx, "action", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">
                            Owner
                          </label>
                          <Input
                            value={action.owner}
                            onChange={(e) =>
                              updateAction(idx, "owner", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">
                            Deadline
                          </label>
                          <Input
                            value={action.deadline}
                            onChange={(e) =>
                              updateAction(idx, "deadline", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recommended actions available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Policy References Tab ---------- */}
          <TabsContent value="policy" className="mt-4 space-y-4">
            {incident.policyReferences &&
            incident.policyReferences.length > 0 ? (
              incident.policyReferences.map((ref, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="size-5 text-primary" />
                      {ref.document}
                    </CardTitle>
                    <CardDescription>Section: {ref.section}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary/30 pl-4 text-sm italic text-muted-foreground">
                      {ref.excerpt}
                    </blockquote>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <BookOpen className="mx-auto mb-2 size-8 opacity-50" />
                  <p>No policy references linked to this incident.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ---------- Raw Input Tab ---------- */}
          <TabsContent value="raw" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="size-5" />
                  Original Submission
                </CardTitle>
                <CardDescription>
                  Submitted by{" "}
                  <span className="font-medium">{incident.submittedBy}</span> on{" "}
                  {new Date(incident.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="max-h-96">
                  <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                    {incident.rawInput}
                  </pre>
                </ScrollArea>

                {/* Legacy photoUrl support */}
                {incident.photoUrl && !incident.attachments?.length && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Attached Photo</h3>
                      <img
                        src={incident.photoUrl}
                        alt="Incident photo"
                        className="max-h-96 rounded-lg border object-contain"
                      />
                    </div>
                  </>
                )}

                {/* New attachments display */}
                {incident.attachments && incident.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-sm font-medium">
                        <Paperclip className="size-4" />
                        Evidence Attachments ({incident.attachments.length})
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {incident.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="overflow-hidden rounded-lg border bg-muted/30"
                          >
                            {att.type.startsWith("video/") ? (
                              <video
                                src={att.dataUrl}
                                controls
                                className="aspect-video w-full object-cover"
                              />
                            ) : (
                              <img
                                src={att.dataUrl}
                                alt={att.name}
                                className="aspect-video w-full object-cover"
                              />
                            )}
                            <div className="flex items-center gap-2 px-3 py-2">
                              {att.type.startsWith("video/") ? (
                                <FileVideo className="size-3.5 shrink-0 text-muted-foreground" />
                              ) : (
                                <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
                              )}
                              <span className="truncate text-xs text-muted-foreground">
                                {att.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Audit Log Tab ---------- */}
          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="size-5" />
                  Audit Trail
                </CardTitle>
                <CardDescription>
                  {incident.auditLog.length} entries recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {incident.auditLog.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...incident.auditLog]
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime(),
                        )
                        .map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1.5">
                                <User className="size-3" />
                                {entry.actor}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {entry.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-sm">
                              {entry.details}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No audit entries recorded yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ===== Sticky action bar ===== */}
      <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
          <Button
            variant="outline"
            className="w-full gap-1.5 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 sm:w-auto"
            onClick={handleSave}
          >
            <FileText className="size-4" />
            Edit &amp; Save
          </Button>
          <Button
            variant="outline"
            className="w-full gap-1.5 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 sm:w-auto"
            onClick={handleEscalate}
          >
            <AlertOctagon className="size-4" />
            Escalate
          </Button>
          <Button
            className="w-full gap-1.5 bg-green-600 text-white hover:bg-green-700 sm:w-auto"
            onClick={handleApprove}
          >
            <CheckCircle className="size-4" />
            Approve
          </Button>
        </div>
      </footer>
    </div>
  );
}
