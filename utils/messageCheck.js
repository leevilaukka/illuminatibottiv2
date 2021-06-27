const messageCheck = (message) => {
    if (message.content.includes("?")) return message.reply("mutsis");
}

module.exports = {
    messageCheck
}