const { default: axios } = require("axios");
const IlluminatiEmbed = require("../../structures/IlluminatiEmbed");
const { options } = require("./reddit");

module.exports = {
    name: "tinder",
    description: "Tinder-äänestys",
    args: true,
    usage: "<määrä> <token> <aika>",
    cooldown: 10,
    async execute(message, args, settings,client, interaction) {
        message.delete()
        let [maxCount, token, timeout] = args;
        maxCount = maxCount - 1;
        maxCount < 1 ? maxCount = 1 : maxCount = maxCount;

        const config = { 
            headers: {
                'X-Auth-Token': token
            }
        }

        const { data: { data: { results } } } = await axios.get("https://api.gotinder.com/v2/recs/core?locale=en", config)
        
        const createNewVote = (count = 0) => {
            const current = results[count];

            const currentAge = new Date().getFullYear() - new Date(current.user.birth_date).getFullYear()
            let fields = [{
                name: "Etäisyys (km)",
                value: Math.floor(current.distance_mi * 1.609) 
            }, {
                name: "Ikä",
                value: currentAge
            }]
            
            if (current.user.schools.lenght > 0) {
                fields.push({
                    name: "Koulu",
                    value: current.user.schools[0]?.name
                })
            }

            if (current.user.jobs.lenght > 0) {
                fields.push({
                    name: "Työpaikka",
                    value: current.user.jobs[0]?.name
                })
            }

            const embed = new IlluminatiEmbed(message, {
                title: current.user.name,
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
                            axios.get(`https://api.gotinder.com/like/${current.user._id}`, config)
                        } else if(nopeCount > likeCount) {
                            axios.get(`https://api.gotinder.com/pass/${current.user._id}`, config)
                        } 

                        if(maxCount > count) {
                            tMessage.delete()
                            createNewVote(count + 1)
                        } else return message.channel.send("se oli siinä!").then(m => {
                            tMessage.delete()
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