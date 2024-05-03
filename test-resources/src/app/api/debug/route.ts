import { Awaitable } from '@airent/api';
import { handleDebug, CommonResponse } from '../../../../../src/index';
import { Context } from '../../../context';
import { handlerConfig } from '../../../framework';
import * as z from 'zod';

import { Params as MyDebugParams, executor as myDebug } from '../../../debug/my-debug';

const map = new Map<string, [z.ZodTypeAny, (params: any, context: Context) => Awaitable<CommonResponse>]>([
  ['my-debug', [MyDebugParams, myDebug]],
]);

export const POST = handleDebug({
  ...handlerConfig,
  map,
});
