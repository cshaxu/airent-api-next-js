import { wrappableHandle } from '@airent/api';

import { Context } from '../../../../context.js';
import { handlerConfig } from '../../../../framework.js';

import { executor } from '../../../../cron/my-cron.js';

export const maxDuration = 60;

export const GET = wrappableHandle({
  ...handlerConfig,
  parser: () => Promise.resolve({}),
  executor: (_parsed: {}, context: Context) => executor(context),
  options: {},
});
