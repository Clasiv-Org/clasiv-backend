import { Redis } from "@upstash/redis";

const REDIS_REST_URL =		process.env.REDIS_REST_URL as string;
const REDIS_REST_TOKEN =	process.env.REDIS_REST_TOKEN as string;

if (!REDIS_REST_URL)		throw new Error("Missing required env var: REDIS_REST_URL");
if (!REDIS_REST_TOKEN)		throw new Error("Missing required env var: REDIS_REST_TOKEN");

const redis = new Redis({
    url: REDIS_REST_URL,
    token: REDIS_REST_TOKEN,
});

export default redis;
