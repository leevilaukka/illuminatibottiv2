import { Formatters } from 'discord.js'
import { IlluminatiEmbed, Errors } from '../../../structures'
import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'

type Field = {
    name: string,
    value: string,
    inline?: boolean
}

const command: Command = {
    name: "flight",
    category: Categories.utility,
    args: true,
    description: "Get information about a flight",
    async run(message, args, settings, client) {
        const icao = args[0]
        client.axios.get(`http://api.aviationstack.com/v1/flights?access_key=${process.env.AS_APIKEY}&flight_icao=${icao}`)
        .then(res => {
            const data = res.data.data[1] || res.data.data[0]
            console.log(res)

            if(!data) {
                return message.reply("lentoa ei löytynyt!");
            }

            const fields: Field[] = [
                {
                    name: "Lähtö",
                    value: `${data.departure.airport} | ${data.departure.icao}\n${Formatters.time(data.departure.actual || data.departure.estimated, "F")})`,
                    inline: true
                },
                {
                    name: "Saapuminen",
                    value: `${data.arrival.airport} | ${data.arrival.icao}\n${Formatters.time(data.arrival.actual || data.arrival.estimated, "F")}`,
                    inline: true
                }
            ];

            if(data.airline) {
                fields.unshift({
                    name: "Lentoyhtiö",
                    value: `${data.airline.name} | ${data.airline.icao}`
                })
            }

            if(data.aircraft) {
                fields.push({
                    name: "Lentokone",
                    value: `Rekisteritunnus: ${data.aircraft.registeration}\nICAO: ${data.aircraft.icao}`
                })
            }

            if(data.live) {
                fields.push({
                    name: "Reaaliaikaiset tiedot",
                    value: `Korkeus: ${data.live.altitude}\nSuunta: ${data.live.direction}°\nMaanopeus: ${data.live.speed_horizontal / 1.852} kts\nPäivitetty viimeksi: ${Formatters.time(data.live.updated, "R")}`
                })
            }

            const embed = new IlluminatiEmbed(message, client, {
                title: ":airplane:",
                fields
            })

            embed.send()
                .catch(e => {
                    throw new Errors.BotError(e)
                })
        })
    }
}
export default command