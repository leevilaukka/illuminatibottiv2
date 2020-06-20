module.exports = {
    name: "pause",
    description: "",
    category: "music",
    execute(message, args, settings, client) {
    if(!client.dispatcher || client.dispatcher.paused){
        return message.channel.send("Botti on jo tauolla!")
    }
    client.dispatcher.pause(true);
    message.channel.send("Tauko!");
}
};