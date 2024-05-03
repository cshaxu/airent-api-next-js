import { executor } from '../../../../cron/my-cron';
import { handleCron } from '../../../../../../src/index';
import { handlerConfig } from '../../../../framework';

export const maxDuration = 60;

export const GET = handleCron({
  ...handlerConfig,
  executor,
  options: {},
});
