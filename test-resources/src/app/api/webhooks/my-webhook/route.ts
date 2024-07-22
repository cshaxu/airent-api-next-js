// airent imports
import { handle } from '@airent/api';

// config imports
import { handlerConfig } from '../../../../framework.js';

// function imports
import { parser, validator, executor } from '../../../../webhooks/my-webhook.js';

export const POST = handle({ 
  ...handlerConfig,
  parser,
  validator,
  executor,
});
