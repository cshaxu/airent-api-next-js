#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask a question and store the answer in the config object
function askQuestion(question, defaultAnswer) {
  return new Promise((resolve) =>
    rl.question(`${question} (${defaultAnswer}): `, resolve)
  ).then((a) => (a?.length ? a : defaultAnswer));
}

async function getShouldEnable(name) {
  const shouldEnable = await askQuestion(`Enable "${name}"`, "yes");
  return shouldEnable === "yes";
}

/** @typedef {Object} ApiNextConfig
 *  @property {?string} libImportPath
 *  @property {string} appPath
 *  @property {string} airentApiPath
 *  @property {?string} cronSourcePath
 *  @property {?string} cronApiPath
 *  @property {?string} cronHandlerOptions
 *  @property {?string} debugSourcePath
 *  @property {?string} debugApiPath
 *  @property {?string} debugHandlerOptions
 *  @property {?string} webhookSourcePath
 *  @property {?string} webhookApiPath
 *  @property {?string} webhookHandlerOptions
 */

/** @typedef {Object} Config
 *  @property {"commonjs" | "module"} type
 *  @property {?string} libImportPath
 *  @property {string} schemaPath
 *  @property {string} entityPath
 *  @property {?string[]} [augmentors]
 *  @property {?Template[]} [templates]
 *  @property {?ApiNextConfig} apiNext
 */

const PROJECT_PATH = process.cwd();
const CONFIG_FILE_PATH = path.join(PROJECT_PATH, "airent.config.json");

const AIRENT_API_NEXT_RESOURCES_PATH =
  "node_modules/@airent/api-next/resources";

const API_NEXT_AUGMENTOR_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/augmentor.js`;
const API_NEXT_SERVER_CREATE_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-create-one-template.ts.ejs`;
const API_NEXT_SERVER_DELETE_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-delete-one-template.ts.ejs`;
const API_NEXT_SERVER_GET_MANY_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-get-many-template.ts.ejs`;
const API_NEXT_SERVER_GET_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-get-one-template.ts.ejs`;
const API_NEXT_SERVER_GET_ONE_SAFE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-get-one-safe-template.ts.ejs`;
const API_NEXT_SERVER_UPDATE_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-update-one-template.ts.ejs`;

async function loadConfig() {
  const configContent = await fs.promises.readFile(CONFIG_FILE_PATH, "utf8");
  const config = JSON.parse(configContent);
  const augmentors = config.augmentors ?? [];
  const templates = config.templates ?? [];
  return { ...config, augmentors, templates };
}

function addTemplate(config, name) {
  const { templates } = config;
  const template = templates.find((t) => t.name === name);
  if (template === undefined) {
    templates.push({ name, skippable: false });
  }
}

async function configure() {
  const config = await loadConfig();
  const { augmentors } = config;
  const isApiNextEnabled = augmentors.includes(API_NEXT_AUGMENTOR_PATH);
  const shouldEnableApiNext = isApiNextEnabled
    ? true
    : await getShouldEnable("Api Next");
  if (!shouldEnableApiNext) {
    return;
  }
  if (!isApiNextEnabled) {
    augmentors.push(API_NEXT_AUGMENTOR_PATH);
    [
      API_NEXT_SERVER_CREATE_ONE_TEMPLATE_PATH,
      API_NEXT_SERVER_DELETE_ONE_TEMPLATE_PATH,
      API_NEXT_SERVER_GET_MANY_TEMPLATE_PATH,
      API_NEXT_SERVER_GET_ONE_TEMPLATE_PATH,
      API_NEXT_SERVER_GET_ONE_SAFE_TEMPLATE_PATH,
      API_NEXT_SERVER_UPDATE_ONE_TEMPLATE_PATH,
    ].forEach((name) => addTemplate(config, name));
  }

  config.apiNext.appPath = await askQuestion(
    "Next.js App Path",
    config.apiNext.appPath ?? "./src/app"
  );

  config.apiNext.airentApiPath = await askQuestion(
    "Airent API Path",
    config.apiNext.airentApiPath ?? "/api"
  );

  const isCronApiEnabled =
    config.apiNext.cronSourcePath !== undefined &&
    config.apiNext.cronApiPath !== undefined;
  const shouldEnableCronApi = isCronApiEnabled
    ? true
    : await getShouldEnable("Cron API");
  if (shouldEnableCronApi) {
    config.apiNext.cronSourcePath = await askQuestion(
      "Cron Source Path",
      config.apiNext.cronSourcePath ?? "./src/jobs"
    );
    config.apiNext.cronApiPath = await askQuestion(
      "Cron API Path",
      config.apiNext.cronApiPath ?? "/api/jobs"
    );
    config.apiNext.cronHandlerOptions = await askQuestion(
      "Cron Handler Options",
      config.apiNext.cronHandlerOptions ?? ""
    );
  }

  const isDebugApiEnabled =
    config.apiNext.debugSourcePath !== undefined &&
    config.apiNext.debugApiPath !== undefined;
  const shouldEnableDebugApi = isDebugApiEnabled
    ? true
    : await getShouldEnable("Debug API");
  if (shouldEnableDebugApi) {
    config.apiNext.debugSourcePath = await askQuestion(
      "Debug Source Path",
      config.apiNext.debugSourcePath ?? "./src/debug"
    );
    config.apiNext.debugApiPath = await askQuestion(
      "Debug API Path",
      config.apiNext.debugApiPath ?? "/api/debug"
    );
    config.apiNext.debugHandlerOptions = await askQuestion(
      "Debug Handler Options",
      config.apiNext.debugHandlerOptions ?? ""
    );
  }

  const isWebhookApiEnabled =
    config.apiNext.webhookSourcePath !== undefined &&
    config.apiNext.webhookApiPath !== undefined;
  const shouldEnableWebhookApi = isWebhookApiEnabled
    ? true
    : await getShouldEnable("Webhook API");
  if (shouldEnableWebhookApi) {
    config.apiNext.webhookSourcePath = await askQuestion(
      "Webhook Source Path",
      config.apiNext.webhookSourcePath ?? "./src/webhooks"
    );
    config.apiNext.webhookApiPath = await askQuestion(
      "Webhook API Path",
      config.apiNext.webhookApiPath ?? "/api/webhooks"
    );
    config.apiNext.webhookHandlerOptions = await askQuestion(
      "Webhook Handler Options",
      config.apiNext.webhookHandlerOptions ?? ""
    );
  }

  const content = JSON.stringify(config, null, 2) + "\n";
  await fs.promises.writeFile(CONFIG_FILE_PATH, content);
  console.log(`[AIRENT-API-NEXT/INFO] Package configured.`);
}

async function main(args) {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      throw new Error('[AIRENT-API-NEXT/ERROR] "airent.config.json" not found');
    }

    if (args.includes("generate")) {
      const { generate } = require("./generate");
      await generate(args);
    } else {
      await configure();
    }
  } finally {
    rl.close();
  }
}

main(process.argv.slice(2)).catch(console.error);
