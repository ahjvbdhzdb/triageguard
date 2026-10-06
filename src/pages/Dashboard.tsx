import { useMemo } from "react";
import { useStore } from "@/lib/store";
import type { Incident, Severity } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AlertTriangle, Shield, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const severityConfig: Record<
  Severity,
  { label: string; bg: string; text: string; dot: string }
> = {
  critical: {
    label: "Critical",
    bg: "bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    bg: "bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    bg: "bg-yellow-500/15",
    text: "text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Low",
    bg: "bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  triaging: {
    label: "Triaging",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  review: {
    label: "In Review",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  escalated: {
    label: "Escalated",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

function formatIncidentId(id: string): string {
  if (id.startsWith("INC-")) return `#${id}`;
  return `#INC-${id.slice(0, 6)}`;
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.9) return "bg-green-500";
  if (confidence >= 0.7) return "bg-amber-500";
  return "bg-red-500";
}

export default function Dashboard() {
  const { incidents, navigate } = useStore();

  const stats = useMemo(() => {
    const severityCounts: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    let underReview = 0;
    let approved = 0;

    for (const inc of incidents) {
      if (inc.classification?.severity) {
        severityCounts[inc.classification.severity]++;
      }
      if (inc.status === "review" || inc.status === "triaging") underReview++;
      if (inc.status === "approved") approved++;
    }

    return { total: incidents.length, severityCounts, underReview, approved };
  }, [incidents]);

  const sortedIncidents = useMemo(
    () =>
      [...incidents].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [incidents]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Incident Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} total incident{stats.total !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(
            ["critical", "high", "medium", "low"] as Severity[]
          ).map((severity) => {
            const count = stats.severityCounts[severity];
            if (count === 0) return null;
            const config = severityConfig[severity];
            return (
              <Badge
                key={severity}
                className={`${config.bg} ${config.text} border-0 gap-1.5`}
              >
                <span
                  className={`inline-block size-2 rounded-full ${config.dot}`}
                />
                {count} {config.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Incidents
            </CardTitle>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical
            </CardTitle>
            <Shield className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.severityCounts.critical}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Under Review
            </CardTitle>
            <Clock className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.underReview}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Table (desktop) / Cards (mobile) */}
      <Card>
        <CardHeader>
          <CardTitle>All Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedIncidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No incidents reported yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Submit a new incident to get started
              </p>
            </div>
          ) : (
            <>
              {/* Mobile card list */}
              <div className="space-y-3 md:hidden">
                {sortedIncidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    onNavigate={() => navigate("review", incident.id)}
                  />
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedIncidents.map((incident) => (
                      <IncidentRow
                        key={incident.id}
                        incident={incident}
                        onNavigate={() => navigate("review", incident.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function IncidentRow({
  incident,
  onNavigate,
}: {
  incident: Incident;
  onNavigate: () => void;
}) {
  const severity = incident.classification?.severity;
  const category = incident.classification?.category;
  const confidence = incident.classification?.confidence;
  const sevConfig = severity ? severityConfig[severity] : null;
  const statConfig = statusConfig[incident.status] ?? statusConfig.pending;

  let relativeTime: string;
  try {
    relativeTime = formatDistanceToNow(new Date(incident.createdAt), {
      addSuffix: true,
    });
  } catch {
    relativeTime = incident.createdAt;
  }

  return (
    <TableRow
      className="cursor-pointer"
      onClick={onNavigate}
    >
      <TableCell className="font-mono text-xs text-muted-foreground">
        {formatIncidentId(incident.id)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate font-medium">
        {incident.title}
      </TableCell>
      <TableCell>
        {sevConfig ? (
          <Badge
            className={`${sevConfig.bg} ${sevConfig.text} border-0 gap-1.5`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${sevConfig.dot}`}
            />
            {sevConfig.label}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        )}
      </TableCell>
      <TableCell>
        {category ? (
          <Badge variant="outline" className="capitalize">
            {category}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        )}
      </TableCell>
      <TableCell>
        <Badge className={`${statConfig.className} border-0`}>
          {statConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        {confidence != null ? (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${confidenceColor(confidence)}`}
                style={{ width: `${Math.round(confidence * 100)}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {relativeTime}
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
        >
          Review
        </Button>
      </TableCell>
    </TableRow>
  );
}

function IncidentCard({
  incident,
  onNavigate,
}: {
  incident: Incident;
  onNavigate: () => void;
}) {
  const severity = incident.classification?.severity;
  const category = incident.classification?.category;
  const confidence = incident.classification?.confidence;
  const sevConfig = severity ? severityConfig[severity] : null;
  const statConfig = statusConfig[incident.status] ?? statusConfig.pending;

  let relativeTime: string;
  try {
    relativeTime = formatDistanceToNow(new Date(incident.createdAt), {
      addSuffix: true,
    });
  } catch {
    relativeTime = incident.createdAt;
  }

  return (
    <button
      onClick={onNavigate}
      className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono text-muted-foreground">
            {formatIncidentId(incident.id)}
          </p>
          <p className="mt-0.5 text-sm font-medium leading-snug">
            {incident.title}
          </p>
        </div>
        {sevConfig && (
          <Badge className={`${sevConfig.bg} ${sevConfig.text} border-0 gap-1 shrink-0`}>
            <span className={`inline-block size-1.5 rounded-full ${sevConfig.dot}`} />
            {sevConfig.label}
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <Badge variant="outline" className="capitalize text-[11px]">
            {category}
          </Badge>
        )}
        <Badge className={`${statConfig.className} border-0 text-[11px]`}>
          {statConfig.label}
        </Badge>
        {confidence != null && (
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {relativeTime}
        </span>
      </div>
    </button>
  );
}
