import express from "express";
import { User } from "./modules/User";
import { Score } from "./modules/Score";
import { authenticator } from "./middlewares/authenticator";
import * as path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;
const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/users", async(req, res) => {
	const nickname = req.body.nickname.length ? req.body.nickname : "no name";
	
	let userId: string;
	try {
		const userModule = new User();
		userId = await userModule.create(nickname);
	} catch (e) {
		res.send({ error: e })
		return;
	}

	res.send({ userId });
});

app.get("/api/scores", async(_req, res) => {
	const scoreModule = new Score();
	const ranking = await scoreModule.getAll();
	
	const userModule = new User();
	const rankingByNicknames: {name: string; score: number}[] = [];
	for (const userId in ranking) {
		const nickname = await userModule.getNickname(userId);
		if (!nickname) {
			continue;
		}
		rankingByNicknames.push({ name: nickname, score: ranking[userId] });
	}

	res.send({ scores: rankingByNicknames });
});

app.post("/api/scores", authenticator, async(req, res) => {
	const userId = <string>req.body.userId;
	const score = req.body.score;

	const userModule = new User();
	const userExists = await userModule.exists(userId);
	if (!userExists) {
		res.send({ error: "user with that user id doesn't exist"});
		return;
	}

	const scoreModule = new Score();
	const rank = await scoreModule.set(userId, score);
	res.send({ rank });
});

app.use("/", express.static(path.join(__dirname, "..", "..", "client", "dist")));

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});