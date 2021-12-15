export type Config = {
  token: string,
  devServerID: string,
  ownerID: string,
  defaultSettings: GuildSettings
}

type Place = {
  name: string,
  coords: {
    lat: number,
    lon: number
  }
}

export type GuildSettings = {
  prefix: string,
  volume: string,
  randomMessages: boolean,
  mcdefaults: {
    action: string,
    host: string
  },
  throws: string[],
  places: Place[],
  disabledCommands: string[]
}


const config: Config = {
  token: process.env.TOKEN,
  devServerID: process.env.DEVSERVERID,
  ownerID: process.env.OWNERID,
  defaultSettings: {
    prefix: "*",
    volume: "1",
    randomMessages: false,
    mcdefaults: {
      action: "status",
      host: process.env.MCHOST,
    },
    places: [],
    throws: [
      "https://i.imgur.com/qrzJlKR.jpg",
      "https://i.imgur.com/K5WcvWk.png",
      "https://i.imgur.com/4FEtyd9.png",
      "https://i.imgur.com/f0jDgS9.png",
      "https://i.imgur.com/f0jDgS9.png",
      "https://i.imgur.com/ls7jWCt.png",
      "https://i.imgur.com/vlMWwEk.png",
      "https://i.imgur.com/avQq1Yv.png",
      "https://i.imgur.com/3LzycVP.png",
      "https://i.imgur.com/ZsUP3qK.png",
      "https://i.imgur.com/GxzvpmA.png",
      "https://i.imgur.com/gkr54q4.png",
      "https://i.imgur.com/OeAd8mK.png",
    ],
    disabledCommands: [],
  },
};
export default config