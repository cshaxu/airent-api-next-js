const path = require("path");
const utils = require("airent/resources/utils.js");

function buildRelativePath(sourcePath, targetPath) /* string */ {
  const rawRelativePath = path
    .relative(sourcePath, targetPath)
    .replaceAll("\\", "/");
  return rawRelativePath.startsWith(".")
    ? rawRelativePath
    : `./${rawRelativePath}`;
}

function buildRelativeFull(sourcePath, targetPath, config) /* string */ {
  if (!targetPath.startsWith(".")) {
    return targetPath;
  }
  const suffix = utils.getModuleSuffix(config);
  const relativePath = buildRelativePath(sourcePath, targetPath);
  return `${relativePath}${suffix}`;
}

function augmentConfig(config) {
  config._packages.apiNext = config._packages.apiNext || {};

  config._packages.apiNext.handlerToLibFull = config.apiNext.libImportPath
    ? buildRelativeFull(
        path.join(config.generatedPath, "handlers"),
        config.apiNext.libImportPath,
        config
      )
    : "@airent/api-next";
  config._packages.apiNext.handlerToHandlerConfigFull = buildRelativeFull(
    path.join(config.generatedPath, "handlers"),
    config.apiNext.handlerConfigImportPath,
    config
  );

  config._packages.apiNext.serverClientToLibFull = config.apiNext.libImportPath
    ? buildRelativeFull(
        path.join(config.generatedPath, "server-clients"),
        config.apiNext.libImportPath,
        config
      )
    : "@airent/api-next";
  config._packages.apiNext.serverClientToHandlerConfigFull = buildRelativeFull(
    path.join(config.generatedPath, "server-clients"),
    config.apiNext.handlerConfigImportPath,
    config
  );
  config._packages.apiNext.serverClientToContextFull = buildRelativeFull(
    path.join(config.generatedPath, "server-clients"),
    config.contextImportPath,
    config
  );
  config._packages.apiNext.serverClientToBaseUrlFull = buildRelativeFull(
    path.join(config.generatedPath, "server-clients"),
    config.api.client.baseUrlImportPath,
    config
  );
}

function augmentOne(entity, config, utils) {
  if (!entity.api) {
    return;
  }

  entity._packages.apiNext = {
    routeToHandlerFull: buildRelativePath(
      path.join(
        config.apiNext.appPath,
        config.apiNext.airentApiPath,
        "placeholder"
      ),
      path.join(config.generatedPath, "handlers", entity._strings.moduleName),
      config
    ),
    handlerToDispatcherFull: buildRelativePath(
      path.join(config.generatedPath, "handlers"),
      path.join(config.generatedPath, "dispatchers", entity._strings.moduleName)
    ),

    serverClientToTypeFull: buildRelativePath(
      path.join(config.generatedPath, "server-clients"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    ),
    serverClientToDispatcherFull: buildRelativePath(
      path.join(config.generatedPath, "server-clients"),
      path.join(config.generatedPath, "dispatchers", entity._strings.moduleName)
    ),
    serverClientToRequestFull: entity.api.request?.import
      ? buildRelativeFull(
          path.join(config.generatedPath, "server-clients"),
          entity.api.request.import,
          config
        )
      : undefined,

    edgeClientToTypeFull: buildRelativePath(
      path.join(config.generatedPath, "edge-clients"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    ),
    edgeClientToRequestFull: entity.api.request?.import
      ? buildRelativeFull(
          path.join(config.generatedPath, "edge-clients"),
          entity.api.request.import,
          config
        )
      : undefined,
    edgeClientToClientFull: buildRelativePath(
      path.join(config.generatedPath, "edge-clients"),
      path.join(config.generatedPath, "clients", entity._strings.moduleName)
    ),
  };
}

function augment(data) {
  const { entityMap, config, utils } = data;
  augmentConfig(config);
  Object.values(entityMap).forEach((entity) =>
    augmentOne(entity, config, utils)
  );
}

module.exports = { augment };
