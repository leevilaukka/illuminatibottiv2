import { Message } from "discord.js";
import { translateTable } from "../utils";

/**
 * Clean text
 * @method
 * @param {String} text
 * @returns Clean string
 */

export function clean(text: string): string {
    return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
  
}

export function argsToString(args: string[]): string {
    const regExp = /,/gi;
    return args.toString().replace(regExp, " ")
};

export const randomArray = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
};

export const formatDate = (date: number) => {
    let newDate = new Date(date * 1000);
    // Hours part from the timestamp
    let hours = newDate.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + newDate.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + newDate.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};

export const messageCheck = (message: Message) => {
    if (message.content.includes("?")) return message.reply("mutsis");
}

export const umlautRemover = (str: string) => {
    // umlaut regular expressions
    const umlautA = /ä/gi;
    const umlautO = /ö/gi;

    return str.replace(umlautO, "o").replace(umlautA, "a")
};

export const valueParser = (value: any) => {
    for (let i = 0; i < translateTable.length; i++) {
        if (translateTable[i].original === value) {
            return translateTable[i].parsed;
        }
    }
};
