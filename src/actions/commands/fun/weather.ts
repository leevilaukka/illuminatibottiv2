import { umlautRemover, argsToString, formatDate } from "../../../helpers";
import { IlluminatiEmbed } from "../../../structures";

import Command, { Categories } from '../../../types/IlluminatiCommand'

interface WeatherData {
    weather: {
        description: string;
        icon: string;
    }[]
    main: {
        temp: number
        pressure: number
        humidity: number
        temp_min: number
        temp_max: number
        feels_like: number
    }
    wind: {
        speed: number
        deg: number
    }
    clouds: {
        all: number
    }
    sys: {
        sunrise: number
        sunset: number
        country: string
    }
    timezone: number
    name: string
    code: number
    message: string
    success: boolean
}


const command: Command = {
    name: "weather",
    description: "Säätiedot",
    aliases: ["w", "sää"],
    cooldown: 10,
    category: Categories.other,
    async run(message, args, settings, client) {
        const query = umlautRemover(argsToString(args));
        client.axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.OWM_API}&lang=fi&units=metric`)
            .then(res => {
                const weather = res.data.weather[0];
                const main = res.data.main;
                let fields = [
                    {
                        name: "Lämpötila :thermometer:",
                        value: main.temp + " °C",
                    },
                    {
                        name: "Minimi :arrow_down:",
                        value: main.temp_min + " °C",
                        inline: true
                    },
                    {
                        name: "Maksimi :arrow_up:",
                        value: main.temp_max + " °C",
                        inline: true
                    },
                    {
                        name: "Tuntuu kuin :thermometer_face:",
                        value: main.feels_like + " °C",
                        inline: true
                    },
                    {
                        name: "Ilmankosteus :sweat_drops:",
                        value: main.humidity + "%",
                        inline: true
                    },
                    {
                        name: "Ilmanpaine :compression:",
                        value: main.pressure + " hPa",
                        inline: true
                    },
                    {
                        name: "Tuuli :wind_blowing_face:",
                        value: `${res.data.wind.speed} m/s @ ${res.data.wind.deg}°`,
                    },
                    {
                        name: "Pilvisyys :cloud:",
                        value: `${res.data.clouds.all}%`,
                    },
                ];
                if (res.data.sys.sunrise === res.data.sys.sunset) {
                    fields.push({
                        name: "Auringonnousu ja -lasku",
                        value: "YÖTÖN YÖ"
                    })

                } else {
                    fields.push({
                            name: "Auringonnousu :sunrise:",
                            value: formatDate(res.data.sys.sunrise),
                            inline: true
                        },
                        {
                            name: "Auringonlasku :city_sunset:",
                            value: formatDate(res.data.sys.sunset),
                            inline: true
                        });
                }

                new IlluminatiEmbed(message, client, {
                    title: `Kaupungin ${res.data.name}, ${res.data.sys.country} sää`,
                    description: `**${weather.description}**`,
                    color: 0x32a895,
                    fields,
                    footer: {
                        icon_url: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
                        text: "Sää"
                    },
                    timestamp: Date.now().toString()
                }).send()
            })
            .catch(e => console.error(e))
    }
};

export default command;