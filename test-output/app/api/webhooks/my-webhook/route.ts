// airent imports
import { dispatchWith } from '@airent/api';
import { handleWith } from '../../../../../src/index.js';

// config imports
import { dispatcherConfig } from '../../../../../test-sources/framework.js';
import { handlerConfig } from '../../../../../test-sources/framework.js';

// function imports
import { parser, authorizer, executor } from '../../../../../test-sources/webhooks/my-webhook.js';

const dispatcher = dispatchWith({
  ...dispatcherConfig,
  authorizer,
  parser,
  executor,
});

export const POST = handleWith(dispatcher, handlerConfig);
