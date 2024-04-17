import { Context, Env, Hono } from "hono";
import { env } from "hono/adapter";
import { BlankInput } from "hono/types";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

import { tags } from "../_mock/db.json";

const app = new Hono();

const cache = new Map();

class RedisRateLimiter {
  static instance: Ratelimit;

  static getInstance(c: Context<Env, "/tag/:id", BlankInput>) {
    if (!this.instance) {
      const { REDIS_URL, REDIS_TOKEN } = env<{
        REDIS_URL: string;
        REDIS_TOKEN: string;
      }>(c);

      const redisClient = new Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
      });

      const ratelimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        ephemeralCache: cache,
      });
      this.instance = ratelimit;
    }
    
    return this.instance;
  }
}

app.use(async (c, next) => {
  const ratelimit: Ratelimit = RedisRateLimiter.getInstance(c);
  c.set("ratelimit", ratelimit);
  await next();
});

app.get("/tag/:id", async (c) => {
  const ratelimit: Ratelimit = c.get("ratelimit");
  const ip = c.req.raw.headers.get("cf-connecting-ip");

  const { success } = await ratelimit.limit(ip ?? "anonymous");

  if (!success) {
    return c.json({ error: "Rate limit exceeded" }, 429);
  }

  const tagId = c.req.param("id");
  const tagIndex = Number(tagId);
  const tag = tags[tagIndex] || { error: "Tag not found" };

  return c.json(tag);
});

export default app;
