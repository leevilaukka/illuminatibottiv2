import axios from "axios";
import Command from "../../types/IlluminatiCommand";
import { IlluminatiEmbed } from "../../structures";

const command: Command = {
    name: "gif",
    description: "Send random GIF from GIPHY",
    execute(message, args, settings, client, interaction) {
        axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHYAPI}&tag=&rating=g`)
        .then(res => {
            const gif = res.data.data.images.original.url

            const embed = new IlluminatiEmbed(message, {
                title: "Satunnainen GIF",
                image: {
                    url: gif
                }
            }, client)

            embed.send()
        })
    }
}

export default command