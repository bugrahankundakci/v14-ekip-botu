const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const { JsonDatabase } = require('for.db');
const fs = require('fs');

const db = new JsonDatabase({
    databasePath: "./src/database/farmdb.json"
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'farm-olustur') {
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case 'otekle':
                    
                const oteklemodal = new ModalBuilder()
                .setCustomId('oteklemodal')
                .setTitle('Farm Menüsü');

            const forcefarmeklenecekotmodal = new TextInputBuilder()
                .setCustomId('forcefarmeklenecekotmodal')
                .setLabel('OT Miktarı')
                .setRequired(false)
                .setPlaceholder('1-999')
                .setStyle(TextInputStyle.Short);

            const forcemesaigirActionRow2 = new ActionRowBuilder()
                .addComponents(forcefarmeklenecekotmodal);

                oteklemodal.addComponents(forcemesaigirActionRow2);
            
            await interaction.showModal(oteklemodal);
            break;


            case 'kokainekle':
                const kokainekle = new ModalBuilder()
                .setCustomId('kokaineklemodal')
                .setTitle('Farm Menüsü');

            const kokaineklemodal = new TextInputBuilder()
                .setCustomId('kokaineklenenmodal')
                .setLabel('Kokain Miktarı')
                .setRequired(false)
                .setPlaceholder('1-999')
                .setStyle(TextInputStyle.Short);

            const  kokainekleActionRow2 = new ActionRowBuilder()
                .addComponents(kokaineklemodal);

                kokainekle.addComponents(kokainekleActionRow2);
            
            await interaction.showModal(kokainekle);
            break;

            case 'methekle':
                const methekle = new ModalBuilder()
                .setCustomId('metheklemodal')
                .setTitle('Farm Menüsü');

            const metheklemodal = new TextInputBuilder()
                .setCustomId('metheklenenmodal')
                .setLabel('Meth Miktarı')
                .setRequired(false)
                .setPlaceholder('1-999')
                .setStyle(TextInputStyle.Short);

            const  methekleActionRow2 = new ActionRowBuilder()
                .addComponents(metheklemodal);

                methekle.addComponents(methekleActionRow2);
            
            await interaction.showModal(methekle);
            break;

            case 'karaparaekle':
                const karaparaekle = new ModalBuilder()
                .setCustomId('karaparaeklemodal')
                .setTitle('Farm Menüsü');

            const karaparaeklemodal = new TextInputBuilder()
                .setCustomId('karaparaeklenenmodal')
                .setLabel('Karapara Miktarı')
                .setRequired(false)
                .setPlaceholder('1-999')
                .setStyle(TextInputStyle.Short);

            const  karaparaekleActionRow2 = new ActionRowBuilder()
                .addComponents(karaparaeklemodal);

                karaparaekle.addComponents(karaparaekleActionRow2);
            
            await interaction.showModal(karaparaekle);   
            break;


            case 'farmkontrol':
                    const checkFarmUserId = interaction.user.id;
                    const checkUserData = db.get(`farm.${checkFarmUserId}`);

                    if (checkUserData) {
                        await interaction.channel.send({ content: `<@${interaction.user.id}> kullanıcısının farm bilgileri:\nOT: ${checkUserData.ot}\nKokain: ${checkUserData.kokain}\nMeth: ${checkUserData.meth}\nKarapara: ${checkUserData.karapara}`, ephemeral: true });
                    } else {
                        await interaction.channel.send({ content: `<@${interaction.user.id}> kullanıcısının farm bilgisi bulunamadı.`, ephemeral: true });
                    }
                    break;

            case 'forcefarmsil':
                const forcefarmsilmodal = new ModalBuilder()
                .setCustomId('forcefarmsilModal')
                .setTitle('Farm Sil');

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

            const forcefarmsilActionRow2 = new ActionRowBuilder()
                .addComponents(forcefarmsilinnecekotmodal);
            const forcefarmsilActionRow3 = new ActionRowBuilder()
                .addComponents(forcefarmsilnecekkokainmodal);
            const forcefarmsilActionRow4 = new ActionRowBuilder()
                .addComponents(forcefarmsilnecekmethmodal);
            const forcefarmsilActionRow5 = new ActionRowBuilder()
                .addComponents(forcefarmsilinecekkaraparamodal);

            forcefarmsilmodal.addComponents(forcefarmsilActionRow2, forcefarmsilActionRow3, forcefarmsilActionRow4, forcefarmsilActionRow5);
            
            await interaction.showModal(forcefarmsilmodal);
                    break;

                case 'sifirla':
                    await interaction.channel.send({ content: `<@${interaction.user.id}> Başarılı bir şekilde seçenek sıfırlandı.`, ephemeral: true });
                    break;
                
                default:
                    await interaction.channel.send({ content: 'Geçersiz seçenek!', ephemeral: true });
                    break;
            }
        } else if (interaction.isModalSubmit()) {
            const modalId = interaction.customId;

            switch (modalId) {
                case 'oteklemodal':
                    const farmeklenecekkisi = interaction.user.id;
                    const farmeklenecekotmiktar = parseInt(interaction.fields.getTextInputValue('forcefarmeklenecekotmodal') || '0', 10);

                    let userDatass = db.get(`farm.${farmeklenecekkisi}`) || { ot: 0, kokain: 0, meth: 0, karapara: 0 };

                    if (farmeklenecekotmiktar) userDatass.ot += farmeklenecekotmiktar;

                    if (!userDatass.eklemeTarihi) userDatass.eklemeTarihi = new Date().toISOString();

                    db.set(`farm.${farmeklenecekkisi}`, userDatass);

                    await interaction.channel.send({ content: `<@${interaction.user.id}> , Farmların başarıyla kayıt edildi!`, ephemeral: true });
                   
                    break;

                    case 'kokaineklemodal':

                    const kokaineklenecekkisi = interaction.user.id;
                    const eklenecekkokainmiktari = parseInt(interaction.fields.getTextInputValue('kokaineklenenmodal') || '0', 10);

                    let userDatasss = db.get(`farm.${kokaineklenecekkisi}`) || { ot: 0, kokain: 0, meth: 0, karapara: 0 };

                    if (eklenecekkokainmiktari) userDatasss.kokain += eklenecekkokainmiktari;

                    if (!userDatasss.eklemeTarihi) userDatasss.eklemeTarihi = new Date().toISOString();

                    db.set(`farm.${kokaineklenecekkisi}`, userDatasss);

                    await interaction.channel.send({ content: `<@${interaction.user.id}> , Farmların başarıyla kayıt edildi!`, ephemeral: true });
                 

                        break;


                        case 'metheklemodal':

                        const metheklenecekkisi = interaction.user.id;
                        const eklenecekmethmiktari = parseInt(interaction.fields.getTextInputValue('metheklenenmodal') || '0', 10);
    
                        let userDatassss = db.get(`farm.${metheklenecekkisi}`) || { ot: 0, kokain: 0, meth: 0, karapara: 0 };
    
                        if (eklenecekmethmiktari) userDatassss.meth += eklenecekmethmiktari;
    
                        if (!userDatassss.eklemeTarihi) userDatassss.eklemeTarihi = new Date().toISOString();
    
                        db.set(`farm.${metheklenecekkisi}`, userDatassss);
    
                        await interaction.channel.send({ content: `<@${interaction.user.id}> , Farmların başarıyla kayıt edildi!`, ephemeral: true });
                     
                            break;

                            case 'karaparaeklemodal':

                            const karaparaeklenecekkisi = interaction.user.id;
                            const eklenecekkaraparamiktari = parseInt(interaction.fields.getTextInputValue('karaparaeklenenmodal') || '0', 10);
        
                            let userDatasssss = db.get(`farm.${karaparaeklenecekkisi}`) || { ot: 0, kokain: 0, meth: 0, karapara: 0 };
        
                            if (eklenecekkaraparamiktari) userDatasssss.karapara += eklenecekkaraparamiktari;
        
                            if (!userDatasssss.eklemeTarihi) userDatasssss.eklemeTarihi = new Date().toISOString();
        
                            db.set(`farm.${karaparaeklenecekkisi}`, userDatasssss);
        
                            await interaction.channel.send({ content: `<@${interaction.user.id}> , Farmların başarıyla kayıt edildi!`, ephemeral: true });
                         
                                break;

                case 'forcefarmsilModal':
                    const deleteSelectionUserId = interaction.user.id;
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
                        await interaction.channel.send({ content: `Farm <@${deleteSelectionUserId}> kullanıcısının seçilen verileri başarıyla silindi.`, ephemeral: true });
                    } else {
                        await interaction.channel.send({ content: `<@${deleteSelectionUserId}> kullanıcısının farm bilgisi bulunamadı.`, ephemeral: true });
                    }
                    break;



                    
                default:
               //     await interaction.channel.send({ content: 'Geçersiz modal!', ephemeral: true });
                break;
            }
        }
    }
};