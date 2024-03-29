const moment = require('moment')

module.exports = (self, log, config) => {
  self.on('messageCreate', (msg) => {
    if (msg.author.id !== self.user.id && msg.channel.guild && ~msg.content.indexOf(self.user.id)) {
      self.counts.mentionsGot = self.counts.mentionsGot + 1
      if (!config.mentionNotificator.logBlockedUsers && self.relationships.has(msg.author.id)) {
        if (self.relationships.get(msg.author.id).type === 2) return
      }
      if (config.mentionNotificator.inConsole) { log.mention(msg) }
      if (config.mentionNotificator.inNotificationChannel) {
        if (Object.keys(self.channelGuildMap).includes(config.notificationChannelID)) {
          self.getMessages(msg.channel.id, 4, msg.id).then(msgs => {
            self.createChannelWebhook(config.notificationChannelID, { name: msg.author.username }).then(w => {
              self.counts.msgsSent = self.counts.msgsSent + 1
              self.executeWebhook(w.id, w.token, {
                username: msg.author.username,
                avatarURL: msg.author.avatarURL,
                content: `**I mentioned you in** ${msg.channel.mention}!`,
                embeds: [{
                  title: moment(msg.timestamp).format('ddd, Do of MMM @ HH:mm:ss'),
                  author: {
                    name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                    icon_url: msg.author.avatarURL
                  },
                  color: 16426522,
                  fields: [
                    { name: msgs[2].author.username, value: msgs[2].cleanContent, inline: false },
                    { name: msgs[1].author.username, value: msgs[1].cleanContent, inline: false },
                    { name: msgs[0].author.username, value: msgs[0].cleanContent, inline: false },
                    { name: msg.author.username, value: msg.cleanContent, inline: false },
                    { name: 'Guild', value: `${msg.channel.guild.name}\n(${msg.channel.guild.id})`, inline: true },
                    { name: 'Channel', value: `#${msg.channel.name}\n(${msg.channel.id})`, inline: true },
                    { name: 'Msg', value: `(${msg.id})`, inline: true }
                  ]
                }]
              }).then(self.deleteWebhook(w.id, w.token))
            })
          })
        } else { log.err('Invalid config, "notificationChannelID". Must be a channel ID from a server you are in.', 'Mention Stalker'); process.exit() }
      }
      return
    }
    return
  })
}
