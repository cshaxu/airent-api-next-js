// airent imports
import { wrappableHandle } from '@airent/api';

// config imports
import { handlerConfig } from '../../../../framework.js';

// function imports
import { parser, validator, executor } from '../../../../webhooks/my-webhook.js';

export const POST = wrappableHandle({ 
  ...handlerConfig,
  parser,
  validator,
  executor,
});
