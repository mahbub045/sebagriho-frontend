export interface ApiValidationError {
  data?: Record<string, string[] | string> & {
    detail?: string;
    message?: string;
  };
}
