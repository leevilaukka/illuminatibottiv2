import { IlluminatiEmbed } from '../../../structures'
import Command from '../../../types/IlluminatiCommand'
import { toTimestamp } from '../../../utils'

interface TempData {

    comment: string
    contact: string
    sensors: {
        meta: {
            name: string
            lat: number
            lon: number
        }
        data: {
            time: string
            temp_air: number
            temp_water: number
        }[]
    }[]

}

const command: Command = {
    name: 'watertemp',
    aliases: ["vesi"],
    execute(message, args, settings, client) {
        client.axios.request<TempData>({ url: `https://iot.fvh.fi/opendata/uiras/uiras2_v1.json` })
            .then(res => {
                const { data } = res
                const fields = []
                for(const sensor in data.sensors) {
                    const sensorData = data.sensors[sensor]
                    const { meta, data: sData } = sensorData

                    fields.push({
                        name: `${meta.name}`,
                        value: `Ilma: ${sData[sData.length - 1].temp_air.toFixed(2)}°C, Vesi: ${sData[sData.length - 1].temp_water.toFixed(2)}°C`
                    })
                }

                new IlluminatiEmbed(message, client, {
                    title: 'Helsingin uimapaikkojen lämpötilat',
                    description: "Tiedot päivitetty viimeisen 30min - 1h aikana",
                    fields
                }, ).send()
            })
    }
}

export default command