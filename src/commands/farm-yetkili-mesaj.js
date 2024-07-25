const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('farm-yetkili-mesaj')
        .setDescription('Kullanıcıların farm girmesi için menü gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const militanembed = new EmbedBuilder()
            .setTitle('Farm Menüsü')
            .setColor('ff0400')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setImage(minik.mesai.ekip.photograph)
            .setDescription(minik.farm.yetkilimenuayarlari.mesaj);

        const militaninmenusu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('farm-olustur')
                    .setPlaceholder(minik.farm.menuayarlari.menuplaceholder)
                    .addOptions([

                        {
                            label: minik.farm.yetkilimenuayarlari.birseceneklabel,
                            emoji: minik.farm.yetkilimenuayarlari.birsecenekemoji,
                            description: minik.farm.yetkilimenuayarlari.birsecenekaciklama,
                            value: 'forceekle',
                        },
                        {
                            label: minik.farm.yetkilimenuayarlari.ikiseceneklabel,
                            emoji: minik.farm.yetkilimenuayarlari.ikisecenekemoji,
                            description: minik.farm.yetkilimenuayarlari.ikisecenekaciklama,
                            value: 'forcecheck',
                        },
                        {
                            label: minik.farm.yetkilimenuayarlari.ucseceneklabel,
                            emoji: minik.farm.yetkilimenuayarlari.ucsecenekemoji,
                            description: minik.farm.yetkilimenuayarlari.ucsecenekaciklama,
                            value: 'forcefarmsil',
                        },
                        {
                            label: minik.farm.yetkilimenuayarlari.dortseceneklabel,
                            emoji: minik.farm.yetkilimenuayarlari.dortsecenekemoji,
                            description: minik.farm.yetkilimenuayarlari.dortsecenekaciklama,
                            value: 'database-check',
                        },
                        {
                            label: 'Seçenek Sıfırla',
                            description: 'Menüdeki seçeneğinizi sıfırlarsınız.',
                            emoji: '1264482771049386014',
                            value: 'sifirla',
                        },

                    ])
            );
        await interaction.reply({ content: 'Mesai menüsü gönderiliyor...', ephemeral: true });

        await interaction.channel.send({
            content: `||@everyone|| & ||@here||`,
            embeds: [militanembed],
            components: [militaninmenusu]
        });

        await interaction.editReply({ content: 'Mesai menüsü gönderildi.' });
    }
};
