import { useMemo } from "react";
import { useStore } from "@/lib/store";
import type { AuditEntry } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ArrowLeft, Clock, Shield } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface AuditRow extends AuditEntry {
  incidentId: string;
  incidentTitle: string;
}

const actionColor: Record<string, string> = {
  created: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  escalated: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  edited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  triaged: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

function getActionBadgeClass(action: string): string {
  const key = action.toLowerCase();
  return actionColor[key] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuditLog() {
  const { incidents, navigate } = useStore();

  const allEntries: AuditRow[] = useMemo(() => {
    const rows: AuditRow[] = [];
    for (const incident of incidents) {
      for (const entry of incident.auditLog) {
        rows.push({
          ...entry,
          incidentId: incident.id,
          incidentTitle: incident.title,
        });
      }
    }
    rows.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return rows;
  }, [incidents]);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ===== Header ===== */}
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

        <div className="flex items-center gap-3">
          <Shield className="size-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              System Audit Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete chronological record of all actions across every incident
              in the system.
            </p>
          </div>
        </div>
      </header>

      {/* ===== Content ===== */}
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="size-5" />
              All Audit Entries
            </CardTitle>
            <CardDescription>
              {allEntries.length}{" "}
              {allEntries.length === 1 ? "entry" : "entries"} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allEntries.length > 0 ? (
              <>
                {/* Mobile card list */}
                <div className="space-y-3 md:hidden">
                  {allEntries.map((row, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate("review", row.incidentId)}
                      className="w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent/50"
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <Badge className={`capitalize text-[11px] ${getActionBadgeClass(row.action)}`}>
                          {row.action}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(row.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-snug">{row.incidentTitle}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{row.details}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {row.incidentId} &middot; {row.actor}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block">
                  <ScrollArea className="max-h-[70vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Incident ID</TableHead>
                      <TableHead>Incident Title</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEntries.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(row.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="font-mono text-sm text-primary underline-offset-4 hover:underline"
                            onClick={() =>
                              navigate("review", row.incidentId)
                            }
                          >
                            {row.incidentId}
                          </button>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {row.incidentTitle}
                        </TableCell>
                        <TableCell className="text-sm">
                          {row.actor}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${getActionBadgeClass(row.action)}`}
                          >
                            {row.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {row.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <Clock className="size-10 opacity-40" />
                <p className="text-sm">No audit entries recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
