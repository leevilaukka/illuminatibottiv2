import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction} from "discord.js";
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction";
import md5 from "md5";

const data = new SlashCommandBuilder()
    .setName("marvel")
    .setDescription("Hae tietoa Marvel Universumin hahmoista.")
    /*.addStringOption(option => 
        option
            .setName("type")
            .setDescription("Tiedon tyyppi")
            .setRequired(true)
            .addChoice("sarjakuvat", "comics")
            .addChoice("hahmot", "characters")
            .addChoice("tarinat", "stories")
            .addChoice("sarjat", "series")
            .addChoice("tapahtumat", "events")
            .addChoice("luojat", "creators")
    )*/
    .addStringOption(option =>
        option
            .setName("query")
            .setDescription("Haku")
            .setRequired(true)
    ).toJSON();

const interaction: IlluminatiInteraction = {
    data,
    execute(data: CommandInteraction, client) {
        const query = data.options.getString("query");

        const apikey = process.env.MARVELPUBLICKEY
        const privatekey = process.env.MARVELPRIVATEKEY;

        const ts = new Date().getTime();
        const salt = md5(ts.toString() + privatekey + apikey);

        axios.get(`https://gateway.marvel.com/v1/public/characters?name=${query}&apikey=${apikey}&hash=${salt}&ts=${ts}`)
            .then(res  => {
                const result = res.data.data.results[0];
                
                if (!result) {
                    return data.reply({content: "Tuolla nimellä ei löytynyt yhtään hahmoa :cry:", ephemeral: true});
                }

                const embed = {
                    title: result.name,
                    url: result.urls[1].url,
                    description: result.description,
                    thumbnail: {
                        url: result.thumbnail.path
                    },
                    fields: [
                        {
                            name: "Sarjakuvien määrä",
                            value: result.comics.available.toString(),
                            inline: false
                        },
                        {
                            name: "Sarjojen määrä",
                            value: result.series.available.toString(),
                            inline: false
                        },
                        {
                            name: "Tapahtumien määrä",
                            value: result.events.available.toString(),
                            inline: false
                        },
                        {
                            name: "Tarinoiden määrä",
                            value: result.stories.available.toString(),
                            inline: false
                        },
                    ]
                }

                data.reply({embeds: [embed]});
                console.log(result)
            }).catch(err => {
                console.log(err);
            }
        );
    }
    
}

export default interaction;
