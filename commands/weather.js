const axios = require("axios");

const umlautFix = require("../helpers/umlautRemover");
const argsToString = require("../helpers/argsToString");
const formatDate = require("../helpers/formatDate");

module.exports = {
    name: "weather",
    description: "Säätiedot",
    execute(message, args) {
        const query = umlautFix(argsToString(args));
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.OWM_API}&lang=fi&units=metric`)
            .then(res => {
                const weather = res.data.weather[0];
                const main = res.data.main;

                const data = {
                    embed: {
                        title: `Kaupungin ${res.data.name}, ${res.data.sys.country} sää`,
                        description: `**${weather.description}**`,
                        color: 0x32a895,
                        fields: [
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
                                value:`${res.data.clouds.all}%`,
                            },
                            {
                                name: "Auringonnousu :sunrise:",
                                value: formatDate(res.data.sys.sunrise),
                                inline: true
                            },
                            {
                                name: "Auringonlasku :city_sunset:",
                                value: formatDate(res.data.sys.sunset),
                                inline: true
                            },
                        ],
                        footer: {
                            icon_url: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
                            text: "Sää"
                        },
                        timestamp: Date.now()
                    }
                };
                message.channel.send(data);
            })
            .catch(e => console.error(e) )
    }
};