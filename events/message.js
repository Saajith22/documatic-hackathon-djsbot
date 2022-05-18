const client = require('../index.js');

client.on('messageCreate', async(message) => {
  if(message.author.bot || !message.guild) return;

  const { content } = message;
  if(!content.toLowerCase().startsWith(client.prefix)) return;

  const args = content.slice(client.prefix.length).trim().split(/ +/g);
  const cmd = args.shift();
  const command = client.commands.get(cmd);
  if(!command) return;

  await command.run(client, message, args);
});
