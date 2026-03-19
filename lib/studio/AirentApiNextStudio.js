"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirentApiNextStudioView = AirentApiNextStudioView;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function buildInitialSectionState(endpoint) {
    return endpoint.sections.reduce((acc, section) => {
        acc[section.key] = section.defaultValue;
        return acc;
    }, {});
}
const styles = {
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
function AirentApiNextStudioView({ groups }) {
    var _a, _b, _c, _d, _e, _f;
    const firstGroupKey = (_b = (_a = groups[0]) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : "entities";
    const [activeGroupKey, setActiveGroupKey] = (0, react_1.useState)(firstGroupKey);
    const [mobileView, setMobileView] = (0, react_1.useState)("details");
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    const activeGroup = (0, react_1.useMemo)(() => { var _a, _b; return (_b = (_a = groups.find((group) => group.key === activeGroupKey)) !== null && _a !== void 0 ? _a : groups[0]) !== null && _b !== void 0 ? _b : null; }, [activeGroupKey, groups]);
    const [selectedEndpointIdsByGroup, setSelectedEndpointIdsByGroup] = (0, react_1.useState)(() => groups.reduce((acc, group) => {
        var _a, _b;
        acc[group.key] = (_b = (_a = group.endpoints[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
        return acc;
    }, {}));
    const [openEntityNames, setOpenEntityNames] = (0, react_1.useState)([]);
    const [sectionState, setSectionState] = (0, react_1.useState)({});
    const [fieldRequestState, setFieldRequestState] = (0, react_1.useState)([]);
    const [internalSecret, setInternalSecret] = (0, react_1.useState)("");
    const [cronSecret, setCronSecret] = (0, react_1.useState)("");
    const [headersJson, setHeadersJson] = (0, react_1.useState)("{}");
    const [responseState, setResponseState] = (0, react_1.useState)(null);
    const [requestPhase, setRequestPhase] = (0, react_1.useState)("idle");
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(null);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const detailsScrollRef = (0, react_1.useRef)(null);
    const responseSectionRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const apply = () => setIsMobile(mediaQuery.matches);
        apply();
        mediaQuery.addEventListener("change", apply);
        return () => mediaQuery.removeEventListener("change", apply);
    }, []);
    (0, react_1.useEffect)(() => {
        if (activeGroup &&
            !activeGroup.endpoints.some((endpoint) => endpoint.id === selectedEndpointIdsByGroup[activeGroup.key])) {
            setSelectedEndpointIdsByGroup((current) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, current), { [activeGroup.key]: (_b = (_a = activeGroup.endpoints[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "" }));
            });
        }
    }, [activeGroup, selectedEndpointIdsByGroup]);
    const selectedEndpoint = (_d = (_c = activeGroup === null || activeGroup === void 0 ? void 0 : activeGroup.endpoints.find((endpoint) => endpoint.id === selectedEndpointIdsByGroup[activeGroup.key])) !== null && _c !== void 0 ? _c : activeGroup === null || activeGroup === void 0 ? void 0 : activeGroup.endpoints[0]) !== null && _d !== void 0 ? _d : null;
    const entityEndpointsByName = (0, react_1.useMemo)(() => {
        if (!activeGroup || activeGroup.key !== "entities") {
            return [];
        }
        const grouped = new Map();
        activeGroup.endpoints.forEach((endpoint) => {
            var _a;
            const entityName = endpoint.entityName || endpoint.id.split(".")[0] || endpoint.id;
            const current = (_a = grouped.get(entityName)) !== null && _a !== void 0 ? _a : [];
            current.push(endpoint);
            grouped.set(entityName, current);
        });
        return Array.from(grouped.entries()).map(([entityName, endpoints]) => ({
            entityName,
            endpoints,
        }));
    }, [activeGroup]);
    (0, react_1.useEffect)(() => {
        if ((activeGroup === null || activeGroup === void 0 ? void 0 : activeGroup.key) !== "entities") {
            return;
        }
        const selectedEntityName = (selectedEndpoint === null || selectedEndpoint === void 0 ? void 0 : selectedEndpoint.entityName) || (selectedEndpoint === null || selectedEndpoint === void 0 ? void 0 : selectedEndpoint.id.split(".")[0]);
        if (!selectedEntityName) {
            return;
        }
        setOpenEntityNames((current) => current.includes(selectedEntityName)
            ? current
            : [...current, selectedEntityName]);
    }, [activeGroup === null || activeGroup === void 0 ? void 0 : activeGroup.key, selectedEndpoint === null || selectedEndpoint === void 0 ? void 0 : selectedEndpoint.entityName, selectedEndpoint === null || selectedEndpoint === void 0 ? void 0 : selectedEndpoint.id]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (!selectedEndpoint) {
            setSectionState({});
            setFieldRequestState([]);
            return;
        }
        setSectionState(buildInitialSectionState(selectedEndpoint));
        setFieldRequestState((_b = (_a = selectedEndpoint.fieldRequest) === null || _a === void 0 ? void 0 : _a.defaultFields) !== null && _b !== void 0 ? _b : []);
        setHeadersJson("{}");
        setErrorMessage(null);
        setResponseState(null);
        setRequestPhase("idle");
    }, [selectedEndpoint]);
    (0, react_1.useEffect)(() => {
        if (requestPhase === "idle") {
            return;
        }
        const scrollContainer = detailsScrollRef.current;
        const responseSection = responseSectionRef.current;
        if (!responseSection) {
            return;
        }
        const frameId = window.requestAnimationFrame(() => {
            const canScrollWithinPane = !!scrollContainer &&
                scrollContainer.scrollHeight > scrollContainer.clientHeight + 8;
            if (scrollContainer && canScrollWithinPane) {
                const containerRect = scrollContainer.getBoundingClientRect();
                const responseRect = responseSection.getBoundingClientRect();
                const nextTop = scrollContainer.scrollTop + (responseRect.top - containerRect.top);
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
    function selectEndpoint(endpointId) {
        setSelectedEndpointIdsByGroup((current) => (Object.assign(Object.assign({}, current), { [activeGroupKey]: endpointId })));
        setMobileView("details");
    }
    function toggleFieldRequest(field) {
        setFieldRequestState((current) => current.includes(field)
            ? current.filter((value) => value !== field)
            : [...current, field]);
    }
    function toggleEntityName(entityName) {
        setOpenEntityNames((current) => current.includes(entityName)
            ? current.filter((value) => value !== entityName)
            : [...current, entityName]);
    }
    if (!activeGroup || !selectedEndpoint) {
        return (0, jsx_runtime_1.jsx)("div", { children: "No Airent Api Next Studio endpoints available." });
    }
    function submit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                setIsSubmitting(true);
                setErrorMessage(null);
                setRequestPhase("pending");
                const headers = {};
                let body;
                if (selectedEndpoint.auth === "internal" && internalSecret.trim()) {
                    headers["X-INTERNAL-SECRET"] = internalSecret.trim();
                }
                if (selectedEndpoint.auth === "cron" && cronSecret.trim()) {
                    headers.Authorization = `Bearer ${cronSecret.trim()}`;
                }
                if (selectedEndpoint.auth === "headers") {
                    const parsedHeaders = JSON.parse(headersJson || "{}");
                    Object.entries(parsedHeaders).forEach(([key, value]) => {
                        headers[key] = String(value);
                    });
                }
                if (selectedEndpoint.payloadStyle === "data") {
                    const payload = selectedEndpoint.sections.reduce((acc, section) => {
                        acc[section.key] = JSON.parse(sectionState[section.key] || "{}");
                        return acc;
                    }, {});
                    if (selectedEndpoint.fieldRequest) {
                        payload.fieldRequest = fieldRequestState.reduce((acc, field) => {
                            acc[field] = true;
                            return acc;
                        }, {});
                    }
                    body = JSON.stringify(payload);
                }
                else if (selectedEndpoint.payloadStyle === "body") {
                    body = JSON.stringify(JSON.parse(sectionState.body || "{}"));
                }
                if (selectedEndpoint.method === "POST") {
                    headers["Content-Type"] = "application/json";
                }
                const response = yield fetch(selectedEndpoint.path, Object.assign({ method: selectedEndpoint.method, credentials: "include", headers }, (body ? { body } : {})));
                const text = yield response.text();
                let formattedBody = text;
                try {
                    formattedBody = JSON.stringify(JSON.parse(text), null, 2);
                }
                catch (_a) {
                    formattedBody = text;
                }
                setResponseState({ status: response.status, body: formattedBody });
                setRequestPhase(response.ok ? "success" : "error");
            }
            catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Request failed");
                setRequestPhase("error");
            }
            finally {
                setIsSubmitting(false);
            }
        });
    }
    const responseStatusLabel = requestPhase === "idle"
        ? "Not submitted yet"
        : requestPhase === "pending"
            ? "Pending"
            : requestPhase === "success"
                ? `Success (${(_e = responseState === null || responseState === void 0 ? void 0 : responseState.status) !== null && _e !== void 0 ? _e : 200})`
                : `Error${(responseState === null || responseState === void 0 ? void 0 : responseState.status) ? ` (${responseState.status})` : ""}`;
    const rootStyle = isMobile
        ? styles.root
        : Object.assign(Object.assign({}, styles.root), { height: "100%", minHeight: 0, overflow: "hidden" });
    const gridStyle = isMobile
        ? Object.assign(Object.assign({}, styles.grid), { gridTemplateColumns: "1fr" }) : Object.assign(Object.assign({}, styles.grid), { flex: "1 1 auto", minHeight: 0, overflow: "hidden" });
    const selectorStyle = Object.assign(Object.assign(Object.assign(Object.assign({}, styles.card), { display: "flex", flexDirection: "column" }), (!isMobile
        ? {
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
        }
        : {})), (isMobile && mobileView !== "selector" ? { display: "none" } : {}));
    const selectorBodyStyle = Object.assign(Object.assign({}, styles.cardBody), (!isMobile
        ? {
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
        }
        : {}));
    const detailsStyle = Object.assign(Object.assign(Object.assign({}, styles.card), (!isMobile
        ? {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
        }
        : {})), (isMobile && mobileView !== "details" ? { display: "none" } : {}));
    const detailsBodyStyle = Object.assign(Object.assign({}, styles.cardBody), (!isMobile
        ? {
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
        }
        : {}));
    return ((0, jsx_runtime_1.jsxs)("div", { style: rootStyle, children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.topBar, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.tabs, children: groups.map((group) => {
                            const isActive = group.key === activeGroup.key;
                            return ((0, jsx_runtime_1.jsx)("button", { type: "button", title: group.description, onClick: () => setActiveGroupKey(group.key), style: Object.assign(Object.assign({}, styles.tab), (isActive ? styles.activeTab : {})), children: group.label }, group.key));
                        }) }), isMobile && ((0, jsx_runtime_1.jsxs)("div", { style: styles.mobileToggleRow, children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setMobileView("selector"), style: Object.assign(Object.assign({}, styles.mobileToggleButton), (mobileView === "selector" ? styles.activeMobileToggleButton : {})), children: "APIs" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setMobileView("details"), style: Object.assign(Object.assign({}, styles.mobileToggleButton), (mobileView === "details" ? styles.activeMobileToggleButton : {})), children: "Details" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { style: gridStyle, children: [(0, jsx_runtime_1.jsxs)("div", { style: selectorStyle, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.compactCardHeader, children: (0, jsx_runtime_1.jsx)("div", { style: styles.endpointMeta, children: activeGroup.description }) }), (0, jsx_runtime_1.jsx)("div", { style: selectorBodyStyle, children: activeGroup.key === "entities"
                                    ? entityEndpointsByName.map(({ entityName, endpoints }) => {
                                        const isOpen = openEntityNames.includes(entityName);
                                        return ((0, jsx_runtime_1.jsxs)("details", { open: isOpen, onToggle: (event) => {
                                                const nextOpen = event.currentTarget.open;
                                                setOpenEntityNames((current) => nextOpen
                                                    ? current.includes(entityName)
                                                        ? current
                                                        : [...current, entityName]
                                                    : current.filter((value) => value !== entityName));
                                            }, children: [(0, jsx_runtime_1.jsx)("summary", { style: styles.summaryLabel, children: entityName }), (0, jsx_runtime_1.jsx)("div", { style: styles.endpointList, children: endpoints.map((endpoint) => {
                                                        const isActive = endpoint.id === selectedEndpoint.id;
                                                        return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => selectEndpoint(endpoint.id), style: Object.assign(Object.assign({}, styles.endpointButton), (isActive ? styles.activeEndpointButton : {})), children: [(0, jsx_runtime_1.jsx)("div", { children: endpoint.operation || endpoint.label }), (0, jsx_runtime_1.jsxs)("div", { style: styles.endpointMeta, children: [endpoint.method, " ", endpoint.path] })] }, endpoint.id));
                                                    }) })] }, entityName));
                                    })
                                    : activeGroup.endpoints.map((endpoint) => {
                                        const isActive = endpoint.id === selectedEndpoint.id;
                                        return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => selectEndpoint(endpoint.id), style: Object.assign(Object.assign({}, styles.endpointButton), (isActive ? styles.activeEndpointButton : {})), children: [(0, jsx_runtime_1.jsx)("div", { children: endpoint.label }), (0, jsx_runtime_1.jsxs)("div", { style: styles.endpointMeta, children: [endpoint.method, " ", endpoint.path] })] }, endpoint.id));
                                    }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: detailsStyle, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.compactCardHeader, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { display: "flex", alignItems: "center" }, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.endpointTitle, children: [selectedEndpoint.method, " ", selectedEndpoint.path] }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => void submit(), disabled: isSubmitting, style: Object.assign(Object.assign({}, styles.submitButton), { opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? "wait" : "pointer" }), children: isSubmitting ? "Submitting..." : "Submit" })] }) }), (0, jsx_runtime_1.jsxs)("div", { style: detailsBodyStyle, ref: detailsScrollRef, children: [selectedEndpoint.notes.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "Notes" }), (0, jsx_runtime_1.jsx)("ul", { style: styles.notes, children: selectedEndpoint.notes.map((note) => ((0, jsx_runtime_1.jsx)("li", { children: note }, note))) })] })), selectedEndpoint.auth === "internal" && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: styles.label, children: "Internal Secret" }), (0, jsx_runtime_1.jsx)("input", { style: styles.input, type: "password", value: internalSecret, onChange: (event) => setInternalSecret(event.target.value), placeholder: "X-INTERNAL-SECRET" })] })), selectedEndpoint.auth === "cron" && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: styles.label, children: "Cron Secret" }), (0, jsx_runtime_1.jsx)("input", { style: styles.input, type: "password", value: cronSecret, onChange: (event) => setCronSecret(event.target.value), placeholder: "Bearer token" })] })), selectedEndpoint.auth === "headers" && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: styles.label, children: "Headers JSON" }), (0, jsx_runtime_1.jsx)("textarea", { style: Object.assign(Object.assign({}, styles.textarea), { minHeight: 120 }), value: headersJson, onChange: (event) => setHeadersJson(event.target.value) })] })), selectedEndpoint.sections.map((section) => {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: styles.label, children: section.label }), section.summaryLines.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { style: Object.assign(Object.assign({}, styles.mutedBox), { marginBottom: 8 }), children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 600, marginBottom: 6 }, children: "Expected fields" }), (0, jsx_runtime_1.jsx)("ul", { style: { margin: 0, paddingLeft: 18, display: "grid", gap: 4 }, children: section.summaryLines.map((line) => ((0, jsx_runtime_1.jsx)("li", { style: {
                                                                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                                                                }, children: line }, line))) })] })), (0, jsx_runtime_1.jsx)("textarea", { style: styles.textarea, value: (_a = sectionState[section.key]) !== null && _a !== void 0 ? _a : "", onChange: (event) => setSectionState((current) => (Object.assign(Object.assign({}, current), { [section.key]: event.target.value }))) })] }, section.key));
                                    }), selectedEndpoint.fieldRequest && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "Field Request" }), (0, jsx_runtime_1.jsx)("div", { style: styles.fieldGrid, children: selectedEndpoint.fieldRequest.allFields.map((field) => ((0, jsx_runtime_1.jsxs)("label", { style: styles.checkboxRow, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: fieldRequestState.includes(field), onChange: () => toggleFieldRequest(field) }), (0, jsx_runtime_1.jsx)("span", { children: field })] }, field))) })] })), errorMessage && (0, jsx_runtime_1.jsx)("div", { style: styles.errorBox, children: errorMessage }), (0, jsx_runtime_1.jsxs)("div", { ref: responseSectionRef, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "Response" }), (0, jsx_runtime_1.jsxs)("div", { style: Object.assign(Object.assign({}, styles.mutedBox), { marginBottom: 8 }), children: ["Status: ", responseStatusLabel] }), (0, jsx_runtime_1.jsx)("textarea", { readOnly: true, style: Object.assign(Object.assign({}, styles.textarea), { minHeight: 220 }), value: (_f = responseState === null || responseState === void 0 ? void 0 : responseState.body) !== null && _f !== void 0 ? _f : "", placeholder: "Response body will appear here" })] })] })] })] })] }));
}
exports.default = AirentApiNextStudioView;
//# sourceMappingURL=AirentApiNextStudio.js.map