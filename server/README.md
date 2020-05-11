# Jelly Capitalist Server

## Requirements
- Redis installed locally (TODO: dockerfile)

## Commands

Compile TypeScript to js:
```
npm run build
```

Compile TypeScript & start the server:
```
npm run start
```

## Routes

#### POST `/api/users`
- register a new nickname, generates userId, and returns userId to client

#### GET `/api/scores`
- returns ranking (`{ name: string; score: number }[]`)

#### POST `/api/scores`
- posts a new score to the ranking
