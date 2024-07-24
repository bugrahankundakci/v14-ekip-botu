const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Bot ile alakalı işlemler')
    .addStringOption(option =>
      option.setName('log_kurulum')
        .setDescription('Botun loglarını atması için log odalarını kurar.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('log_temizle')
        .setDescription('Temizlemek istediğiniz log kategorisinin ismini belirtin.')
        .setRequired(false)),

  async execute(interaction) {
    if (interaction.user.id !== minik.botSettings.botowner) {
      return interaction.reply({
        content: ":x: Bu komutu kullanmaya izniniz yok.",
        ephemeral: true,
      });
    }

    const logChannels = [
      'minik_log',
      'otorol_log',
      'test',
      'invite_log',
      'message_log'
    ];

    if (interaction.options.getString('log_kurulum')) {
      await interaction.deferReply({ content: `Log odaları kuruluyor...`, ephemeral: true });
      try {
        const category = await interaction.guild.channels.create({
          name: 'minik',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [{
            id: interaction.guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.DeafenMembers,
              PermissionFlagsBits.Stream,
              PermissionFlagsBits.Speak,
            ]
          }]
        });

        for (const channelName of logChannels) {
          await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
          });
        }

        return interaction.followUp({ content: 'Log odaları başarıyla oluşturuldu.', ephemeral: true });
      } catch (error) {
        console.error('Log odaları oluşturulurken bir hata oluştu:', error);
        return interaction.followUp({ content: 'Log odaları oluşturulurken bir hata oluştu.', ephemeral: true });
      }
    }

    if (interaction.options.getString('log_temizle')) {
      const categoryName = interaction.options.getString('log_temizle');

      try {
        const category = interaction.guild.channels.cache.find(channel => channel.name === categoryName && channel.type === ChannelType.GuildCategory);
        if (category) {
          const childrenChannels = category.children.cache.filter(channel => logChannels.includes(channel.name));
          for (const channel of childrenChannels.values()) {
            await channel.delete();
          }
          await category.delete();
          return interaction.followUp({ content: 'Log odaları başarıyla temizlendi.', ephemeral: true });
        } else {
          return interaction.followUp({ content: 'Belirtilen kategori bulunamadı.', ephemeral: true });
        }
      } catch (error) {
        console.error('Log odaları temizlenirken bir hata oluştu:', error);
        return interaction.followUp({ content: 'Log odaları temizlenirken bir hata oluştu.', ephemeral: true });
      }
    }

    return interaction.reply({ content: 'Bir seçenek belirtmediniz.', ephemeral: true });
  },
};