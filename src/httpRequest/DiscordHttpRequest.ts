import type {
  ClientConfiguration,
  IClient,
  RequiredClientConfiguration,
} from "../interfaces";
import { Result, Ok, Err } from "ts-results-es";
import type { DiscordErrorResponse } from "../types";
import { delay } from "../util";

export class DiscordHttpRequest {
  constructor(
    private token: string,
    private config: RequiredClientConfiguration
  ) {}

  log(...args: any[]) {
    if (this.config.log) this.config.log(...args);
  }

  async fetch<T = unknown>(
    path: string,
    method: "POST" | "GET" | "DELETE" | "PATCH" | "PUT",
    body?: unknown
  ): Promise<Result<T, DiscordErrorResponse>> {
    const url = "https://discord.com/api/v10/" + path;
    const headers = {
      Authorization: `Bot ${this.token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": `${this.config.bot_metadata.bot_name} (${this.config.bot_metadata.bot_url}, ${this.config.bot_metadata.bot_version})`,
    };

    this.log(`[REQUEST] ${method} ${url}`, body);
    let retries = 0;
    do {
      const res = await this.config.httpClient(url, {
        headers,
        body: JSON.stringify(body),
        method,
      });
      const text = await res.text();
      const success = text === "" && res.status === 204;
      if (success) return Ok(null as T);
      if (res.status >= 200 && res.status < 300) {
        this.log(`[${res.status}]`, res.url, text);
        return Ok(JSON.parse(text) as T);
      }
      if (res.status !== 429 && res.status >= 400) {
        this.log(`[${res.status}]`, res.url, text);
        return Err(JSON.parse(text) as DiscordErrorResponse);
      }
      await delay(
        Number.parseInt(res.headers.get("x-ratelimit-reset-after") || "5")
      );
      retries++;
    } while (retries <= 30);
    this.log("Retry amount is reached.");
    return Err({
      message: "Retry amount is reached.",
      code: -1,
    });
  }
}
