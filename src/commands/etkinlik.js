const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Collection, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('etkinlik')
        .setDescription('Yeni bir etkinlik başlatır.')
        .addStringOption(option =>
            option.setName('etkinlik')
                .setDescription('mesaj olarak ne gönderilicek?')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('kazanan_sayısı')
                .setDescription('etkinliğe min kaç kişi katılacak?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mesaj')
            .setDescription('yazılıcak olan mesajı gir.')
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('süre')
                .setDescription('Çekilişin süresi (saniye olarak)')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.roles.cache.has(minik.rol.yonetici)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', ephemeral: true });
        }
        const ödül = interaction.options.getString('etkinlik');
        const kazananSayısı = interaction.options.getInteger('kazanan_sayısı');
        const süre = interaction.options.getInteger('süre');
        const guildOwner = await interaction.guild.fetchOwner();
        const mesaj = interaction.options.getString('mesaj');
        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'minik');

        let participants = new Collection();

        const embed = new EmbedBuilder()
            .setTitle('Yeni Etkinlik!')
            .setDescription(`Etkinlik: **${ödül}**\n Süre: **${süre} saniye** \n Katılmak için aşağıdaki butona tıklayın!`)
            .setColor('#00FF00')
            .setTimestamp(Date.now() + süre * 1000)
            .setFooter({ text: 'Etkinlik sona eriyor' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('çekiliş_katıl')
                    .setLabel('Katıl')
                    .setStyle(ButtonStyle.Primary)
            );

        const giveawayMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = (buttonInteraction) => buttonInteraction.customId === 'çekiliş_katıl';
        const collector = giveawayMessage.createMessageComponentCollector({ filter, time: süre * 1000 });

        collector.on('collect', async (buttonInteraction) => {
            if (participants.has(buttonInteraction.user.id)) {
                return buttonInteraction.reply({ content: 'Zaten Etkinliğe katıldınız!', ephemeral: true });
            }
            participants.set(buttonInteraction.user.id, buttonInteraction.user);
            embed.addFields(
                {  name: '\u200B', value: `<@${buttonInteraction.user.id}> - (${buttonInteraction.user.id})`, inline: false }
             );
            await giveawayMessage.edit({ embeds: [embed] });
            await buttonInteraction.reply({ content: 'Etkinliğe katıldınız!', ephemeral: true });
        });

        collector.on('end', async () => {
            if (participants.size < kazananSayısı) {
                await interaction.editReply({ content: 'Yeterli katılımcı yok, çekiliş iptal edildi.', embeds: [], components: [] });
                const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'minik');
                if (logChannel) {
                    logChannel.send(`Çekiliş iptal edildi. Yeterli katılımcı yok.\nÖdül: **${ödül}**\nBaşlatan: ${interaction.user.tag}`);
                }
                return;
            }
            const winners = [];
            for (let i = 0; i < kazananSayısı; i++) {
                const winnerIndex = Math.floor(Math.random() * participants.size);
                const winner = Array.from(participants.values())[winnerIndex];
                winners.push(winner);
                participants.delete(winner.id);
            }
            const winnerTags = winners.map(winner => `<@${winner.id}>`).join(', ');
            const winnerDetails = winners.map(winner => `İsim: ${winner.tag}, ID: ${winner.id}`).join('\n');

            const resultEmbed = new EmbedBuilder()
                .setTitle('Etkinlik Duyurusu Sona Erdi!')
                .setDescription(`Etkinlik: **${ödül}**\n Etkinlik birincisi: **${winnerTags}**`)
                .setColor('#FFD700');

            await interaction.editReply({ content: 'Etkinlik sona erdi!', embeds: [resultEmbed], components: [] });

            for (const participant of participants.values()) {
                try {
                    await participant.send(`${mesaj}.`);
                } catch (error) {
                    console.error(`DM gönderilemedi ${participant.tag}`);
                }
            }

            for (const winner of winners) {
                try {
                    await winner.send(`${mesaj}.`);
                } catch (error) {
                    console.error(`DM gönderilemedi ${winner.tag}`);
                }
            }

            const ownerMessage = `Etkinlik sonucu :\n\nEtkinlik: ${ödül}\n Birincisi:\n${winnerDetails} \n Gönderilen mesaj: ${mesaj}`;
            try {
                await guildOwner.send(ownerMessage);
            } catch (error) {
                console.error('Sunucu kurucusuna mesaj gönderilemedi.');
            }

            const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'minik');
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('Etkinlik Log')
                    .setDescription(`Etkinlik sona erdi! \n\n Etkinlik: ${ödül}\nKazanan Sayısı: ${kazananSayısı}\n Toplam Katılım: ${participants.size}\n Başlatan: ${interaction.user.tag}\nKazananlar: ${winnerTags}\n Gönderilen mesaj: ${mesaj}`)
                    .setColor('#FFA500')
                    .setTimestamp();

                interaction.chennel.send({ embeds: [logEmbed] });
            }
        });
    }
};
