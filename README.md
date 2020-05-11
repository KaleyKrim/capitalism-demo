# Jellyfish Capitalist

## About

Jellyfish Capitalist is an idle clicker game based on [Adventure Capitalist](https://en.wikipedia.org/wiki/AdVenture_Capitalist). Users are able to:

- ✅ Buy and upgrade businesses
- ✅ Make money
- ✅ Hire managers to automate earnings
- ✅ Collect money automatically earned after returning from closing the game
- ✅ Register a nickname & participate in the Jellyfish Capitalist leaderboard

## Stack

- Back end (./server/): TypeScript, Redis
- Front end (./client/): TypeScript, Vue

## Challenges

- I specialize in backend development, but idle games typically do not involve multiplayer interaction, and are not data/computationally intensive enough to require servers for user data. To justify building a server, I created a leaderboard feature. Users are ranked based on their combined score (the levels of all their businesses, combined). Game data **aside** from nicknames and scores is saved to local storage.

## To do:
(Or, things that I would do differently if I had more time/money).

- Not commit `client/dist/` to Github, and not serve it from `app.ts`, but deploy separately to S3.
- Use a managed service (Elasticache) instead of installing Redis to virtual computer.
- Environment management
- Use NGINX so users don't have to access port 3000 (yikes..)
- Docker for Redis
