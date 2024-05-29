// airent imports
import { wrappableHandle } from '@airent/api';

// config imports
import { Context } from '../../../../context.js';
import { handlerConfig } from '../../../../framework.js';

// function imports
import { executor } from '../../../../cron/my-cron.js';

export const maxDuration = 60;

export const GET = wrappableHandle({
  ...handlerConfig,
  parser: () => Promise.resolve({}),
  executor: (_parsed: {}, context: Context) => executor(context),
  options: {},
});
