import { Tedis } from "tedis";

export class Base {
	protected redis: Tedis;
	constructor(redisClient?: Tedis) {
		this.redis = redisClient || new Tedis({
			host: process.env.REDIS_HOST || "127.0.0.1",
			port: Number(process.env.REDIS_PORT) || 6379,
		});
	}

}