import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if(!REDIS_URL) throw new Error("REDIS_URL is not defined");

const connection = new Redis(process.env.REDIS_URL!, {
	maxRetriesPerRequest: null, 
});

export default connection;
