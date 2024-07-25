const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mesaj')
    .setDescription('istediğiniz kanala bot tarafından mesaj atmanızı sağlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Başvuru embedi hangi odaya atılacak?')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Embedin içindeki en üste yazılacak olan mesaj.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('embedin içerisine yazılıcak olan mesaj')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('image')
        .setDescription('Embed içerisine atılacak olan fotoğraf (sadece link).')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('content')
        .setDescription('Embed Üstüne ne yazalım? (tercihen everyone yada here yada aktif rol etiketi.)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('mesaimenusu')
        .setDescription('Tüm memurların kullanabileceği Mesai Menüsü')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('yetkilimesaimenusu')
        .setDescription('yetkilerin kontrol ettiği mesai menüsü.')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('illegalmenu')
        .setDescription('Tüm illegallerin farm kayıt edebileceği database menüsü.')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('illegalyetkilimenusu')
        .setDescription('Tüm ekibin database\'ini kontrol etmek için gerekli olan menü.')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
      .setName('basvurubutonu')
      .setDescription('Ekip başvurusu için özel buton ekler.')
      .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('Embed hangi renk olacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('footer')
        .setDescription('Embedin altına yazılıcak olan mesaj.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { guild, options } = interaction;
    try {
      const channel = options.getChannel('channel');
      const title = options.getString('title');
      const description = options.getString('description');
      const image = options.getString('image');
      const color = options.getString('color') || '#FFFFFF';
      const mesaimenusu = options.getString('mesaimenusu');
      const embedfooter = options.getString('footer');
      const content = options.getString('content');
      const yetkilimesaimenusu = options.getString('yetkilimesaimenusu');
      const basvurubutonu = options.getString('basvurubutonu');
      const illegalmenu = options.getString('illegalmenu');
      const yetkiliillegalmenusu = options.getString('illegalyetkilimenusu');

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setImage(image || null)
        .setTitle(title)
        .setColor(color)
        .setFooter({ text: embedfooter })
        .setTimestamp();

      const components = [];
      const rows = [];

      if (mesaimenusu) {
        const mesaiMenu = new StringSelectMenuBuilder()
          .setCustomId('mesai-olustur')
          .setPlaceholder(minik.mesai.menuayarlari.menuplaceholder)
          .addOptions([
            {
              label: minik.mesai.menuayarlari.birseceneklabel,
              emoji: minik.mesai.menuayarlari.birsecenekemoji,
              description: minik.mesai.menuayarlari.birsecenekaciklama,
              value: 'mesaigir',
          },
          {
              label: minik.mesai.menuayarlari.ikiseceneklabel,
              emoji: minik.mesai.menuayarlari.ikisecenekemoji,
              description: minik.mesai.menuayarlari.ikisecenekaciklama,
              value: 'mesaicheck',
          },
          {
              label: minik.mesai.menuayarlari.ucseceneklabel,
              emoji: minik.mesai.menuayarlari.ucsecenekemoji,
              description: minik.mesai.menuayarlari.ucsecenekaciklama,
              value: 'mesaicik',
          },
          {
              label: minik.mesai.menuayarlari.dortseceneklabel,
              emoji: minik.mesai.menuayarlari.dortsecenekemoji,
              description: minik.mesai.menuayarlari.dortsecenekaciklama,
              value: 'mesailerim',
          },
          {
              label: 'Seçenek Sıfırla',
              description: 'Menüdeki seçeneğinizi sıfırlarsınız.',
              emoji: '1264482771049386014',
              value: 'sifirla',
          },
          ]);

        const mesaiMenuRow = new ActionRowBuilder()
          .addComponents(mesaiMenu);

        components.push(mesaiMenuRow);
      }

      if (yetkilimesaimenusu) {
        const yetkiliMesaiMenu = new StringSelectMenuBuilder()
          .setCustomId('mesai-yetkili')
          .setPlaceholder(minik.mesai.yetkilimenuayarlari.menuplaceholder)
          .addOptions([
            {
              label: minik.mesai.yetkilimenuayarlari.birseceneklabel,
              emoji: minik.mesai.yetkilimenuayarlari.birsecenekemoji,
              description: minik.mesai.yetkilimenuayarlari.birsecenekaciklama,
              value: 'forcemesaigir',
          },
          {
              label: minik.mesai.yetkilimenuayarlari.ikiseceneklabel,
              emoji: minik.mesai.yetkilimenuayarlari.ikisecenekemoji,
              description: minik.mesai.yetkilimenuayarlari.ikisecenekaciklama,
              value: 'forcemesaicheck',
          },
          {
              label: minik.mesai.yetkilimenuayarlari.ucseceneklabel,
              emoji: minik.mesai.yetkilimenuayarlari.ucsecenekemoji,
              description: minik.mesai.yetkilimenuayarlari.ucsecenekaciklama,
              value: 'forcemesaicik',
          },
          {
              label: minik.mesai.yetkilimenuayarlari.dortseceneklabel,
              emoji: minik.mesai.yetkilimenuayarlari.dortsecenekemoji,
              description: minik.mesai.yetkilimenuayarlari.dortsecenekaciklama,
              value: 'forcemesaidekiler',
          },
          {
              label: minik.mesai.yetkilimenuayarlari.besseceneklabel,
              emoji: minik.mesai.yetkilimenuayarlari.bessecenekemoji,
              description: minik.mesai.yetkilimenuayarlari.bessecenekaciklama,
              value: 'forcemesailer',
          },
          {
              label: 'Seçenek Sıfırla',
              description: 'Menüdeki seçeneğinizi sıfırlarsınız.',
              emoji: '1264482771049386014',
              value: 'sifirla',
          },
          ]);
        const yetkiliMesaiMenuRow = new ActionRowBuilder()
          .addComponents(yetkiliMesaiMenu);

        components.push(yetkiliMesaiMenuRow);
      }

      if (basvurubutonu) {
            
        const militaninbutonu = new ButtonBuilder()
        .setCustomId('minikinmodali')
        .setEmoji(minik.mesai.menuayarlari.birsecenekemoji)
        .setLabel('Ekip Başvurusu!')
        .setStyle(ButtonStyle.Primary)

        const basvurubutonuu = new ActionRowBuilder()
        .addComponents(militaninbutonu);

        components.push(basvurubutonuu);
      }

      if(illegalmenu) {

        const illegalmenubuilderim = new StringSelectMenuBuilder()
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
          ]);
        const illegalmenuruw = new ActionRowBuilder()
          .addComponents(illegalmenubuilderim);

        components.push(illegalmenuruw);


      }

      if (yetkiliillegalmenusu) {


        const illegalyetkilimenubuilderim = new StringSelectMenuBuilder()
          .setCustomId('farm-yetkili')
          .setPlaceholder(minik.farm.yetkilimenuayarlari.menuplaceholder)
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
          ]);
        const illegalyetkilimenuruw = new ActionRowBuilder()
          .addComponents(illegalyetkilimenubuilderim);

        components.push(illegalyetkilimenuruw);
      }

      await guild.channels.cache.get(channel.id).send({
        content: `${content}`|| null,
        embeds: [embed],
        components: components
      });

      await interaction.reply({
        content: 'Başvuru başarıyla oluşturuldu!',
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.',
        ephemeral: true
      });
    }
  },
};