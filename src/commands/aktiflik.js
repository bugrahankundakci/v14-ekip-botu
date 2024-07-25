const { EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aktiflik')
        .setDescription('Aktiflik testi yapmanız için size bir menü gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.reply({ content: 'Gönderdim menüyü.', ephemeral: true });

        const minikinembedi = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setDescription('Aktiflik testi başladı!\nAktiflik testini geçmek için aşşağıdaki butona basmanız gerekmekte.');

        const minikinbutonu = new ButtonBuilder()
            .setLabel('Aktifim!')
            .setCustomId('aktiflik_buton')
            .setStyle(ButtonStyle.Primary);

        const minikinrowlari = new ActionRowBuilder()
            .addComponents(minikinbutonu);


        await interaction.channel.send({ content: '||@everyone|| & ||@here||', embeds: [minikinembedi], components: [minikinrowlari] });


        setTimeout(async () => {
            const guild = interaction.guild;
            const roleToCheckId = minik.rol.kayıtlı;
            const roleToAssignId = minik.rol.inaktif;

            const roleToCheck = guild.roles.cache.get(roleToCheckId);
            const roleToAssign = guild.roles.cache.get(roleToAssignId);

            if (!roleToCheck || !roleToAssign) return;
            const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(roleToCheckId));
            if (membersWithRole.size > 0) {
                membersWithRole.forEach(member => {
                    member.roles.add(roleToAssignId).catch(console.error);
                });
            }
        }, 24 * 60 * 60 * 1000);
    } 
};
