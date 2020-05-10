import express from "express";
import { User } from "./modules/User";
// import { Score } from "./modules/Score";
import { authenticator } from "./middlewares/authenticator";
import * as path from "path";

const app: express.Application = express();

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

app.get("/api/scores", async(_req, _res) => {
	// get player rankings
});

// use authenticator after post /users, so middleware isn't applied to those routes
// app.use(authenticator);

app.post("/api/scores", authenticator, async(_req, res) => {
	// const userId = <string>req.body.userId;
	

	// save user_id: level
	// this occurs every time the user levels up
	res.send("Hello....");
});

app.use("/", express.static(path.join(__dirname, "..", "..", "client", "dist")));

app.listen(3000, () => {
	console.log("listening on port");
});