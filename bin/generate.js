#!/usr/bin/env node

// IMPORTS //

const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

// UTILITIES //

function toTitleCase(name) {
  return name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function toCamelCase(name) {
  return name
    .split("-")
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join("");
}

const utils = { toTitleCase, toCamelCase };

const getTypeScriptFileNames = (inputPath) =>
  fs.promises
    .readdir(inputPath)
    .then((a) =>
      a.filter((n) => n.endsWith(".ts")).map((f) => f.replace(".ts", ""))
    );

const getFolderNames = (inputPath) =>
  fs.promises
    .readdir(inputPath)
    .then((routes) =>
      routes.filter((r) => fs.statSync(path.join(inputPath, r)).isDirectory())
    );

const readFileContent = (inputPath) => fs.promises.readFile(inputPath, "utf-8");
const writeFileContent = async (outputPath, fileName, content) => {
  await fs.promises.mkdir(outputPath, { recursive: true });
  await fs.promises.writeFile(path.join(outputPath, fileName), content);
};
const removeFolder = (inputPath) =>
  fs.promises.rm(inputPath, { force: true, recursive: true });

// TYPES AND CONSTANTS //

const PROJECT_PATH = process.cwd();
const CONFIG_FILE_PATH = path.join(PROJECT_PATH, "airent.config.json");
const VERCEL_JSON_PATH = path.join(PROJECT_PATH, "vercel.json");

const AIRENT_API_NEXT_PATH = path.join(__dirname, "..");
const AIRENT_API_NEXT_RESOURCES_PATH = path.join(
  AIRENT_API_NEXT_PATH,
  "resources"
);

const CRON_TEMPLATE_PATH = path.join(
  AIRENT_API_NEXT_RESOURCES_PATH,
  "server-cron-template.ts.ejs"
);
const DEBUG_TEMPLATE_PATH = path.join(
  AIRENT_API_NEXT_RESOURCES_PATH,
  "server-debug-template.ts.ejs"
);
const WEBHOOK_TEMPLATE_PATH = path.join(
  AIRENT_API_NEXT_RESOURCES_PATH,
  "server-webhook-template.ts.ejs"
);

async function loadConfig(isVerbose) {
  if (isVerbose) {
    console.log(
      `[AIRENT-API-NEXT/INFO] Loading config ${CONFIG_FILE_PATH} ...`
    );
  }
  const configContent = await fs.promises.readFile(CONFIG_FILE_PATH, "utf8");
  const config = JSON.parse(configContent);
  if (isVerbose) {
    console.log(config.apiNext);
  }
  return config;
}

function buildLibPackage(config, fromPath) {
  const { libImportPath } = config.apiNext;
  return libImportPath
    ? libImportPath.startsWith(".")
      ? path
          .relative(fromPath, path.join(PROJECT_PATH, libImportPath))
          .replaceAll("\\", "/")
      : libImportPath
    : "@airent/api-next";
}

function buildHandlerConfigPackage(config, absolutePath) {
  const { handlerConfigImportPath } = config.api.server;
  return handlerConfigImportPath.startsWith(".")
    ? path
        .relative(
          absolutePath,
          path.join(PROJECT_PATH, handlerConfigImportPath)
        )
        .replaceAll("\\", "/")
    : handlerConfigImportPath;
}

async function buildCronJobApis(config, isVerbose) {
  if (isVerbose) {
    console.log("[AIRENT-API-NEXT/INFO] Building cron job APIs...");
  }

  const cronInputPath = path.join(PROJECT_PATH, config.apiNext.cronSourcePath);
  const cronOutputBasePath = path.join(
    PROJECT_PATH,
    config.apiNext.appPath,
    config.apiNext.cronApiPath
  );

  // load cron job list
  const names = await getTypeScriptFileNames(cronInputPath);
  if (names.length === 0) {
    return;
  }

  // load cron job content
  const inputContents = await Promise.all(
    names
      .map((n) => path.join(cronInputPath, `${n}.ts`))
      .map((p) => readFileContent(p))
  );
  const inputLinesList = inputContents.map((c) => c.split("\n"));

  // build cron job api endpoints
  const maxDurations = inputLinesList.map((lines) =>
    lines
      .filter((l) => l.startsWith("export const maxDuration"))
      .map((l) => l.split("=")[1].trim().replace(";", ""))
      .at(0)
  );

  const template = await readFileContent(CRON_TEMPLATE_PATH);

  await removeFolder(cronOutputBasePath);

  names.forEach(async (name, i) => {
    const maxDuration = maxDurations[i];
    const outputPath = path.join(cronOutputBasePath, name);
    const apiNextPackage = buildLibPackage(config, outputPath);
    const cronPath = path.relative(outputPath, cronInputPath);
    const cronPackage = path.join(cronPath, name).replaceAll("\\", "/");
    const handlerConfigPackage = buildHandlerConfigPackage(config, outputPath);
    const data = {
      apiNextPackage,
      cronPackage,
      handlerConfigPackage,
      name,
      maxDuration,
      config,
    };

    const outputContent = ejs.render(template, data);
    await writeFileContent(outputPath, "route.ts", outputContent);
  });

  // build & save vercel.json
  const isVercelJsonExists = fs.existsSync(VERCEL_JSON_PATH);
  const vercelJsonContent = isVercelJsonExists
    ? await readFileContent(VERCEL_JSON_PATH).then((c) => c || "{}")
    : "{}";
  const vercelJson = JSON.parse(vercelJsonContent);
  const schedules = inputLinesList.map((lines) =>
    lines
      .filter((l) => l.startsWith("export const schedule"))
      .map((l) => l.split("=")[1].trim().replace(";", "").replaceAll("'", ""))
      .at(0)
  );
  vercelJson.crons = names.map((n, i) => ({
    path: `${config.apiNext.cronApiPath}/${n}`,
    schedule: schedules[i],
  }));
  const newVercelJsonContent = JSON.stringify(vercelJson, null, 2) + "\n";
  await fs.promises.writeFile(VERCEL_JSON_PATH, newVercelJsonContent);
}

async function buildDebugApi(config, isVerbose) {
  if (isVerbose) {
    console.log("[AIRENT-API-NEXT/INFO] Building debug API...");
  }

  const debugInputPath = path.join(
    PROJECT_PATH,
    config.apiNext.debugSourcePath
  );
  const debugOutputPath = path.join(
    PROJECT_PATH,
    config.apiNext.appPath,
    config.apiNext.debugApiPath
  );

  const apiNextPackage = buildLibPackage(config, debugOutputPath);
  const debugBasePackage = path
    .relative(debugOutputPath, debugInputPath)
    .replaceAll("\\", "/");
  const contextPackage = config.contextImportPath.startsWith("@")
    ? config.contextImportPath
    : path
        .relative(
          debugOutputPath,
          path.join(PROJECT_PATH, config.contextImportPath)
        )
        .replaceAll("\\", "/");
  const handlerConfigPackage = buildHandlerConfigPackage(
    config,
    debugOutputPath
  );

  const names = await getTypeScriptFileNames(debugInputPath);
  const data = {
    apiNextPackage,
    debugBasePackage,
    contextPackage,
    handlerConfigPackage,
    names,
    config,
    utils,
  };

  const template = await readFileContent(DEBUG_TEMPLATE_PATH);
  const content = ejs.render(template, data);
  await writeFileContent(debugOutputPath, "route.ts", content);
}

async function buildWebhookApis(config, isVerbose) {
  if (isVerbose) {
    console.log("[AIRENT-API-NEXT/INFO] Building webhook APIs...");
  }

  const webhookInputPath = path.join(
    PROJECT_PATH,
    config.apiNext.webhookSourcePath
  );
  const webhookOutputBasePath = path.join(
    PROJECT_PATH,
    config.apiNext.appPath,
    config.apiNext.webhookApiPath
  );

  // load webhook list
  const names = await getTypeScriptFileNames(webhookInputPath);
  if (names.length === 0) {
    return;
  }

  const template = await readFileContent(WEBHOOK_TEMPLATE_PATH);

  await removeFolder(webhookOutputBasePath);

  names.forEach(async (name) => {
    const outputPath = path.join(webhookOutputBasePath, name);
    const apiNextPackage = buildLibPackage(config, outputPath);
    const webhookPath = path.relative(outputPath, webhookInputPath);
    const webhookPackage = path.join(webhookPath, name).replaceAll("\\", "/");
    const handlerConfigPackage = buildHandlerConfigPackage(config, outputPath);
    const data = {
      apiNextPackage,
      webhookPackage,
      handlerConfigPackage,
      name,
      config,
    };
    const content = ejs.render(template, data);
    await writeFileContent(outputPath, "route.ts", content);
  });
}

async function generate(argv) {
  const isVerbose = argv.includes("--verbose") || argv.includes("-v");

  // load config
  const config = await loadConfig(isVerbose);

  await buildCronJobApis(config, isVerbose);
  await buildDebugApi(config, isVerbose);
  await buildWebhookApis(config, isVerbose);

  console.log("[AIRENT-API-NEXT/INFO] Task completed.");
}

module.exports = { generate };
