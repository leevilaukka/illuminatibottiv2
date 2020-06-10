module.exports = {
    name: "resume",
    description: "",
    execute(message, args, settings, client) {
        if(!client.dispatcher || !client.dispatcher.paused){
            return
        }
        client.dispatcher.resume();
        message.channel.send("Jatkuu!")
    }
};