import express from "express";
import { User } from "./modules/User";
import { Score } from "./modules/Score";
import { authenticator } from "./middlewares/authenticator";
import * as path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/users", async(req, res) => {
	const userModule = new User();
	const nickname = req.body.nickname.length ? req.body.nickname : "anon";
	
	let userId: string;
	try {
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
	res.send({ ranking });
});

app.post("/api/scores", authenticator, async(req, res) => {
	const userId = <string>req.body.userId;
	const score = req.body.score;

	const scoreModule = new Score();
	const rank = await scoreModule.set(userId, score);

	res.send({ rank });
});

app.use("/", express.static(path.join(__dirname, "..", "..", "client", "dist")));

app.listen(3000, () => {
	console.log("listening on port");
});