import { Base } from "./Base";

export class Score extends Base {
	private key = "rankings";
	constructor(){
		super();
	}

	async set(userId: string, score: number): Promise<number> {
		return this.redis.zadd(this.key, { [userId]: score });
	}

	async getAll(): Promise<{[userId: string]: number}>{
		const scores = await this.redis.zrevrange(this.key, 0, -1, "WITHSCORES");
		const scoresAsNumbers: {[userId: string]: number} = {};
		for (const key in scores) {
			scoresAsNumbers[key] = Number(scores[key])
		}
		return scoresAsNumbers;
	}
}