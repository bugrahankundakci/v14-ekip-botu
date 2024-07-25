const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('farm-mesaj')
        .setDescription('Kullanıcıların farm girmesi için menü gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const militanembed = new EmbedBuilder()
            .setTitle('Farm Menüsü')
            .setColor('ff0400')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setImage(minik.mesai.ekip.photograph)
            .setDescription(minik.mesai.menuayarlari.mesaj);

        const militaninmenusu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('farm-olustur')
                    .setPlaceholder(minik.farm.menuayarlari.menuplaceholder)
                    .addOptions([
                        {
                            label: minik.farm.menuayarlari.birseceneklabel,
                            emoji: minik.farm.menuayarlari.birsecenekemoji,
                            description: minik.farm.menuayarlari.birsecenekaciklama,
                            value: 'farmkontrol',
                        },
                        {
                          label: minik.farm.farmlar.Otlabel,
                          emoji: minik.farm.farmlar.otemoji,
                          description: minik.farm.farmlar.otaciklama,
                          value: 'otekle',
                        },
                        {
                            label: minik.farm.farmlar.kokainlabel,
                            emoji: minik.farm.farmlar.kokainemoji,
                            description: minik.farm.farmlar.kokainaciklama,
                            value: 'kokainekle',
                        },
                        {
                            label: minik.farm.farmlar.methlabel,
                            emoji: minik.farm.farmlar.methemoji,
                            description: minik.farm.farmlar.methaciklama,
                            value: 'methekle',
                        },
                        {
                            label: minik.farm.farmlar.karaparalabel,
                            emoji: minik.farm.farmlar.karaparaemoji,
                            description: minik.farm.farmlar.karaparaaciklama,
                            value: 'karaparaekle',
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
