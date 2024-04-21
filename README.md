# PacMan-bot

This is a simple game bot for Discord. The bot allows users to play Tic-Tac-Toe against each other or against an AI opponent.

## Features

- Start a new game with `!startgame` command.
- Make moves using the `!move [1-9]` command.
- Play against a friend or against the bot.
- The bot uses a basic AI to make moves.

## Setup

1. Install Node.js if you haven't already.
2. Clone this repository to your local machine.
3. Install dependencies using npm:
```bash
npm install
```
4. Create a `.env` file in the root directory of the project and add your Discord bot token, client ID, and guild ID:
```bash
   TOKEN=your_discord_bot_token
   CLIENT_ID=your_client_id
   GUILD_ID=your_guild_id
```
5. Run the bot using:
```bash
node index.js
```

## Usage

- Use `!startgame` to start a new game.
- Use `!move [1-9]` to make a move.
- The bot will respond with the updated board after each move.
- The game ends when a player wins or the board is full.
