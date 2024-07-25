const { Partials, Client, GatewayIntentBits } = require("discord.js");
const express = require('express');
const cors = require('cors');
const path = require('path');
const { JsonDatabase } = require('for.db');
const minik = require("./minik.json");
const db = new JsonDatabase({
    databasePath: "./src/database/farmdb.json"
});

const app = express();
const port = 3000;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});
client.login(minik.botSettings.token);
app.use(express.json());
app.use(cors());


app.get('/api/leaderboard', (req, res) => {
    const allData = db.get('farm') || {};

    const userTotals = [];

    for (const [userId, userData] of Object.entries(allData)) {
        userTotals.push({
            userId,
            ot: userData.ot,
            kokain: userData.kokain,
            meth: userData.meth,
            karapara: userData.karapara,
            eklemeTarihi: userData.eklemeTarihi
        });
    }

    res.json(userTotals);
});


app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/leaderboard.html'));
});

app.get('/anasayfa', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/anasayfa.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});