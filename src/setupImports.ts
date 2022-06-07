import fs from "fs"
import registerInteractions from "./helpers/interactions/registerInteractions";
import { IlluminatiClient } from "./structures";
import { ErrorWithStack } from "./structures/errors";
import Command from "./types/IlluminatiCommand";

type EventType = (client: IlluminatiClient, ...args: any[]) => void;

// Import events
const eventFolders = fs.readdirSync(`${__dirname}/events/`)

export const eventImports = async (client: IlluminatiClient) => {
    console.group("Loading events...");
    console.time("events");
    try {
        for await (const innerFolder of eventFolders) {
            console.group(`Loading events from events/${innerFolder}/`);
            const eventFiles = fs.readdirSync(`${__dirname}/events/${innerFolder}`).filter((file: string) => file.endsWith(".js"));
            for await (const file of eventFiles) {
                import(`${__dirname}/events/${innerFolder}/${file}`).then(({ default: evt }: { default: EventType }) => {
                    let evtName = file.split(".")[0];
                    client.on(evtName, evt.bind(null, client));
                    if (client.isDevelopment) console.log(`Loaded and bound ${innerFolder}Evt: ${evtName}`);
                })
            }
            console.groupEnd();
        }
        console.groupEnd();

    } catch (error) {
        throw new ErrorWithStack(error);
    }
    console.groupEnd();
    console.timeEnd("events");
};

// Command import
const commandFolders = fs.readdirSync(`${__dirname}/actions/commands/`)

export const commandImports = async (client: IlluminatiClient) => {
    console.group("Loading commands...");
    console.time("Loaded commands");
    try {
        for await (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`${__dirname}/actions/commands/${folder}`)
                .filter((file: string) => file.endsWith(".js"));

            console.group(`Loading commands from ${folder}...`);
            for await (const file of commandFiles) {
                console.group();
                import(`${__dirname}/actions/commands/${folder}/${file}`).then(async ({ default: command }: { default: Command }) => {
                    IlluminatiClient.commands.set(command.name, command);
                    console.log(`Loaded cmd: ${folder}/${file}`);
                    await command.onInit?.(client);
                }).catch(err => {
                    throw new ErrorWithStack(`Command ${file} failed to load.\n${err}`)
                })
                console.groupEnd();
            }
            console.groupEnd();
        };
    } catch (error) {
        throw new ErrorWithStack(error);
    }
    console.groupEnd();
    console.timeEnd("Loaded commands");
};


const interactionFiles = fs.readdirSync(`${__dirname}/actions/interactions/`).filter((file: string) => file.endsWith(".js"));

export const interactionImports = async (client: IlluminatiClient) => {
    try {
        console.group("Loading interactions...");
        for await (const file of interactionFiles) {
            import(`${__dirname}/actions/interactions/${file}`).then(({ default: interaction }) => {
                IlluminatiClient.interactions.set(interaction.data.name, interaction);
                console.log(`Loaded interaction: ${file}`);
            })
        }
        registerInteractions(client).then(() => console.log(`Interactions registered!`))
        console.groupEnd();
    } catch (error) {
        throw new ErrorWithStack(error);
    }
};

export default async (client: IlluminatiClient) => {
    await Promise.all([
        eventImports(client),
        commandImports(client),
        interactionImports(client)
    ]).catch(err => {
        throw new ErrorWithStack(err);
    });

    return
};