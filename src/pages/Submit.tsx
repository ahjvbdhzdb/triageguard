import { useState, useRef, useCallback } from "react";
import { useStore } from "@/lib/store";
import { triageIncident } from "@/lib/triage-engine";
import type { Incident, AuditEntry, Attachment } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Send,
  HardHat,
  Fingerprint,
  Scale,
  Lightbulb,
  Upload,
  X,
  FileVideo,
  ImageIcon,
} from "lucide-react";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB per file

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

const demoScenarios: { label: string; icon: React.ReactNode; description: string }[] = [
  {
    label: "Safety Near-Miss",
    icon: <HardHat className="size-4" />,
    description:
      "While conducting routine inspection in Warehouse B, a forklift operator narrowly avoided collision with a pedestrian worker near the loading dock. The pedestrian was not wearing the required high-visibility vest and was walking in an unmarked pathway between storage racks. No injuries occurred, but the forklift had to brake suddenly, causing a partial load shift. The area has poor lighting and no floor markings separating pedestrian and vehicle zones. Three similar near-misses have been reported in the past quarter.",
  },
  {
    label: "Phishing Incident",
    icon: <Fingerprint className="size-4" />,
    description:
      "Multiple employees in the Finance department received emails appearing to be from our CEO requesting urgent wire transfers. The emails used a domain similar to ours (company-corp.com instead of companycorp.com). At least two employees clicked the link before IT was notified. The link directed to a credential harvesting page mimicking our SSO login portal. One employee may have entered credentials before recognizing the deception. The email bypassed our spam filters and appeared in primary inboxes.",
  },
  {
    label: "Compliance Issue",
    icon: <Scale className="size-4" />,
    description:
      "During a routine audit of our data processing practices, we discovered that customer personal data from the EU region has been stored on servers in a non-approved jurisdiction for approximately 3 months. This affects roughly 15,000 customer records including names, email addresses, and purchase history. The issue arose from a misconfigured cloud storage replication policy after a recent infrastructure migration. This may constitute a GDPR Article 44 violation regarding international data transfers.",
  },
];

export default function Submit() {
  const { incidents, addIncident, navigate } = useStore();

  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- file handling --------------------------------------------------------

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      const rejected: string[] = [];

      for (const f of arr) {
        if (!ACCEPTED_TYPES.includes(f.type)) {
          rejected.push(`${f.name} — unsupported type`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          rejected.push(`${f.name} — exceeds 25 MB`);
          continue;
        }
        try {
          const dataUrl = await readFileAsDataUrl(f);
          setAttachments((prev) => [
            ...prev,
            { name: f.name, type: f.type, dataUrl },
          ]);
        } catch {
          rejected.push(`${f.name} — read failed`);
        }
      }

      if (rejected.length > 0) {
        setError(`Some files were skipped: ${rejected.join("; ")}`);
      }
    },
    [],
  );

  function removeAttachment(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  // ---- drag & drop handlers -------------------------------------------------

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }
  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      await processFiles(e.dataTransfer.files);
    }
  }

  // ---- submit ---------------------------------------------------------------

  async function handleSubmit() {
    const trimmed = description.trim();
    if (!trimmed) {
      setError("Please provide an incident description before submitting.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await triageIncident({
        description: trimmed,
        photoUrl: attachments.length > 0 ? attachments[0].dataUrl : undefined,
      });

      const id = `INC-${String(incidents.length + 1).padStart(3, "0")}`;
      const now = new Date().toISOString();

      const auditLog: AuditEntry[] = [
        {
          timestamp: now,
          actor: "system",
          action: "incident_created",
          details: `Incident submitted via web form${attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ""}`,
        },
        {
          timestamp: now,
          actor: "ai-triage",
          action: "triage_completed",
          details: `AI triage completed with ${result.classification?.severity ?? "unknown"} severity, ${Math.round((result.classification?.confidence ?? 0) * 100)}% confidence`,
        },
      ];

      const newIncident: Incident = {
        id,
        title:
          result.extraction?.incidentType ||
          trimmed.slice(0, 80).trim(),
        rawInput: trimmed,
        attachments: attachments.length > 0 ? attachments : undefined,
        status: "review",
        createdAt: now,
        submittedBy: "Current User",
        extraction: result.extraction,
        classification: result.classification,
        policyReferences: result.policyReferences,
        draftReport: result.draftReport,
        auditLog,
      };

      addIncident(newIncident);
      navigate("review", id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during triage. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Report New Incident</CardTitle>
          <CardDescription>
            Describe the incident in detail. Our AI will automatically extract
            key information, classify severity, and draft an initial report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Submission Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading Overlay */}
          {isSubmitting && (
            <Alert>
              <Loader2 className="size-4 animate-spin" />
              <AlertTitle>AI is analyzing your report...</AlertTitle>
              <AlertDescription>
                Extracting key details, classifying severity, matching policies,
                and drafting the initial report. This may take a few moments.
              </AlertDescription>
            </Alert>
          )}

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none"
            >
              Incident Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[180px]"
              placeholder="Describe what happened in detail. Include when and where it occurred, who was involved, what actions were taken, and any immediate risks or impacts. For example: 'During the night shift at Building C, a chemical spill occurred in the storage area when a container of cleaning solvent was knocked over...'"
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible. The AI performs better with detailed
              descriptions including dates, locations, and people involved.
            </p>
          </div>

          {/* Evidence Attachments — Drag & Drop Zone */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="size-3.5" />
                Evidence Attachments
                <span className="text-xs font-normal text-muted-foreground">
                  (optional — images &amp; videos)
                </span>
              </span>
            </label>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
              } ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    processFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
              />

              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Upload className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    or click to browse — JPG, PNG, GIF, WebP, MP4, WebM (max 25 MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-lg border bg-muted/30"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      disabled={isSubmitting}
                      className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>

                    {att.type.startsWith("video/") ? (
                      <video
                        src={att.dataUrl}
                        controls
                        className="aspect-video w-full rounded-t-lg object-cover"
                      />
                    ) : (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="aspect-video w-full rounded-t-lg object-cover"
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
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Submit &amp; Triage
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Demo Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="size-4 text-amber-500" />
            Quick-Fill Demo Scenarios
          </CardTitle>
          <CardDescription>
            Try one of these pre-written scenarios to see the AI triage in
            action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {demoScenarios.map((scenario) => (
              <Button
                key={scenario.label}
                variant="outline"
                className="h-auto flex-col items-start gap-1 overflow-hidden px-4 py-3 text-left"
                disabled={isSubmitting}
                onClick={() => {
                  setDescription(scenario.description);
                  setError(null);
                }}
              >
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {scenario.icon}
                  {scenario.label}
                </span>
                <span className="w-full truncate text-xs font-normal text-muted-foreground">
                  {scenario.description.slice(0, 80)}...
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
