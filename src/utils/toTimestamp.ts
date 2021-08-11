import { Formatters, Util } from "discord.js"

export default (time: Date | string | number, format: "mm-dd-yy" | "md-t" | "t" | "mdy" | "full" | "since" | "T", divider?: number) => {
    const formats = [
        {
            long: "mm-dd-yy",
            short: "d"
        },
        {
            long: "md-t",
            short: Formatters.TimestampStyles.ShortDateTime
        },
        {
            long: "t",
            short: "t"
        },
        {
            long: "mdy",
            short: Formatters.TimestampStyles.LongDate
        },
        {
            long: "full",
            short: "F"
        },
        {
            long: "since",
            short: "R"
        },
        {
            long: "T",
            short: "T"
        },
    ]

    
    const unixTime = divider ? new Date(time).getTime() / divider : new Date(time).getTime()
    
    for (let i = 0; i < formats.length; i++) {
        if(formats[i].long === format){
            return `<t:${unixTime}:${formats[i].short}>`
        }
    }
}

