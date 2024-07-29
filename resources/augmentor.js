const path = require("path");
const utils = require("airent/resources/utils.js");

function enforceRelativePath(relativePath) /* string */ {
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

function joinRelativePath(...elements) /* string */ {
  return enforceRelativePath(path.join(...elements).replaceAll("\\", "/"));
}

function buildRelativePackage(sourcePath, targetPath, config) /* string */ {
  if (!targetPath.startsWith(".")) {
    return targetPath;
  }
  const suffix = utils.getModuleSuffix(config);
  const relativePath = enforceRelativePath(
    path.relative(sourcePath, targetPath).replaceAll("\\", "/")
  );
  return `${relativePath}${suffix}`;
}

function augmentConfig(config) {
  config.apiNext.baseLibPackage = config.apiNext.libImportPath
    ? buildRelativePackage(
        path.join(config.entityPath, "generated"),
        config.apiNext.libImportPath,
        config
      )
    : "@airent/api-next";
  config.apiNext.serverClientLibPackage = config.apiNext.libImportPath
    ? buildRelativePackage(
        joinRelativePath(config.apiNext.serverClientPath),
        config.apiNext.libImportPath,
        config
      )
    : "@airent/api-next";
  config.apiNext.handlerConfigPackage = buildRelativePackage(
    joinRelativePath(config.entityPath, "generated"),
    config.apiNext.handlerConfigImportPath,
    config
  );
  config.apiNext.serverClientHandlerConfigPackage = buildRelativePackage(
    joinRelativePath(config.apiNext.serverClientPath),
    config.apiNext.handlerConfigImportPath,
    config
  );
  config.apiNext.serverClientContextPackage = buildRelativePackage(
    joinRelativePath(config.apiNext.serverClientPath),
    config.contextImportPath,
    config
  );
}

function augmentOne(entity, config, utils) {
  if (!entity.api) {
    return;
  }

  entity.apiNext = {
    packages: {
      serverClientType: buildRelativePackage(
        joinRelativePath(config.apiNext.serverClientPath),
        joinRelativePath(
          config.entityPath,
          "generated",
          `${utils.toKababCase(entity.name)}-type`
        ),
        config
      ),
      serverClientDispatcher: buildRelativePackage(
        joinRelativePath(config.apiNext.serverClientPath),
        joinRelativePath(
          config.entityPath,
          "generated",
          `${utils.toKababCase(entity.name)}-dispatcher`
        ),
        config
      ),
      serverClientRequest: entity.api.request?.import
        ? buildRelativePackage(
            joinRelativePath(config.apiNext.serverClientPath),
            entity.api.request.import,
            config
          )
        : undefined,
      serverClientClientClient: buildRelativePackage(
        joinRelativePath(config.apiNext.serverClientPath),
        joinRelativePath(
          config.api.client.clientPath,
          utils.toKababCase(entity.name)
        ),
        config
      ),
      routeHandler: buildRelativePackage(
        joinRelativePath(
          config.apiNext.appPath,
          config.apiNext.airentApiPath,
          "placeholder"
        ),
        joinRelativePath(
          config.entityPath,
          "generated",
          `${utils.toKababCase(entity.name)}-handler`
        ),
        config
      ),
    },
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
