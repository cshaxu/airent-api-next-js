const path = require("path");
const utils = require("airent/resources/utils.js");

function joinRelativePath(...elements) {
  return `./${path.join(...elements).replaceAll("\\", "/")}`;
}

function buildRelativePackage(sourcePath, targetPath, config) /* string */ {
  return targetPath.startsWith(".")
    ? `${path
        .relative(sourcePath, targetPath)
        .replaceAll("\\", "/")}${utils.getModuleSuffix(config)}`
    : targetPath;
}

function augmentOne(entity, config, utils) {
  if (!entity.api) {
    return;
  }

  entity.api.strings.airentApiHandlerPackage = buildRelativePackage(
    joinRelativePath(
      config.apiNext.appPath,
      config.apiNext.airentApiPath,
      "placeholder"
    ),
    joinRelativePath(
      config.entityPath,
      "generated",
      `${utils.toKababCase(entity.name)}-handlers`
    ),
    config
  );

  const kababSingularEntityName = utils.toKababCase(entity.name);
  const kababPluralEntityName = utils.toKababCase(utils.pluralize(entity.name));
  const airentApiOutputPath = path
    .join(config.apiNext.appPath, config.apiNext.airentApiPath)
    .replaceAll("\\", "/");
  const serverApiOutputs = {
    "node_modules/@airent/api-next/resources/server-get-many-template.ts.ejs": `${airentApiOutputPath}/get-many-${kababPluralEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-get-one-template.ts.ejs": `${airentApiOutputPath}/get-one-${kababSingularEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-get-one-safe-template.ts.ejs": `${airentApiOutputPath}/get-one-${kababSingularEntityName}-safe/route.ts`,
    "node_modules/@airent/api-next/resources/server-create-one-template.ts.ejs": `${airentApiOutputPath}/create-one-${kababSingularEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-delete-one-template.ts.ejs": `${airentApiOutputPath}/delete-one-${kababSingularEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-update-one-template.ts.ejs": `${airentApiOutputPath}/update-one-${kababSingularEntityName}/route.ts`,
  };

  entity.outputs = { ...entity.outputs, ...serverApiOutputs };
}

function augment(data) {
  const { entityMap, config, utils } = data;
  Object.values(entityMap).forEach((entity) =>
    augmentOne(entity, config, utils)
  );
}

module.exports = { augment };
