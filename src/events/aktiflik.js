const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'aktiflik_buton') {
            const user = interaction.user;

            const message = await interaction.channel.messages.fetch(interaction.message.id);
            const embed = message.embeds[0];
            
            let description = embed.description;
            if (!description.includes(user)) {
                description += `\n${user.tag} (${user}) aktiflik!`;
                const updatedEmbed = new EmbedBuilder(embed)
                    .setDescription(description);

                await message.edit({ embeds: [updatedEmbed] });
            }

            await interaction.reply({ content: 'Başarıyla kaydedildin!', ephemeral: true });
        }
    }
};
