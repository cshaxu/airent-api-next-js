import { wrappableHandle } from '@airent/api';

import { handlerConfig } from '../../../../framework.js';

import { parser, executor } from '../../../../debug/my-debug.js';

export const POST = wrappableHandle({
  ...handlerConfig,
  parser,
  executor,
});
