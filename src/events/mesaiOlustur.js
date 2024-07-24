const { Events } = require('discord.js');
const { JsonDatabase } = require('for.db');
const moment = require('moment');
const fs = require('fs');

const db = new JsonDatabase({
  databasePath: "./fordb.json"
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'mesai-olustur') {
            const selectedValue = interaction.values[0];
            const userId = interaction.user.id;

            if (!db.has(userId)) {
                db.set(userId, {
                    status: 'none',
                    mesailer: {}
                });
            }

            const userData = db.get(userId);

            if (!userData.mesailer) {
                userData.mesailer = {};
                db.set(userId, userData);
            }

            const mesaiNumarası = Object.keys(userData.mesailer).length;

            switch (selectedValue) {
                case 'mesaigir':
                    if (userData.status === 'in') {
                        await interaction.reply({ content: `<@${userId}> zaten mesaiye girmiş.`, ephemeral: true });
                        return;
                    }

                    db.set(`${userId}.status`, 'in');
                    db.set(`${userId}.mesailer.${mesaiNumarası + 1}`, {
                        giriş: moment().format('YYYY-MM-DD HH:mm:ss'),
                        çıkış: null
                    });
                    await interaction.reply({ content: `<@${userId}> mesaiye girildi.`, ephemeral: true });
                    break;

                case 'mesaicheck':
                    const currentStatus = db.get(`${userId}.status`);
                    const mesailer = db.get(`${userId}.mesailer`);
                    const sonMesaiNumarası = Object.keys(mesailer).length;

                    const sonMesai = mesailer[sonMesaiNumarası];
                    const girişZamanii = sonMesai?.giriş ? moment(sonMesai.giriş) : null;
                    const çıkışZamanii = sonMesai?.çıkış ? moment(sonMesai.çıkış) : null;

                    let mesaiBilgisi = '';
                    if (currentStatus === 'in') {
                        mesaiBilgisi = `<@${userId}> şu anda mesaiye girmiş durumda.\nSon Giriş Tarihi: <t:${Math.floor(new Date(sonMesai?.giriş).getTime() / 1000)}:R>`;
                    } else {
                        mesaiBilgisi = `<@${userId}> Mesaide değilsin. \nSon Mesai bilgileri: \n Giriş: <t:${Math.floor(new Date(sonMesai?.giriş).getTime() / 1000)}:R>\nÇıkış: <t:${Math.floor(new Date(sonMesai?.çıkış).getTime() / 1000)}:R>`;
                    }

                    if (girişZamanii && çıkışZamanii) {
                        const mesaiSüresi = moment.duration(çıkışZamanii.diff(girişZamanii));
                        const hours = Math.floor(mesaiSüresi.asHours());
                        const minutes = Math.floor(mesaiSüresi.asMinutes()) % 60;
                        const seconds = Math.floor(mesaiSüresi.asSeconds()) % 60;

                        mesaiBilgisi += `\nToplam Mesai Süresi: ${hours} saat, ${minutes} dakika, ${seconds} saniye`;
                    }

                    await interaction.reply({ content: mesaiBilgisi, ephemeral: true });
                    break;

                case 'mesaicik':
                    if (userData.status === 'out') {
                        await interaction.reply({ content: `<@${userId}> zaten mesaiden çıkmış.`, ephemeral: true });
                        return;
                    }

                    const şuAn = moment();
                    const mevcutMesai = userData.mesailer[mesaiNumarası];
                    if (!mevcutMesai || mevcutMesai.çıkış) {
                        await interaction.reply({ content: `<@${userId}> geçerli bir mesai kaydı bulunmamaktadır.`, ephemeral: true });
                        return;
                    }

                    db.set(`${userId}.status`, 'out');
                    db.set(`${userId}.mesailer.${mesaiNumarası}.çıkış`, şuAn.format('YYYY-MM-DD HH:mm:ss'));

                    const girişZamani = moment(mevcutMesai.giriş);
                    const çıkışZamani = şuAn;
                    const mesaiSüresi = moment.duration(çıkışZamani.diff(girişZamani));
                    const hours = Math.floor(mesaiSüresi.asHours());
                    const minutes = Math.floor(mesaiSüresi.asMinutes()) % 60;
                    const seconds = Math.floor(mesaiSüresi.asSeconds()) % 60;

                    await interaction.reply({ content: `<@${userId}> mesaiden çıkıldı.\nToplam Mesai Süresi: ${hours} saat, ${minutes} dakika, ${seconds} saniye, `, ephemeral: true });
                    break;

                case 'mesailerim':
                    const tümMesailer = db.get(`${userId}.mesailer`);
                    if (Object.keys(tümMesailer).length === 0) {
                        await interaction.reply({ content: `<@${userId}> için herhangi bir mesai kaydı bulunmamaktadır.`, ephemeral: true });
                        return;
                    }

                    let mesaiBilgisiForAll = 'Geçmiş Mesai Kayıtları:\n';
                    for (const [key, value] of Object.entries(tümMesailer)) {
                        const girişZamani = moment(value.giriş);
                        const çıkışZamani = value.çıkış ? moment(value.çıkış) : null;
                        const mesaiSüresi = çıkışZamani ? moment.duration(çıkışZamani.diff(girişZamani)) : null;
                        const hours = mesaiSüresi ? Math.floor(mesaiSüresi.asHours()) : 0;
                        const minutes = mesaiSüresi ? Math.floor(mesaiSüresi.asMinutes()) % 60 : 0;
                        const seconds = mesaiSüresi ? Math.floor(mesaiSüresi.asSeconds()) % 60 : 0;

                        mesaiBilgisiForAll += `**${key}. Mesai**\nGiriş: ${girişZamani.format('YYYY-MM-DD HH:mm:ss')} \nÇıkış: ${value.çıkış ? çıkışZamani.format('YYYY-MM-DD HH:mm:ss') : 'Henüz çıkış yapılmamış'}\nToplam Mesai Süresi: ${hours} saat, ${minutes} dakika, ${seconds} saniye\n\n`;
                    }

                    const filePathForAll = `./mesai_kayitlari_${userId}.txt`;
                    fs.writeFileSync(filePathForAll, mesaiBilgisiForAll);

                    await interaction.reply({ content: 'Geçmiş mesai kayıtlarınız gönderildi.', files: [filePathForAll], ephemeral: true });
                    fs.unlinkSync(filePathForAll);
                    break;

                case 'sifirla':
                    await interaction.reply({ content: `Seçenek sıfırlandı.`, ephemeral: true });
                    break;

                default:
                    await interaction.reply({ content: 'Geçersiz seçenek!', ephemeral: true });
                    break;
            }
        }
    },
};
