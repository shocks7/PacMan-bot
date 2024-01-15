require('dotenv').config()

const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
const prefix = '!';
let players = {};
const board = Array(9).fill(null);

const {TOKEN, CLIENT_ID, GUILD_ID} = process.env;

let currentPlayer = 'X';

client.on('ready', () => {
    console.log(`Login realizado como ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.content.startsWith(prefix)) {
        const [command, ...args] = message.content.slice(prefix.length).trim().split(' ');

        if (command === 'startgame') {
            if (players[message.author.id]) {
                message.reply('Você já está jogando um jogo.');
                return;
            }
            players[message.author.id] = {symbol: currentPlayer};
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            message.channel.send(`Jogo iniciado! ${message.author.username} é ${players[message.author.id].symbol}'s.`);
            displayBoard(message.channel);
        }

        if (command === 'move') {
            if (!players[message.author.id]) {
                message.reply('Você não está jogando um jogo. Use `!startgame` para iniciar um novo jogo.');
                return;
            }

            const position = parseInt(args[0], 10);
            if (isNaN(position) || position < 1 || position > 9 || board[position - 1] !== null) {
                message.reply('Movimento inválido. Use `!move [1-9]`.');
                return;
            }

            board[position - 1] = players[message.author.id].symbol;
            displayBoard(message.channel);
            if (checkWin(players[message.author.id].symbol)) {
                message.channel.send(`Parabéns! ${message.author.username} ganhou!`);
                resetGame();
            } else if (!board.includes(null)) {
                message.channel.send('Empate! O jogo terminou.');
                resetGame();
            }

            const aiMove = makeAIMove();
            if (aiMove !== null) {
                board[aiMove] = 'O';
                displayBoard(message.channel);
                if (checkWin('O')) {
                    message.channel.send('A máquina ganhou!');
                    resetGame();
                } else if (!board.includes(null)) {
                    message.channel.send('Empate! O jogo terminou.');
                    resetGame();
                }
            }
        }
    }
});

function displayBoard(channel) {
    const formattedBoard = board
        .map((cell, index) => (cell ? `|${cell}|` : `|${index + 1}|`))
        .reduce((acc, cell, index) => (index % 3 === 0 ? [...acc, cell] : [...acc.slice(0, -1), acc[acc.length - 1] + cell]), [])
        .join('\n');

    channel.send('```\n' + formattedBoard + '```');
}

function checkWin(symbol) {
    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winCombinations.some((combination) =>
        combination.every((index) => board[index] === symbol)
    );
}

function resetGame() {
    players = {};
    board.fill(null);
    currentPlayer = 'X';
}

function makeAIMove() {
    const availableMoves = board.reduce((acc, cell, index) => (cell === null ? [...acc, index] : acc), []);

    if (availableMoves.length === 0) {
        return null;
    }

    // Escolhe uma jogada aleatória a partir dos movimentos disponíveis
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

client.login(TOKEN);
