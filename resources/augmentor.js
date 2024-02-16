function augmentOne(entity, config, utils) {
  if (!entity.api) {
    return;
  }

  const kababSingularEntityName = utils.toKababCase(entity.name);
  const kababPluralEntityName = utils.toKababCase(utils.pluralize(entity.name));
  const serverApiOutputs = {
    "node_modules/@airent/api-next/resources/server-get-many-template.ts.ejs": `${config.nextApiSourcePath}/get-many-${kababPluralEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-get-one-template.ts.ejs": `${config.nextApiSourcePath}/get-one-${kababSingularEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-create-one-template.ts.ejs": `${config.nextApiSourcePath}/create-one-${kababSingularEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-delete-one-template.ts.ejs": `${config.nextApiSourcePath}/delete-one-${kababSingularEntityName}/route.ts`,
    "node_modules/@airent/api-next/resources/server-update-one-template.ts.ejs": `${config.nextApiSourcePath}/update-one-${kababSingularEntityName}/route.ts`,
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
