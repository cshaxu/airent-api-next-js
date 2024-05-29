// airent imports
import { wrappableHandle } from '@airent/api';

// config imports
import { handlerConfig } from '../../../../framework.js';

// function imports
import { parser, executor } from '../../../../debug/my-debug.js';

export const POST = wrappableHandle({
  ...handlerConfig,
  parser,
  executor,
});
