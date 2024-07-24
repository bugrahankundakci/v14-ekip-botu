const { EmbedBuilder, Events } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member, client) {
    try {
        {
            const minikingelengideni = client.channels.cache.find(channel => channel.name === 'invite_log');
            const minikingelengidenembedi = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(`Sunucudan Üye Çıktı!`)
            .setDescription(`Kişi: \n > ${member.user.username} \n > <@${member.user.id}> - (${member.user.id}) `)
            .setThumbnail(member.guild.iconURL({ dynamic: true }))
            .setTimestamp();
            if (minikingelengideni) {
                minikingelengideni.send({ embeds: [minikingelengidenembedi] });
            }
            else {
                console.log('Yarragım guildMemberRemove\'da sıkıntı var');
            }
         }
    } catch (error) {
        catchError(error,'guildMemberRemove', client);
    }
    },
};
