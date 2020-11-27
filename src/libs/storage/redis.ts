import Redis from "ioredis";
import { REDIS } from "../../config";

const redis = new Redis({ port: Number(REDIS.PORT), host: REDIS.URL });

export default redis;
