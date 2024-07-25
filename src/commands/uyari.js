const { SlashCommandBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uyarı')
        .setDescription('Seçtiğiniz kişiye uyarı verirsiniz.')
        .addUserOption(option =>
            option.setName('kişi')
                .setDescription('kişi seçiniz.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('adet')
                .setDescription('uyarı adeti giriniz.')
                .setRequired(true)
                .setChoices(
                    { name: '1x', value: 'biriks' },
                    { name: '2x', value: 'ikiiks' },
                    { name: '3x', value: 'uciks' },
                    { name: '4x', value: 'dortiks' },
                    { name: '5x', value: 'besiks' },
                    { name: '1 gün wl', value: 'birgunwl' },
                    { name: '2 gün wl', value: 'ikigunwl' },
                    { name: '3 gün wl', value: 'ucgunwl' },
                    { name: '5 gün wl', value: 'besgunwl' },
                    { name: '7 gün wl', value: 'yedigunwl' },
                )),
    async execute(interaction) {
        const member = interaction.options.getMember('kişi');
        const adet = interaction.options.getString('adet');
        
        if (!member || !adet) {
            return await interaction.reply({ content: `kullanıcı veya uyarı adeti bulunamadı.`, ephemeral: true });
        }
        
        const yetkili = interaction.member.roles.cache.some(r => minik.rol.yonetici.includes(r.id));
        
        if (!yetkili) {
            return await interaction.reply({ content: `Bu komutu kullanamazsın.`, ephemeral: true });
        }

        const roleNames = {
            biriks: '1x',
            ikiiks: '2x',
            uciks: '3x',
            dortiks: '4x',
            besiks: '5x',
            birgunwl: '1 gün wl',
            ikigunwl: '2 gün wl',
            ucgunwl: '3 gün wl',
            besgunwl: '5 gün wl',
            yedigunwl: '7 gün wl'
        };

        const roleName = roleNames[adet];
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            return await interaction.reply({ content: `Rol bulunamadı: ${roleName}`, ephemeral: true });
        }

        try {
            await member.roles.add(role);
            await interaction.reply({ content: `Rol verildi: ${role.name}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `Rol verilirken bir hata oluştu.`, ephemeral: true });
        }
    }
};
