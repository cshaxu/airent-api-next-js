"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import {
  AirentApiNextStudioEndpointDescriptor,
  AirentApiNextStudioGroupDescriptor,
} from "./types";

type Props = {
  groups: AirentApiNextStudioGroupDescriptor[];
};

type ResponseState = {
  status: number;
  body: string;
};

type RequestPhase = "idle" | "pending" | "success" | "error";

type MobileView = "selector" | "details";

function buildInitialSectionState(endpoint: AirentApiNextStudioEndpointDescriptor) {
  return endpoint.sections.reduce<Record<string, string>>((acc, section) => {
    acc[section.key] = section.defaultValue;
    return acc;
  }, {});
}

const styles: Record<string, CSSProperties> = {
  root: { display: "flex", flexDirection: "column", gap: 16 },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  tabs: { display: "flex", flexWrap: "wrap", gap: 8, flex: "1 1 auto" },
  tab: {
    border: "1px solid #d4d4d8",
    borderRadius: 8,
    background: "#ffffff",
    color: "#18181b",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 14,
  },
  activeTab: {
    border: "1px solid #18181b",
    background: "#18181b",
    color: "#ffffff",
  },
  mobileToggleRow: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    flex: "0 0 auto",
  },
  mobileToggleButton: {
    border: "1px solid #d4d4d8",
    borderRadius: 8,
    background: "#ffffff",
    color: "#18181b",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 14,
  },
  activeMobileToggleButton: {
    border: "1px solid #18181b",
    background: "#18181b",
    color: "#ffffff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 320px) minmax(0, 1fr)",
    gap: 16,
    alignItems: "start",
  },
  card: {
    border: "1px solid #e4e4e7",
    borderRadius: 12,
    overflow: "hidden",
    background: "#ffffff",
  },
  cardHeader: {
    borderBottom: "1px solid #e4e4e7",
    padding: 16,
    background: "#fafafa",
  },
  compactCardHeader: {
    borderBottom: "1px solid #e4e4e7",
    padding: "12px 16px",
    background: "#fafafa",
  },
  cardBody: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  endpointList: { display: "flex", flexDirection: "column", gap: 8 },
  endpointButton: {
    width: "100%",
    textAlign: "left",
    border: "1px solid #e4e4e7",
    borderRadius: 10,
    background: "#ffffff",
    padding: 12,
    cursor: "pointer",
  },
  activeEndpointButton: {
    border: "1px solid #18181b",
    boxShadow: "inset 0 0 0 1px #18181b",
    background: "#fafafa",
  },
  endpointMeta: { fontSize: 12, color: "#52525b", marginTop: 4 },
  endpointTitle: {
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.35,
    color: "#18181b",
  },
  summaryLabel: { cursor: "pointer", fontWeight: 600, padding: "6px 0" },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%",
    border: "1px solid #d4d4d8",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 160,
    border: "1px solid #d4d4d8",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    boxSizing: "border-box",
    resize: "vertical",
  },
  mutedBox: {
    border: "1px solid #e4e4e7",
    borderRadius: 8,
    padding: 12,
    background: "#fafafa",
    fontSize: 12,
  },
  notes: {
    margin: 0,
    paddingLeft: 18,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 8,
  },
  checkboxRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
  submitButton: {
    border: "1px solid #18181b",
    borderRadius: 8,
    background: "#18181b",
    color: "#ffffff",
    padding: "7px 12px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  errorBox: {
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: 12,
    background: "#fef2f2",
    color: "#991b1b",
    fontSize: 13,
  },
};

export function AirentApiNextStudioView({ groups }: Props) {
  const firstGroupKey = groups[0]?.key ?? "entities";
  const [activeGroupKey, setActiveGroupKey] = useState(firstGroupKey);
  const [mobileView, setMobileView] = useState<MobileView>("details");
  const [isMobile, setIsMobile] = useState(false);
  const activeGroup = useMemo(
    () => groups.find((group) => group.key === activeGroupKey) ?? groups[0] ?? null,
    [activeGroupKey, groups]
  );
  const [selectedEndpointIdsByGroup, setSelectedEndpointIdsByGroup] = useState<
    Record<string, string>
  >(() =>
    groups.reduce<Record<string, string>>((acc, group) => {
      acc[group.key] = group.endpoints[0]?.id ?? "";
      return acc;
    }, {})
  );
  const [openEntityNames, setOpenEntityNames] = useState<string[]>([]);
  const [sectionState, setSectionState] = useState<Record<string, string>>({});
  const [fieldRequestState, setFieldRequestState] = useState<string[]>([]);
  const [internalSecret, setInternalSecret] = useState("");
  const [cronSecret, setCronSecret] = useState("");
  const [headersJson, setHeadersJson] = useState("{}");
  const [responseState, setResponseState] = useState<ResponseState | null>(null);
  const [requestPhase, setRequestPhase] = useState<RequestPhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const detailsScrollRef = useRef<HTMLDivElement | null>(null);
  const responseSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mediaQuery.matches);
    apply();
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (
      activeGroup &&
      !activeGroup.endpoints.some(
        (endpoint) => endpoint.id === selectedEndpointIdsByGroup[activeGroup.key]
      )
    ) {
      setSelectedEndpointIdsByGroup((current) => ({
        ...current,
        [activeGroup.key]: activeGroup.endpoints[0]?.id ?? "",
      }));
    }
  }, [activeGroup, selectedEndpointIdsByGroup]);

  const selectedEndpoint =
    activeGroup?.endpoints.find(
      (endpoint) => endpoint.id === selectedEndpointIdsByGroup[activeGroup.key]
    ) ??
    activeGroup?.endpoints[0] ??
    null;

  const entityEndpointsByName = useMemo(() => {
    if (!activeGroup || activeGroup.key !== "entities") {
      return [];
    }
    const grouped = new Map<string, AirentApiNextStudioEndpointDescriptor[]>();
    activeGroup.endpoints.forEach((endpoint) => {
      const entityName = endpoint.entityName || endpoint.id.split(".")[0] || endpoint.id;
      const current = grouped.get(entityName) ?? [];
      current.push(endpoint);
      grouped.set(entityName, current);
    });
    return Array.from(grouped.entries()).map(([entityName, endpoints]) => ({
      entityName,
      endpoints,
    }));
  }, [activeGroup]);

  useEffect(() => {
    if (activeGroup?.key !== "entities") {
      return;
    }
    const selectedEntityName =
      selectedEndpoint?.entityName || selectedEndpoint?.id.split(".")[0];
    if (!selectedEntityName) {
      return;
    }
    setOpenEntityNames((current) =>
      current.includes(selectedEntityName)
        ? current
        : [...current, selectedEntityName]
    );
  }, [activeGroup?.key, selectedEndpoint?.entityName, selectedEndpoint?.id]);

  useEffect(() => {
    if (!selectedEndpoint) {
      setSectionState({});
      setFieldRequestState([]);
      return;
    }
    setSectionState(buildInitialSectionState(selectedEndpoint));
    setFieldRequestState(selectedEndpoint.fieldRequest?.defaultFields ?? []);
    setHeadersJson("{}");
    setErrorMessage(null);
    setResponseState(null);
    setRequestPhase("idle");
  }, [selectedEndpoint]);

  useEffect(() => {
    if (requestPhase === "idle") {
      return;
    }
    const scrollContainer = detailsScrollRef.current;
    const responseSection = responseSectionRef.current;
    if (!responseSection) {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      const canScrollWithinPane =
        !!scrollContainer &&
        scrollContainer.scrollHeight > scrollContainer.clientHeight + 8;

      if (scrollContainer && canScrollWithinPane) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const responseRect = responseSection.getBoundingClientRect();
        const nextTop =
          scrollContainer.scrollTop + (responseRect.top - containerRect.top);
        scrollContainer.scrollTo({
          top: nextTop,
          behavior: "smooth",
        });
        return;
      }

      responseSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [requestPhase, responseState]);

  function selectEndpoint(endpointId: string) {
    setSelectedEndpointIdsByGroup((current) => ({
      ...current,
      [activeGroupKey]: endpointId,
    }));
    setMobileView("details");
  }

  function toggleFieldRequest(field: string) {
    setFieldRequestState((current) =>
      current.includes(field)
        ? current.filter((value) => value !== field)
        : [...current, field]
    );
  }

  function toggleEntityName(entityName: string) {
    setOpenEntityNames((current) =>
      current.includes(entityName)
        ? current.filter((value) => value !== entityName)
        : [...current, entityName]
    );
  }

  if (!activeGroup || !selectedEndpoint) {
    return <div>No Airent Api Next Studio endpoints available.</div>;
  }

  async function submit(): Promise<void> {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setRequestPhase("pending");
      const headers: Record<string, string> = {};
      let body: string | undefined;

      if (selectedEndpoint.auth === "internal" && internalSecret.trim()) {
        headers["X-INTERNAL-SECRET"] = internalSecret.trim();
      }
      if (selectedEndpoint.auth === "cron" && cronSecret.trim()) {
        headers.Authorization = `Bearer ${cronSecret.trim()}`;
      }
      if (selectedEndpoint.auth === "headers") {
        const parsedHeaders = JSON.parse(headersJson || "{}") as Record<string, unknown>;
        Object.entries(parsedHeaders).forEach(([key, value]) => {
          headers[key] = String(value);
        });
      }
      if (selectedEndpoint.payloadStyle === "data") {
        const payload = selectedEndpoint.sections.reduce<Record<string, unknown>>(
          (acc, section) => {
            acc[section.key] = JSON.parse(sectionState[section.key] || "{}");
            return acc;
          },
          {}
        );
        if (selectedEndpoint.fieldRequest) {
          payload.fieldRequest = fieldRequestState.reduce<Record<string, boolean>>(
            (acc, field) => {
              acc[field] = true;
              return acc;
            },
            {}
          );
        }
        body = JSON.stringify(payload);
      } else if (selectedEndpoint.payloadStyle === "body") {
        body = JSON.stringify(JSON.parse(sectionState.body || "{}"));
      }
      if (selectedEndpoint.method === "POST") {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        credentials: "include",
        headers,
        ...(body ? { body } : {}),
      });
      const text = await response.text();
      let formattedBody = text;
      try {
        formattedBody = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        formattedBody = text;
      }
      setResponseState({ status: response.status, body: formattedBody });
      setRequestPhase(response.ok ? "success" : "error");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Request failed");
      setRequestPhase("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const responseStatusLabel =
    requestPhase === "idle"
      ? "Not submitted yet"
      : requestPhase === "pending"
        ? "Pending"
        : requestPhase === "success"
          ? `Success (${responseState?.status ?? 200})`
          : `Error${responseState?.status ? ` (${responseState.status})` : ""}`;

  const rootStyle = isMobile
    ? styles.root
    : {
        ...styles.root,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      };

  const gridStyle = isMobile
    ? { ...styles.grid, gridTemplateColumns: "1fr" }
    : {
        ...styles.grid,
        flex: "1 1 auto",
        minHeight: 0,
        overflow: "hidden",
      };

  const selectorStyle = {
    ...styles.card,
    display: "flex",
    flexDirection: "column" as const,
    ...(!isMobile
      ? {
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }
      : {}),
    ...(isMobile && mobileView !== "selector" ? { display: "none" } : {}),
  };

  const selectorBodyStyle = {
    ...styles.cardBody,
    ...(!isMobile
      ? {
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto" as const,
          overflowX: "hidden" as const,
        }
      : {}),
  };

  const detailsStyle = {
    ...styles.card,
    ...(!isMobile
      ? {
          display: "flex",
          flexDirection: "column" as const,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }
      : {}),
    ...(isMobile && mobileView !== "details" ? { display: "none" } : {}),
  };

  const detailsBodyStyle = {
    ...styles.cardBody,
    ...(!isMobile
      ? {
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto" as const,
          overflowX: "hidden" as const,
        }
      : {}),
  };

  return (
    <div style={rootStyle}>
      <div style={styles.topBar}>
        <div style={styles.tabs}>
          {groups.map((group) => {
            const isActive = group.key === activeGroup.key;
            return (
              <button
                key={group.key}
                type="button"
                title={group.description}
                onClick={() => setActiveGroupKey(group.key)}
                style={{ ...styles.tab, ...(isActive ? styles.activeTab : {}) }}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        {isMobile && (
          <div style={styles.mobileToggleRow}>
            <button
              type="button"
              onClick={() => setMobileView("selector")}
              style={{
                ...styles.mobileToggleButton,
                ...(mobileView === "selector" ? styles.activeMobileToggleButton : {}),
              }}
            >
              APIs
            </button>
            <button
              type="button"
              onClick={() => setMobileView("details")}
              style={{
                ...styles.mobileToggleButton,
                ...(mobileView === "details" ? styles.activeMobileToggleButton : {}),
              }}
            >
              Details
            </button>
          </div>
        )}
      </div>

      <div style={gridStyle}>
        <div style={selectorStyle}>
          <div style={styles.compactCardHeader}>
            <div style={styles.endpointMeta}>{activeGroup.description}</div>
          </div>
          <div style={selectorBodyStyle}>
            {activeGroup.key === "entities"
              ? entityEndpointsByName.map(({ entityName, endpoints }) => {
                  const isOpen = openEntityNames.includes(entityName);
                  return (
                    <details
                      key={entityName}
                      open={isOpen}
                      onToggle={(event) => {
                        const nextOpen = (event.currentTarget as HTMLDetailsElement).open;
                        setOpenEntityNames((current) =>
                          nextOpen
                            ? current.includes(entityName)
                              ? current
                              : [...current, entityName]
                            : current.filter((value) => value !== entityName)
                        );
                      }}
                    >
                      <summary style={styles.summaryLabel}>{entityName}</summary>
                      <div style={styles.endpointList}>
                        {endpoints.map((endpoint) => {
                          const isActive = endpoint.id === selectedEndpoint.id;
                          return (
                            <button
                              key={endpoint.id}
                              type="button"
                              onClick={() => selectEndpoint(endpoint.id)}
                              style={{
                                ...styles.endpointButton,
                                ...(isActive ? styles.activeEndpointButton : {}),
                              }}
                            >
                              <div>{endpoint.operation || endpoint.label}</div>
                              <div style={styles.endpointMeta}>
                                {endpoint.method} {endpoint.path}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  );
                })
              : activeGroup.endpoints.map((endpoint) => {
                  const isActive = endpoint.id === selectedEndpoint.id;
                  return (
                    <button
                      key={endpoint.id}
                      type="button"
                      onClick={() => selectEndpoint(endpoint.id)}
                      style={{
                        ...styles.endpointButton,
                        ...(isActive ? styles.activeEndpointButton : {}),
                      }}
                    >
                      <div>{endpoint.label}</div>
                      <div style={styles.endpointMeta}>
                        {endpoint.method} {endpoint.path}
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>

        <div style={detailsStyle}>
          <div style={styles.compactCardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={styles.endpointTitle}>
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={isSubmitting}
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? "wait" : "pointer",
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          <div style={detailsBodyStyle} ref={detailsScrollRef}>
            {selectedEndpoint.notes.length > 0 && (
              <div>
                <div style={styles.label}>Notes</div>
                <ul style={styles.notes}>
                  {selectedEndpoint.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEndpoint.auth === "internal" && (
              <div>
                <label style={styles.label}>Internal Secret</label>
                <input
                  style={styles.input}
                  type="password"
                  value={internalSecret}
                  onChange={(event) => setInternalSecret(event.target.value)}
                  placeholder="X-INTERNAL-SECRET"
                />
              </div>
            )}

            {selectedEndpoint.auth === "cron" && (
              <div>
                <label style={styles.label}>Cron Secret</label>
                <input
                  style={styles.input}
                  type="password"
                  value={cronSecret}
                  onChange={(event) => setCronSecret(event.target.value)}
                  placeholder="Bearer token"
                />
              </div>
            )}

            {selectedEndpoint.auth === "headers" && (
              <div>
                <label style={styles.label}>Headers JSON</label>
                <textarea
                  style={{ ...styles.textarea, minHeight: 120 }}
                  value={headersJson}
                  onChange={(event) => setHeadersJson(event.target.value)}
                />
              </div>
            )}

            {selectedEndpoint.sections.map((section) => (
              <div key={section.key}>
                <label style={styles.label}>{section.label}</label>
                {section.summaryLines.length > 0 && (
                  <div style={{ ...styles.mutedBox, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Expected fields</div>
                    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                      {section.summaryLines.map((line) => (
                        <li
                          key={line}
                          style={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                          }}
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <textarea
                  style={styles.textarea}
                  value={sectionState[section.key] ?? ""}
                  onChange={(event) =>
                    setSectionState((current) => ({
                      ...current,
                      [section.key]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}

            {selectedEndpoint.fieldRequest && (
              <div>
                <div style={styles.label}>Field Request</div>
                <div style={styles.fieldGrid}>
                  {selectedEndpoint.fieldRequest.allFields.map((field) => (
                    <label key={field} style={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={fieldRequestState.includes(field)}
                        onChange={() => toggleFieldRequest(field)}
                      />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

            <div ref={responseSectionRef}>
              <div style={styles.label}>Response</div>
              <div style={{ ...styles.mutedBox, marginBottom: 8 }}>
                Status: {responseStatusLabel}
              </div>
              <textarea
                readOnly
                style={{ ...styles.textarea, minHeight: 220 }}
                value={responseState?.body ?? ""}
                placeholder="Response body will appear here"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirentApiNextStudioView;
