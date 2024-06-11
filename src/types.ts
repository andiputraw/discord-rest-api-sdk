import type { Result } from "ts-results-es";

export type DiscordErrorResponse = {
  message: string;
  code: number;
};

export type APIResult<T> = Result<T, DiscordErrorResponse>;
