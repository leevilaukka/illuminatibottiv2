module.exports = {
    name: "pause",
    description: "",
    execute(message, args, settings, client) {
        if(!client.dispatcher || client.dispatcher.paused){
            return
        }
        client.dispatcher.pause(true);
        message.channel.send("Tauko!")
    }
};