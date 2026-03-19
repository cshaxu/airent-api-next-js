"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAirentApiNextStudioCatalog = buildAirentApiNextStudioCatalog;
const zod_1 = require("zod");
function unwrapSchema(schema) {
    if (schema.type === "optional" ||
        schema.type === "nullable" ||
        schema.type === "default") {
        return unwrapSchema(schema.unwrap());
    }
    if (schema.type === "pipe") {
        return unwrapSchema(schema.in);
    }
    return schema;
}
function buildSchemaExample(schema) {
    var _a;
    const unwrapped = unwrapSchema(schema);
    if (unwrapped instanceof zod_1.z.ZodObject) {
        return Object.entries(unwrapped.shape).reduce((acc, [key, value]) => {
            acc[key] = buildSchemaExample(value);
            return acc;
        }, {});
    }
    if (unwrapped instanceof zod_1.z.ZodString)
        return "";
    if (unwrapped instanceof zod_1.z.ZodNumber)
        return 0;
    if (unwrapped instanceof zod_1.z.ZodBoolean)
        return false;
    if (unwrapped instanceof zod_1.z.ZodArray)
        return [];
    if (unwrapped instanceof zod_1.z.ZodEnum)
        return (_a = unwrapped.options[0]) !== null && _a !== void 0 ? _a : "";
    if (unwrapped instanceof zod_1.z.ZodUnion) {
        const firstOption = unwrapped.options[0];
        return firstOption ? buildSchemaExample(firstOption) : {};
    }
    if (unwrapped instanceof zod_1.z.ZodLiteral)
        return unwrapped.value;
    if (unwrapped instanceof zod_1.z.ZodAny || unwrapped instanceof zod_1.z.ZodUnknown) {
        return {};
    }
    return {};
}
function describeSchema(prefix, schema, lines = []) {
    const unwrapped = unwrapSchema(schema);
    if (unwrapped instanceof zod_1.z.ZodObject) {
        Object.entries(unwrapped.shape).forEach(([key, value]) => {
            describeSchema(prefix ? `${prefix}.${key}` : key, value, lines);
        });
        return lines;
    }
    if (unwrapped instanceof zod_1.z.ZodArray) {
        lines.push(`${prefix}: array`);
        return lines;
    }
    if (unwrapped instanceof zod_1.z.ZodString) {
        lines.push(`${prefix}: string`);
        return lines;
    }
    if (unwrapped instanceof zod_1.z.ZodNumber) {
        lines.push(`${prefix}: number`);
        return lines;
    }
    if (unwrapped instanceof zod_1.z.ZodBoolean) {
        lines.push(`${prefix}: boolean`);
        return lines;
    }
    if (unwrapped instanceof zod_1.z.ZodEnum) {
        lines.push(`${prefix}: enum(${unwrapped.options.join(", ")})`);
        return lines;
    }
    if (unwrapped instanceof zod_1.z.ZodLiteral) {
        lines.push(`${prefix}: literal(${String(unwrapped.value)})`);
        return lines;
    }
    lines.push(`${prefix}: value`);
    return lines;
}
function buildSection(key, schema) {
    const labelMap = { query: "Query", params: "Params", body: "Body" };
    return {
        key,
        label: labelMap[key],
        defaultValue: JSON.stringify(buildSchemaExample(schema), null, 2),
        summaryLines: describeSchema("", schema),
    };
}
function buildEntityEndpoints(endpoints) {
    return endpoints.map((endpoint) => ({
        id: endpoint.id,
        group: "entities",
        label: endpoint.label,
        entityName: endpoint.entityName,
        operation: endpoint.operation,
        path: endpoint.path,
        method: endpoint.method,
        auth: "none",
        payloadStyle: "data",
        notes: [
            `Entity: ${endpoint.entityName}`,
            `Operation: ${endpoint.operation}`,
            "Requests use current browser session credentials.",
        ],
        sections: [
            ...(endpoint.querySchema ? [buildSection("query", endpoint.querySchema)] : []),
            ...(endpoint.paramsSchema ? [buildSection("params", endpoint.paramsSchema)] : []),
            ...(endpoint.bodySchema ? [buildSection("body", endpoint.bodySchema)] : []),
        ],
        fieldRequest: {
            allFields: [...endpoint.fieldRequestFields],
            defaultFields: [...endpoint.primitiveFieldRequestFields],
        },
    }));
}
function buildDebugEndpoints(endpoints) {
    return endpoints.map((endpoint) => ({
        id: endpoint.id,
        group: "debug",
        label: endpoint.label,
        path: endpoint.path,
        method: endpoint.method,
        auth: endpoint.auth,
        payloadStyle: "body",
        notes: ["Requires X-INTERNAL-SECRET header.", "Requests use POST JSON bodies."],
        sections: endpoint.bodySchema ? [buildSection("body", endpoint.bodySchema)] : [],
        fieldRequest: null,
    }));
}
function buildWebhookEndpoints(endpoints) {
    return endpoints.map((endpoint) => ({
        id: endpoint.id,
        group: "webhook",
        label: endpoint.label,
        path: endpoint.path,
        method: endpoint.method,
        auth: endpoint.auth,
        payloadStyle: "body",
        notes: [
            endpoint.hasCustomAuthorizer
                ? "Custom headers may be required by the webhook authorizer."
                : "No custom webhook authorizer detected.",
            "Requests use POST JSON bodies.",
        ],
        sections: endpoint.bodySchema ? [buildSection("body", endpoint.bodySchema)] : [],
        fieldRequest: null,
    }));
}
function buildCronEndpoints(endpoints) {
    return endpoints.map((endpoint) => ({
        id: endpoint.id,
        group: "cron",
        label: endpoint.label,
        path: endpoint.path,
        method: endpoint.method,
        auth: endpoint.auth,
        payloadStyle: "none",
        notes: [
            "Requires Authorization: Bearer <cron secret>.",
            ...(endpoint.schedule ? [`Schedule: ${endpoint.schedule}`] : []),
            ...(endpoint.maxDuration ? [`Max duration: ${String(endpoint.maxDuration)}s`] : []),
        ],
        sections: [],
        fieldRequest: null,
    }));
}
function buildAirentApiNextStudioCatalog({ entities = [], debug = [], webhook = [], cron = [], } = {}) {
    const groups = [
        {
            key: "entities",
            label: "Entities",
            description: "Auto-generated Airent entity endpoints.",
            endpoints: buildEntityEndpoints(entities),
        },
        {
            key: "debug",
            label: "Debug",
            description: "Internal debug endpoints that require the internal secret.",
            endpoints: buildDebugEndpoints(debug),
        },
        {
            key: "webhook",
            label: "Webhook",
            description: "Webhook endpoints callable with custom headers and JSON bodies.",
            endpoints: buildWebhookEndpoints(webhook),
        },
        {
            key: "cron",
            label: "Cron",
            description: "Manual execution entry points for cron jobs.",
            endpoints: buildCronEndpoints(cron),
        },
    ];
    return groups.filter((group) => group.endpoints.length > 0);
}
//# sourceMappingURL=catalog.js.map