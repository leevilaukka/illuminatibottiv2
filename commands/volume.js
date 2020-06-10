module.exports = {
    name: "volume",
    description: "",
    execute(message, args, settings, client) {
        const volume = args[0];
        if(!client.dispatcher){
            return
        }
        if(!volume){
           return message.channel.send(`Nykyinen äänenvoimakkuus: ${(settings.volume*100).toFixed(1)} %`)
        }
        client.dispatcher.setVolume(volume);
        message.channel.send(`Äänenvoimakkuus muutettu: ${(volume*100).toFixed(1)} %`)
    }
};