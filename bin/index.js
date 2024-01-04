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

async function getShouldEnable(name, isEnabled) {
  if (isEnabled) {
    return false;
  }
  const shouldEnable = await askQuestion(`Enable "${name}"`, "yes");
  return shouldEnable === "yes";
}

/** @typedef {Object} Config
 *  @property {"commonjs" | "module"} type
 *  @property {?string} airentPackage
 *  @property {string} schemaPath
 *  @property {string} entityPath
 *  @property {?string[]} [augmentors]
 *  @property {?Template[]} [templates]
 *  @property {?string} airentApiPackage
 *  @property {string} requestContextImport
 *  @property {?string} clientTypePath
 */

const PROJECT_PATH = process.cwd();
const CONFIG_FILE_PATH = path.join(PROJECT_PATH, "airent.config.json");

const AIRENT_API_NEXT_RESOURCES_PATH = "node_modules/airent-api-next/resources";

const API_NEXT_AUGMENTOR_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/augmentor.js`;
const API_NEXT_SERVER_CREATE_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-create-one-template.ts.ejs`;
const API_NEXT_SERVER_DELETE_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-delete-one-template.ts.ejs`;
const API_NEXT_SERVER_GET_MANY_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-get-many-template.ts.ejs`;
const API_NEXT_SERVER_GET_ONE_TEMPLATE_PATH = `${AIRENT_API_NEXT_RESOURCES_PATH}/server-get-one-template.ts.ejs`;
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
  const shouldEnableApiNext = await getShouldEnable(
    "Api Next",
    isApiNextEnabled
  );
  if (shouldEnableApiNext) {
    augmentors.push(API_NEXT_AUGMENTOR_PATH);
  } else if (!isApiNextEnabled) {
    return;
  }

  [
    API_NEXT_SERVER_CREATE_ONE_TEMPLATE_PATH,
    API_NEXT_SERVER_DELETE_ONE_TEMPLATE_PATH,
    API_NEXT_SERVER_GET_MANY_TEMPLATE_PATH,
    API_NEXT_SERVER_GET_ONE_TEMPLATE_PATH,
    API_NEXT_SERVER_UPDATE_ONE_TEMPLATE_PATH,
  ].forEach((name) => addTemplate(config, name));

  const content = JSON.stringify(config, null, 2) + "\n";
  await fs.promises.writeFile(CONFIG_FILE_PATH, content);
  console.log(`[AIRENT-API-NEXT/INFO] Package configured.`);
}

async function main() {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      throw new Error('[AIRENT-API-NEXT/ERROR] "airent.config.json" not found');
    }

    await configure();
  } finally {
    rl.close();
  }
}

main().catch(console.error);
