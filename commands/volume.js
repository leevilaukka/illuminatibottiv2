module.exports = {
    name: "volume",
    description: "",
    execute(message, args, settings, client) {
        let volume = args[0];
        if(!client.dispatcher){
            return
        }
        if(!volume){
           return message.channel.send(`Nykyinen äänenvoimakkuus: ${(settings.volume*100).toFixed(1)} %`)
        }
        if(isNaN(volume)){
            return message.reply(`äänenvoimakkuuden tulee olla numero`)
        }
        if(volume > 2) {
            volume = 2;
            message.channel.send("Asetus liian suuri, äänenvoimakkuus rajoitettu 200%");
        }
        client.dispatcher.setVolume(volume);
        message.channel.send(`Äänenvoimakkuus muutettu: ${(volume*100).toFixed(1)} %`)
    }
};