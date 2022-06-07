import { EmbedFieldData, Formatters } from 'discord.js'
import { IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: "flight",
    async run(message, args, settings, client) {
        const icao = args[0]
        client.axios.get(`http://api.aviationstack.com/v1/flights?access_key=${process.env.AS_APIKEY}&flight_icao=${icao}`)
        .then(res => {
            const data = res.data.data[1] || res.data.data[0]
            console.log(res)

            if(!data) {
                return message.reply("lentoa ei löytynyt!");
            }

            const fields: EmbedFieldData[] = [
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
                    value: `Korkeus: ${data.live.altitude}\nSuunta: ${data.live.direction}°\nMaanopeus: ${data.live.speed_horizontal / 1.852} kts\nPäivitetty viimeksi: ${toTimestamp(data.live.updated, "since", 1000)}`
                })
            }

            const embed = new IlluminatiEmbed(message, client, {
                title: ":airplane:",
                fields
            })

            embed.send()
        })
    }
}
export default command