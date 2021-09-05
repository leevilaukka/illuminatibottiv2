import Command from "../../../types/IlluminatiCommand";
import { IlluminatiEmbed } from "../../../structures";

const command: Command = {
    name: "gif",
    description: "Send random GIF from GIPHY",
    async execute(message, args, settings, client) {
        client.axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHYAPI}&tag=&rating=g`)
        .then(async res => {
            const gif = res.data.data.images.original.url

            new IlluminatiEmbed(message, client, {
                title: "Satunnainen GIF",
                image: {
                    url: gif
                }
            }).send()
        })
    }
}

export default command