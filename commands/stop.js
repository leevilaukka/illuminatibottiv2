module.exports = {
    name: "stop",
    description: "",
    execute(message, args, settings, client) {
        if(!client.dispatcher){
            return message.channel.send("Botti ei soita mitään millään kanavalla")
        }
        client.voiceConnection.disconnect();
        message.channel.send("Lopetettu!")
    }
};