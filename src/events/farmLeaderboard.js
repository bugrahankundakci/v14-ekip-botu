const { Events, EmbedBuilder } = require("discord.js");
const { JsonDatabase } = require('for.db');
const minik = require('../../minik.json');
const db = new JsonDatabase({
    databasePath: "./src/database/farmdb.json"
});

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log('Bot is online!');


        const channelId = minik.leaderboard.farm;

        async function updateEmbeds() {
            const allData = db.get('farm') || {};

            let totalOt = 0;
            let totalKokain = 0;
            let totalMeth = 0;
            let totalKarapara = 0;

            const userTotals = [];

            for (const [userId, userData] of Object.entries(allData)) {
                totalOt += userData.ot;
                totalKokain += userData.kokain;
                totalMeth += userData.meth;
                totalKarapara += userData.karapara;

                userTotals.push({
                    userId,
                    ot: userData.ot,
                    kokain: userData.kokain,
                    meth: userData.meth,
                    karapara: userData.karapara
                });
            }

            const topUsersByFarm = userTotals.sort((a, b) => {
                const totalA = a.ot + a.kokain + a.meth + a.karapara;
                const totalB = b.ot + b.kokain + b.meth + b.karapara;
                return totalB - totalA;
            }).slice(0, 5);

            const recentEntries = Object.entries(allData)
                .sort((a, b) => new Date(b[1].eklemeTarihi) - new Date(a[1].eklemeTarihi))
                .slice(0, 5);

            const totalEmbed = new EmbedBuilder()
                .setTitle('Toplam Farm Miktarları')
                .setColor(0x00AE86)
                .setDescription(`**Toplam** \n OT: ${totalOt.toString()} \n Kokain: ${totalKokain.toString()} \n Meth: ${totalMeth.toString()} \n Karapara: ${totalKarapara.toString()}`);

            const topFarmersEmbed = new EmbedBuilder()
                .setTitle('En Çok Farm Yapan Kullanıcılar')
                .setColor(0xFFD700)
                .setDescription(topUsersByFarm.map((user, index) => 
                    `${index + 1}. Kullanıcı: <@${user.userId}>\nOT: ${user.ot}\nKokain: ${user.kokain}\nMeth: ${user.meth}\nKarapara: ${user.karapara}`
                ).join('\n\n'));

            const recentEntriesEmbed = new EmbedBuilder()
                .setTitle('En Son Eklenen 5 Kayıt')
                .setColor(0x00FF00)
                .setDescription(recentEntries.map(([userId, userData], index) => 
                    `${index + 1}. Kullanıcı: <@${userId}>\nOT: ${userData.ot}\nKokain: ${userData.kokain}\nMeth: ${userData.meth}\nKarapara: ${userData.karapara}\nEkleme Tarihi: ${new Date(userData.eklemeTarihi).toLocaleString()}`
                ).join('\n\n'));

            try {
                const channel = await client.channels.fetch(channelId);
                const messages = await channel.messages.fetch({ limit: 3 });
                const messageArray = Array.from(messages.values());

                if (messageArray.length === 3) {
                    await messageArray[0].edit({ embeds: [totalEmbed] });
                    await messageArray[1].edit({ embeds: [topFarmersEmbed] });
                    await messageArray[2].edit({ embeds: [recentEntriesEmbed] });
                } else {
                    await channel.send({ embeds: [totalEmbed] });
                    await channel.send({ embeds: [topFarmersEmbed] });
                    await channel.send({ embeds: [recentEntriesEmbed] });
                }
            } catch (error) {
                console.error(error);
            }
        }

        updateEmbeds();

        setInterval(updateEmbeds, 900000);
    },
};
