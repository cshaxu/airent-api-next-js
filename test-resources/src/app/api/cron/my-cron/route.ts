import { handleCron } from '../../../../../../src/index.js';

import { handlerConfig } from '../../../../framework.js';

import { executor } from '../../../../cron/my-cron.js';

export const maxDuration = 60;

export const GET = handleCron({
  ...handlerConfig,
  executor,
  options: {},
});
