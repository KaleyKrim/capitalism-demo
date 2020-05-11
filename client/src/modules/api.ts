import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import * as localStorage from "./localStorage";

function getConfig(): AxiosRequestConfig {
	const savedUserId = localStorage.getJfcUserId();
	const config = {
		baseURL: process.env.VUE_APP_BASE_URL,
		headers: {}
	}

	if (savedUserId) {
		config.headers["userId"] = savedUserId;
	}

	return config;
}

export class Api {
	private requester: AxiosInstance;
	constructor() {
		this.requester = axios.create(getConfig());
	}

	async registerUser(nickname: string): Promise<string> {
		const res = await this.requester.post("/users", { nickname });
		return res.data.userId;
	}

	async getNickname(): Promise<string> {
		const res = await this.requester.get("/nickname");
		return res.data.nickname;
	}

	async getScores(): Promise<{ name: string; score: number }[]> {
		const res = await this.requester.get("/scores");
		return res.data.scores;
	}

	async postScore(score: number): Promise<number> {
		const res = await this.requester.post("/scores", { score });
		return res.data.rank;
	}
}