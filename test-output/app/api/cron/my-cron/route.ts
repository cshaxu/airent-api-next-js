// airent imports
import { dispatchWith } from '@airent/api';
import { handleWith } from '../../../../../src/index.js';

// config imports
import { Context } from '../../../../../test-sources/context.js';
import { dispatcherConfig } from '../../../../../test-sources/framework.js';
import { handlerConfig } from '../../../../../test-sources/framework.js';

// function imports
import { executor } from '../../../../../test-sources/cron/my-cron.js';

export const dynamic = 'force-dynamic';

export const maxDuration = 60;

const dispatcher = dispatchWith({
  ...dispatcherConfig,
  parser: () => Promise.resolve({}),
  executor: (_parsed: {}, context: Context) => executor(context),
  options: {},
});

export const GET = handleWith(dispatcher, handlerConfig);
