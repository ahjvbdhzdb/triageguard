import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import type { Incident, AuditEntry } from "@/types";
import { sampleIncidents } from "@/data/sample-incidents";

// ── State shape ──────────────────────────────────────────────────────────────

type Page = "dashboard" | "submit" | "review" | "audit";

const VALID_PAGES = new Set<string>(["dashboard", "submit", "review", "audit"]);

/** Read the initial page from the URL hash, e.g. #submit or #review/INC-2026-002 */
function parseHash(): { page: Page; incidentId?: string } {
  const raw = window.location.hash.replace(/^#/, "");
  const [seg, id] = raw.split("/");
  if (VALID_PAGES.has(seg)) return { page: seg as Page, incidentId: id };
  return { page: "dashboard" };
}

interface StoreState {
  incidents: Incident[];
  page: Page;
  selectedIncidentId: string | undefined;
}

// ── Actions ──────────────────────────────────────────────────────────────────

type StoreAction =
  | { type: "ADD_INCIDENT"; incident: Incident }
  | { type: "UPDATE_INCIDENT"; id: string; updates: Partial<Incident> }
  | { type: "NAVIGATE"; page: Page; incidentId?: string }
  | { type: "ADD_AUDIT_ENTRY"; incidentId: string; entry: AuditEntry };

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_INCIDENT":
      return { ...state, incidents: [action.incident, ...state.incidents] };

    case "UPDATE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((inc) =>
          inc.id === action.id ? { ...inc, ...action.updates } : inc
        ),
      };

    case "NAVIGATE":
      return {
        ...state,
        page: action.page,
        selectedIncidentId: action.incidentId,
      };

    case "ADD_AUDIT_ENTRY":
      return {
        ...state,
        incidents: state.incidents.map((inc) =>
          inc.id === action.incidentId
            ? { ...inc, auditLog: [...inc.auditLog, action.entry] }
            : inc
        ),
      };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface StoreContextValue {
  incidents: Incident[];
  page: Page;
  selectedIncidentId: string | undefined;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  navigate: (page: string, incidentId?: string) => void;
  addAuditEntry: (incidentId: string, entry: AuditEntry) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

function buildInitialState(): StoreState {
  const { page, incidentId } = parseHash();
  return {
    incidents: sampleIncidents,
    page,
    selectedIncidentId: incidentId,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  // Keep URL hash in sync with page state
  useEffect(() => {
    const hash =
      state.page === "dashboard"
        ? ""
        : state.selectedIncidentId
          ? `#${state.page}/${state.selectedIncidentId}`
          : `#${state.page}`;
    if (window.location.hash !== hash && window.location.hash !== `#${hash}`) {
      window.history.replaceState(null, "", hash || window.location.pathname);
    }
  }, [state.page, state.selectedIncidentId]);

  // Listen for browser hash changes (back/forward, direct URL entry)
  useEffect(() => {
    function onHashChange() {
      const { page, incidentId } = parseHash();
      dispatch({ type: "NAVIGATE", page, incidentId });
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const addIncident = useCallback((incident: Incident) => {
    dispatch({ type: "ADD_INCIDENT", incident });
  }, []);

  const updateIncident = useCallback(
    (id: string, updates: Partial<Incident>) => {
      dispatch({ type: "UPDATE_INCIDENT", id, updates });
    },
    []
  );

  const navigate = useCallback((page: string, incidentId?: string) => {
    dispatch({ type: "NAVIGATE", page: page as Page, incidentId });
  }, []);

  const addAuditEntry = useCallback(
    (incidentId: string, entry: AuditEntry) => {
      dispatch({ type: "ADD_AUDIT_ENTRY", incidentId, entry });
    },
    []
  );

  const value: StoreContextValue = {
    incidents: state.incidents,
    page: state.page,
    selectedIncidentId: state.selectedIncidentId,
    addIncident,
    updateIncident,
    navigate,
    addAuditEntry,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a <StoreProvider>");
  }
  return ctx;
}
