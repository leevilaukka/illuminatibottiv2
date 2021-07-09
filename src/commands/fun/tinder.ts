import { default as axios } from "axios";
import Discord from "discord.js";
import IlluminatiEmbed from "../../structures/IlluminatiEmbed";
import fs from "fs";
import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "tinder",
    description: "Tinder-äänestys",
    args: true,
    usage: "<määrä> <token> <aika>",
    cooldown: 10,
    async execute(message, args: any, settings, client, interaction) {
        message.delete()
        let [maxCount, token, timeout] = args;
        let easyMode;
        maxCount = maxCount - 1;
        maxCount < 1 ? maxCount = 1 : maxCount = maxCount;

        const config = { 
            headers: {
                'X-Auth-Token': token
            }
        }

        axios.get(`https://api.gotinder.com/v2/fast-match/preview`,{   
            headers: {
                'X-Auth-Token': token
            },
            responseType: "stream"
        })
        .then(res => {
            // Fs writestream path and writer
            const path = './pipes/tinder.png';
            const writer = fs.createWriteStream(path);

            // Pipe photo to writer
            res.data.pipe(writer);
            writer.on("finish", async () => {
                // Additional variables for new embed
                const file = new Discord.MessageAttachment('./pipes/tinder.png');
                !easyMode ? easyMode = await message.channel.send("Tästä helppo match, jos tulee vastaan.", {files: [file]}) : easyMode = null;
                fs.unlink(path, () => {return})
            })
        })
       

        const { data: { data: { results } } } = await axios.get("https://api.gotinder.com/v2/recs/core?locale=en", config)
        
        const createNewVote = (count = 0) => {
            const current = results[count];

            const currentAge = new Date().getFullYear() - new Date(current.user.birth_date).getFullYear()

            const interests = current.experiment_info?.user_interests.selected_interests.map((interest) => {
                if(interest.is_common) {
                    return `**${interest.name}**`
                } else return interest.name
            })

            let fields = [{
                name: "Etäisyys (km)",
                value: Math.floor(current.distance_mi * 1.609),
                inline: true
            }, {
                name: "Ikä",
                value: currentAge,
                inline: true
            }]

            if(current.experiment_info?.user_interests.selected_interests.length > 0) {
                fields.push({
                    name: "Kiinnostukset",
                    value: interests,
                    inline: false
                })
            }
            
            if (current.user.schools.length > 0) {
                fields.push({
                    name: "Koulu",
                    value: current.user.schools[0]?.name,
                    inline: false
                })
            }

            if (current.user.jobs.length > 0) {
                fields.push({
                    name: "Työpaikka",
                    value: current.user.jobs[0]?.name,
                    inline: false
                })
            }

            const embed = new IlluminatiEmbed(message, {
                title: `${current.user.recently_active ? ":green_circle: " : ""}${current.user.name}`,
                description: current.user.bio,
                image:{
                    url: current.user.photos[0].url
                },
                fields,
            }, client)

            message.channel.send({ embed }).then(async (tMessage) => {
                await tMessage.react('👍');
                await tMessage.react('👎');

                const filter = (reaction, user) => {
                    return ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;
                };

                tMessage.awaitReactions(filter, { time: timeout ? timeout * 1000 : 10000 })
                    .then(collected => {
                        // Lähetä request
                        const likeCount = collected.get("👍") ? collected.get("👍").count - 1 : 0
                        const nopeCount = collected.get("👎") ? collected.get("👎").count - 1 : 0
                        
                        if(likeCount > nopeCount) {
                            // LIKE
                            axios.get(`https://api.gotinder.com/like/${current.user._id}`, config).then(({data}) => {
                                data.match && message.channel.send(`${current.user.name} osui :D!`)
                            })
                        } else if(nopeCount > likeCount) {
                            // PASS
                            axios.get(`https://api.gotinder.com/pass/${current.user._id}`, config)
                        } 

                        if(maxCount > count) {
                            tMessage.delete()
                            createNewVote(count + 1)
                        } else return message.channel.send("Se oli siinä!").then(m => {
                            tMessage.delete()
                            easyMode.delete()
                            setTimeout(() => m.delete(), 5000)
                        })
                    })
                    .catch(collected => {
                        console.error(collected)
                    });
            })
        }
        createNewVote();
    }
}

export default command