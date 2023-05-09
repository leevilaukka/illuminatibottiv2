import { IlluminatiEmbed } from '../../../structures'
import { Command } from "../../../types"

interface TempData {
    comment: string
    contact: string
    sensors: {
        meta: {
            name: string
            lat: number
            lon: number,
            servicemap_url: string
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
    async run(message, args, settings, client, {guild}) {
        client.axios.request<TempData>({ url: `https://iot.fvh.fi/opendata/uiras/uiras2_v1.json` })
            .then(res => {
                const { data } = res
                const fields = []
                let sensors = []
                
                for(const sensor in data.sensors) {
                    const sensorData = data.sensors[sensor]
                    const { meta, data: sData } = sensorData

                    sensors.push({meta, data: sData[sData.length - 1]})
                }

                console.log(sensors)

                sensors.sort((a, b) => {
                    if(a.data.temp_water > b.data.temp_water) return -1
                    if(a.data.temp_water < b.data.temp_water) return 1
                    return 0
                }).map(sensor => {
                    const { meta, data } = sensor
                    fields.push({
                        name: `${meta.name}`,
                        value: `🏖️: ${Math.round(data.temp_air)} °C || 💧: ${Math.round(data.temp_water)} °C ${meta.servicemap_url ? `| [Kartta](${meta.servicemap_url})` : ""} ${meta.site_url ? `| [Nettisivut](${meta.site_url})` : ""}`
                    })
                })
                
                

                new IlluminatiEmbed(message, client, {
                    title: 'Helsingin uimapaikkojen lämpötilat',
                    description: "Tiedot päivitetty viimeisen 30min - 1h aikana",
                    fields
                }).send()
            })
    }
}

export default command