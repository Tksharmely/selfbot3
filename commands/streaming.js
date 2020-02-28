/*
  Streaming. Set your status as streaming.
*/
module.exports = (self) => {
  self.registerCommand('streaming', function (msg, args) {
    this.self.editStatus(this.config.defaultStatus.toLowerCase(), {name: args ? args.join('') : 'nothing', type: 1, url: 'https://www.twitch.tv/twitch'})
    this.self.createMessage(msg.channel.id, '👌')
  })
}
