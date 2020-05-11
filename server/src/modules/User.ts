import { Base } from "./Base";
import { v4 as uuidv4 } from 'uuid';

export class User extends Base {
	private key = "users";
	constructor(){
		super();
	}

	private generateUuid(): string {
		return uuidv4();
	}

	async create(nickname: string): Promise<string> {
		const userId = this.generateUuid();
		await this.redis.hset(this.key, userId, nickname);
		return userId;
	}

	async getNickname(userId: string): Promise<string | null> {
		return this.redis.hget(this.key, userId);
	}

	async getMultipleNicknames(userIds: string[]): Promise<string[]> {
		return (await this.redis.mget(this.key, ...userIds)).map(id => id.toString());
	}

	async exists(userId: string): Promise<boolean> {
		const nickname = this.redis.hget(this.key, userId);
		if (!nickname) {
			return false;
		}
		
		return true;
	}
}