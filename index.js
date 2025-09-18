// Importando as dependências necessárias
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Carregar variáveis de ambiente

// Inicializando o cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Permite o bot saber sobre guilds (servidores)
    GatewayIntentBits.GuildMessages, // Permite o bot ler mensagens
    GatewayIntentBits.MessageContent, // Necessário para acessar conteúdo de mensagens
    GatewayIntentBits.GuildMembers, // Permite o bot saber sobre membros do servidor
    GatewayIntentBits.GuildVoiceStates, // Necessário para monitorar canais de voz
    GatewayIntentBits.GuildMessageReactions, // Para capturar reações de mensagens
    GatewayIntentBits.MessageContent // Necessário para ler conteúdo das mensagens
  ]
});

// Carregar o ID do canal de logs e o token do bot do arquivo .env
const logChannelId = process.env.LOG_CHANNEL_ID;
const botToken = process.env.BOT_TOKEN;

// Quando o bot estiver pronto
client.once('ready', () => {
  console.log('✅ Bot logado e pronto!');
});

// Evento: Mensagem criada
client.on('messageCreate', (message) => {
  if (!message.author.bot) {
    const channel = message.guild.channels.cache.get(logChannelId);
    if (channel) {
      channel.send(`[MSG] ${message.author.tag}: ${message.content}`);
    } else {
      console.log('Não foi possível encontrar o canal de logs.');
    }
  }
});

// Evento: Reação adicionada
client.on('messageReactionAdd', (reaction, user) => {
  // Ignorar as reações de bots para evitar loops infinitos
  if (user.bot) return;

  const channel = reaction.message.guild.channels.cache.get(logChannelId);
  if (channel) {
    channel.send(`👍 ${user.tag} reagiu com "${reaction.emoji.name}" na mensagem de ${reaction.message.author.tag}`);
  }
});

// Evento: Reação removida
client.on('messageReactionRemove', (reaction, user) => {
  // Ignorar as reações de bots para evitar loops infinitos
  if (user.bot) return;

  const channel = reaction.message.guild.channels.cache.get(logChannelId);
  if (channel) {
    channel.send(`👋 ${user.tag} removeu a reação "${reaction.emoji.name}" na mensagem de ${reaction.message.author.tag}`);
  }
});

// Evento: Edição de mensagem
client.on('messageUpdate', (oldMessage, newMessage) => {
  // Verifica se a mensagem foi realmente alterada
  if (oldMessage.content !== newMessage.content) {
    const channel = newMessage.guild.channels.cache.get(logChannelId);
    if (channel) {
      channel.send(`✏️ A mensagem de ${oldMessage.author.tag} foi editada.\nAntes: "${oldMessage.content}"\nAgora: "${newMessage.content}"`);
    }
  }
});

// Evento: Exclusão de mensagem
client.on('messageDelete', (message) => {
  const channel = message.guild.channels.cache.get(logChannelId);
  if (channel) {
    channel.send(`🗑️ A mensagem de ${message.author.tag} foi excluída: "${message.content}"`);
  }
});

// Evento: Membro entrou em um canal de voz
client.on('voiceStateUpdate', (oldState, newState) => {
  const channel = newState.guild.channels.cache.get(logChannelId);
  if (!oldState.channel && newState.channel) {
    channel?.send(`🎤 ${newState.member.user.tag} entrou no canal de voz ${newState.channel.name}`);
  } else if (oldState.channel && !newState.channel) {
    channel?.send(`🔇 ${newState.member.user.tag} saiu do canal de voz ${oldState.channel.name}`);
  }
});

// Evento: Canal criado
client.on('channelCreate', (channel) => {
  const logChannel = channel.guild.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`📂 Canal criado: ${channel.name} (${channel.type})`);
  }
});

// Evento: Canal deletado
client.on('channelDelete', (channel) => {
  const logChannel = channel.guild.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`🗑️ Canal deletado: ${channel.name} (${channel.type})`);
  }
});

// Evento: Membro entrou no servidor
client.on('guildMemberAdd', (member) => {
  const logChannel = member.guild.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`📥 ${member.user.tag} entrou no servidor.`);
  }
});

// Evento: Membro saiu do servidor
client.on('guildMemberRemove', (member) => {
  const logChannel = member.guild.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`📤 ${member.user.tag} saiu do servidor.`);
  }
});

// Evento: Membro banido
client.on('guildBanAdd', (guild, user) => {
  const logChannel = guild.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`🚫 ${user.tag} foi banido do servidor.`);
  }
});

// Evento: Membro desbanido
client.on('guildBanRemove', (guild, user) => {
  const logChannel = guild.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`✅ ${user.tag} foi desbanido do servidor.`);
  }
});

// Logando o bot com o token armazenado nas variáveis de ambiente
client.login(botToken);
