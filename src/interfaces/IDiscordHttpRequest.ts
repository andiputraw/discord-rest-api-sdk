import type { Result, Ok, Err } from "ts-results-es";
import type { DiscordErrorResponse } from "../types";
export interface IDiscordHttpRequest {
  fetch<T = unknown>(
    path: string,
    method: "POST" | "GET" | "DELETE" | "PATCH",
    body: unknown
  ): Promise<Result<T, DiscordErrorResponse>>;
}
