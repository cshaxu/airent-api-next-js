function augmentOne(entity, config, utils) {
  if (!entity.api) {
    return;
  }

  const kababSingularEntityName = utils.toKababCase(entity.name);
  const kababPluralEntityName = utils.toKababCase(utils.pluralize(entity.name));
  const serverApiOutputPath = `${config.nextApiSourcePath}/${config.apiPath}`;
  const serverApiOutputs = {
    "node_modules/airent-api-next/resources/server-get-many-template.ts.ejs": `${serverApiOutputPath}/get-many-${kababPluralEntityName}/route.ts`,
    "node_modules/airent-api-next/resources/server-get-one-template.ts.ejs": `${serverApiOutputPath}/get-one-${kababSingularEntityName}/route.ts`,
    "node_modules/airent-api-next/resources/server-create-one-template.ts.ejs": `${serverApiOutputPath}/create-one-${kababSingularEntityName}/route.ts`,
    "node_modules/airent-api-next/resources/server-delete-one-template.ts.ejs": `${serverApiOutputPath}/delete-one-${kababSingularEntityName}/route.ts`,
    "node_modules/airent-api-next/resources/server-update-one-template.ts.ejs": `${serverApiOutputPath}/update-one-${kababSingularEntityName}/route.ts`,
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
