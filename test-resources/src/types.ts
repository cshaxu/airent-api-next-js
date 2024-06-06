export type CommonResponse<DATA = unknown, ERROR = unknown> = {
  success: boolean;
  data?: DATA;
  error?: ERROR;
};
