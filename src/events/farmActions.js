const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const { JsonDatabase } = require('for.db');
const fs = require('fs');

const db = new JsonDatabase({
    databasePath: "./src/database/farmdb.json"
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'farm-yetkili') {
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case 'forceekle':

                    const forceeklemodal = new ModalBuilder()
                        .setCustomId('forceeklemodal')
                        .setTitle('Farm Ekle');

                    const forcefarmeklenecekkisimodal = new TextInputBuilder()
                        .setCustomId('forcefarmeklenecekkisimodal')
                        .setLabel('Farm Eklenecek Kişi')
                        .setRequired(true)
                        .setPlaceholder('Farm eklenecek kişinin DC ID\'sini gir')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmeklenecekotmodal = new TextInputBuilder()
                        .setCustomId('forcefarmeklenecekotmodal')
                        .setLabel('OT Miktarı')
                        .setRequired(false)
                        .setPlaceholder('1-999')
                        .setMaxLength(3)
                        .setStyle(TextInputStyle.Short);

                    const forcefarmeklenecekkokainmodal = new TextInputBuilder()
                        .setCustomId('forcefarmeklenecekkokainmodal')
                        .setLabel('Kokain Miktarı')
                        .setRequired(false)
                        .setMaxLength(3)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmeklenecekmethmodal = new TextInputBuilder()
                        .setCustomId('forcefarmeklenecekmethmodal')
                        .setLabel('Meth Miktarı')
                        .setRequired(false)
                        .setMaxLength(3)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmeklenecekkaraparamodal = new TextInputBuilder()
                        .setCustomId('forcefarmeklenecekkaraparamodal')
                        .setLabel('Karapara Miktarı')
                        .setRequired(false)
                        .setMaxLength(3)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcemesaigirActionRow1 = new ActionRowBuilder()
                        .addComponents(forcefarmeklenecekkisimodal);
                    const forcemesaigirActionRow2 = new ActionRowBuilder()
                        .addComponents(forcefarmeklenecekotmodal);
                    const forcemesaigirActionRow3 = new ActionRowBuilder()
                        .addComponents(forcefarmeklenecekkokainmodal);
                    const forcemesaigirActionRow4 = new ActionRowBuilder()
                        .addComponents(forcefarmeklenecekmethmodal);
                    const forcemesaigirActionRow5 = new ActionRowBuilder()
                        .addComponents(forcefarmeklenecekkaraparamodal);

                    forceeklemodal.addComponents(forcemesaigirActionRow1, forcemesaigirActionRow2, forcemesaigirActionRow3, forcemesaigirActionRow4, forcemesaigirActionRow5);
                    
                    await interaction.showModal(forceeklemodal);
                    break;

                case 'forcecheck':
                    const forcefarmcheckModal = new ModalBuilder()
                        .setCustomId('forcefarmcheckModal')
                        .setTitle('Farm Kontrol');

                    const forcemesaicheckInput = new TextInputBuilder()
                        .setCustomId('forcemesaicheckInput')
                        .setLabel('Farmları Kontrol Edilecek Kişi')
                        .setPlaceholder('Farmları kontrol edilecek kişinin DC ID\'sini gir')
                        .setStyle(TextInputStyle.Short);

                    const forcemesaicheckActionRow = new ActionRowBuilder()
                        .addComponents(forcemesaicheckInput);

                    forcefarmcheckModal.addComponents(forcemesaicheckActionRow);
                    await interaction.showModal(forcefarmcheckModal);
                    break;

                case 'forcefarmsil':
                    const forcefarmsilmodal = new ModalBuilder()
                        .setCustomId('forcefarmsilModal')
                        .setTitle('Farm Sil');

                    const forcefarmfarmsilnecekkisimodal = new TextInputBuilder()
                        .setCustomId('forcefarmfarmsilnecekkisimodal')
                        .setLabel('Farm Silinecek Kişi')
                        .setRequired(true)
                        .setPlaceholder('Farm silinecek kişinin DC ID\'sini gir')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmsilinnecekotmodal = new TextInputBuilder()
                        .setCustomId('forcefarmsilinnecekotmodal')
                        .setLabel('OT Miktarı')
                        .setRequired(false)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmsilnecekkokainmodal = new TextInputBuilder()
                        .setCustomId('forcefarmsilnecekkokainmodal')
                        .setLabel('Kokain Miktarı')
                        .setRequired(false)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmsilnecekmethmodal = new TextInputBuilder()
                        .setCustomId('forcefarmsilnecekmethmodal')
                        .setLabel('Meth Miktarı')
                        .setRequired(false)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmsilinecekkaraparamodal = new TextInputBuilder()
                        .setCustomId('forcefarmsilinecekkaraparamodal')
                        .setLabel('Karapara Miktarı')
                        .setRequired(false)
                        .setPlaceholder('1-999')
                        .setStyle(TextInputStyle.Short);

                    const forcefarmsilActionRow1 = new ActionRowBuilder()
                        .addComponents(forcefarmfarmsilnecekkisimodal);
                    const forcefarmsilActionRow2 = new ActionRowBuilder()
                        .addComponents(forcefarmsilinnecekotmodal);
                    const forcefarmsilActionRow3 = new ActionRowBuilder()
                        .addComponents(forcefarmsilnecekkokainmodal);
                    const forcefarmsilActionRow4 = new ActionRowBuilder()
                        .addComponents(forcefarmsilnecekmethmodal);
                    const forcefarmsilActionRow5 = new ActionRowBuilder()
                        .addComponents(forcefarmsilinecekkaraparamodal);

                    forcefarmsilmodal.addComponents(forcefarmsilActionRow1, forcefarmsilActionRow2, forcefarmsilActionRow3, forcefarmsilActionRow4, forcefarmsilActionRow5);
                    
                    await interaction.showModal(forcefarmsilmodal);
                    break;

                case 'sifirla':
                    await interaction.reply({ content: `<@${interaction.user.id}> Başarılı bir şekilde seçenek sıfırlandı.`, ephemeral: true });
                    break;
                
                default:
                    await interaction.reply({ content: 'Geçersiz seçenek!', ephemeral: true });
                    break;
            }
        } else if (interaction.isModalSubmit()) {
            const modalId = interaction.customId;

            switch (modalId) {
                case 'forceeklemodal':

                    const farmeklenecekkisi = interaction.fields.getTextInputValue('forcefarmeklenecekkisimodal');
                    const farmeklenecekotmiktar = parseInt(interaction.fields.getTextInputValue('forcefarmeklenecekotmodal') || '0', 10);
                    const farmeklenecekkokainmiktar = parseInt(interaction.fields.getTextInputValue('forcefarmeklenecekkokainmodal') || '0', 10);
                    const farmeklenecekmethmiktar = parseInt(interaction.fields.getTextInputValue('forcefarmeklenecekmethmodal') || '0', 10);
                    const farmeklenecekkaraparamiktar = parseInt(interaction.fields.getTextInputValue('forcefarmeklenecekkaraparamodal') || '0', 10);

                    let userDatass = db.get(`farm.${farmeklenecekkisi}`) || { ot: 0, kokain: 0, meth: 0, karapara: 0 };

                    if (farmeklenecekotmiktar) userDatass.ot += farmeklenecekotmiktar;
                    if (farmeklenecekkokainmiktar) userDatass.kokain += farmeklenecekkokainmiktar;
                    if (farmeklenecekmethmiktar) userDatass.meth += farmeklenecekmethmiktar;
                    if (farmeklenecekkaraparamiktar) userDatass.karapara += farmeklenecekkaraparamiktar;

                    if (!userDatass.eklemeTarihi) userDatass.eklemeTarihi = new Date().toISOString();

                    db.set(`farm.${farmeklenecekkisi}`, userDatass);

                    await interaction.reply({ content: `Farm <@${interaction.user.id}> tarafından başarıyla eklendi.`, ephemeral: true });
                    break;


                    case 'forcefarmcheckModal':
                        const checkFarmUserId = interaction.fields.getTextInputValue('forcemesaicheckInput');
                        const checkUserData = db.get(`farm.${checkFarmUserId}`);
    
                        if (checkUserData) {
                            await interaction.reply({ content: `<@${checkFarmUserId}> kullanıcısının farm bilgileri:\nOT: ${checkUserData.ot}\nKokain: ${checkUserData.kokain}\nMeth: ${checkUserData.meth}\nKarapara: ${checkUserData.karapara}`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: `<@${checkFarmUserId}> kullanıcısının farm bilgisi bulunamadı.`, ephemeral: true });
                        }
                        break;








                case 'forcefarmsilModal':
                    const deleteSelectionUserId = interaction.fields.getTextInputValue('forcefarmfarmsilnecekkisimodal');
                    const otSilVal = parseInt(interaction.fields.getTextInputValue('forcefarmsilinnecekotmodal') || '0', 10);
                    const kokainSilVal = parseInt(interaction.fields.getTextInputValue('forcefarmsilnecekkokainmodal') || '0', 10);
                    const methSilVal = parseInt(interaction.fields.getTextInputValue('forcefarmsilnecekmethmodal') || '0', 10);
                    const karaparaSilVal = parseInt(interaction.fields.getTextInputValue('forcefarmsilinecekkaraparamodal') || '0', 10);

                    let deleteUserSelectionData = db.get(`farm.${deleteSelectionUserId}`);

                    if (deleteUserSelectionData) {
                        if (otSilVal) deleteUserSelectionData.ot -= otSilVal;
                        if (kokainSilVal) deleteUserSelectionData.kokain -= kokainSilVal;
                        if (methSilVal) deleteUserSelectionData.meth -= methSilVal;
                        if (karaparaSilVal) deleteUserSelectionData.karapara -= karaparaSilVal;

                        db.set(`farm.${deleteSelectionUserId}`, deleteUserSelectionData);
                        await interaction.reply({ content: `Farm <@${deleteSelectionUserId}> kullanıcısının seçilen verileri başarıyla silindi.`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: `<@${deleteSelectionUserId}> kullanıcısının farm bilgisi bulunamadı.`, ephemeral: true });
                    }
                    break;



                    
                default:
               //     await interaction.reply({ content: 'Geçersiz modal!', ephemeral: true });
                    break;
            }
        }
    }
};
