function augmentOne(entity, config, utils) {
  if (!entity.api) {
    return;
  }

  const kababPluralEntityName = utils.toKababCase(utils.pluralize(entity.name));
  const serverApiOutputPath = `src/app${config.apiPath}/${kababPluralEntityName}`;
  const serverApiOutputs = {
    "node_modules/airent-api-next/resources/server-create-one-template.ts.ejs": `${serverApiOutputPath}/create-one/route.ts`,
    "node_modules/airent-api-next/resources/server-delete-one-template.ts.ejs": `${serverApiOutputPath}/delete-one/route.ts`,
    "node_modules/airent-api-next/resources/server-get-many-template.ts.ejs": `${serverApiOutputPath}/get-many/route.ts`,
    "node_modules/airent-api-next/resources/server-get-one-template.ts.ejs": `${serverApiOutputPath}/get-one/route.ts`,
    "node_modules/airent-api-next/resources/server-update-one-template.ts.ejs": `${serverApiOutputPath}/update-one/route.ts`,
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
