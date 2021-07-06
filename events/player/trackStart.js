module.exports = (_client, message, track) => {
    message.channel.send(`Nyt toistetaan ${track.title}`)
}