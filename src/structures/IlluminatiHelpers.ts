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

// Get random item from array
export const randomArray = <T extends unknown[]>(arr: T): T[number] => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
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
    return hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2);
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
