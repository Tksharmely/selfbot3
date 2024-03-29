/*
  Ban. Bans a user from a guild. Can input a mention, ID or name. Can specify how many days of messages to delete. (Needs "Ban Members" permission)
  "ban @user 3" will ban "user" and delete 3 days of their messages (Will only accept number of days between 1 - 9) (Default is 3)
*/
module.exports = (self) => {
  self.registerCommand('ban', function (msg, args) {
    if (!args[0]) return this.self.createMessage(msg.channel.id, 'Need to specify a name, an ID or mention the user.')

    let user = this.findMember(msg, args[0])
    if (!user) return this.self.createMessage(msg.channel.id, 'That is not a valid guild member. Need to specify a name, an ID or mention the user.')
    let deleteDays = /\d{1}/.test(args[1]) ? parseInt(args[1], 10) : 3

    msg.channel.guild.banMember(user.id, deleteDays)
    .then(() => this.self.createMessage(msg.channel.id, `🔨 - *Dropped the hammer on ${user.username}#${user.discriminator}* (Deleted ${deleteDays} days)`))
    .catch((err) => { this.log.err(err, 'Ban'); this.self.createMessage(msg.channel.id, `Could not ban ${user.username}.`) })
  }, {
    perms: ['banMembers'],
    noPms: true
  })
}
