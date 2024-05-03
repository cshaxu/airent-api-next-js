import { handleWebhook } from '../../../../../../src/index';
import { parser, validator, executor } from '../../../../webhooks/my-webhook';
import { handlerConfig } from '../../../../framework';

export const POST = handleWebhook({ 
  ...handlerConfig,
  parser,
  validator,
  executor,
});
