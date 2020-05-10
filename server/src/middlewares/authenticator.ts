import express from "express";
import { User } from "../modules/User";

export async function authenticator(req: express.Request, res: express.Response, next: express.NextFunction) {
	const userId = <string>req.headers.userid;
	if (!userId || !userId.length) {
		res.send({ error: "no userId header" });
		return;
	}

	const userModule = new User();
	if (!await userModule.exists(userId)) { 
		res.send({ error: "userId doesn't exist" });
		return;
	}

	req.body.userId = userId;
	next();
}