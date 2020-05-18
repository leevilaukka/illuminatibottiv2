const axios = require("axios");
// Require helper functions
const umlautFix = require("../helpers/umlautRemover");
const argsToString = require("../helpers/argsToString");
const formatDate = require("../helpers/formatDate");

module.exports = {
    name: "weather",
    description: "Reaaliaikaiset säätiedot",
    aliases: ["sää","w"],
    cooldown: 5,
    usage: "<kaupunki>",
    execute(message, args) {
        // Parse query string
        const query = umlautFix(argsToString(args));
        // Dynamically get OpenWeatherMap API
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.OWM_API}&lang=fi&units=metric`)
            .then(res => {
                // Variables
                const weather = res.data.weather[0];
                const main = res.data.main;
                // Init embed
                const data = {
                    embed: {
                        title: `Kaupungin ${res.data.name}, ${res.data.sys.country} sää`,
                        description: `**${weather.description}**`,
                        color: 0x32a895,
                        footer: {
                            icon_url: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
                            text: "Sää"
                        },
                        timestamp: Date.now(),
                        // Data fields for embed
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
                    }
                };
                // Send embed
                message.channel.send(data);
            })
            // Catch and log errors
            .catch(e => console.error(e))
    }
};