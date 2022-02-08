import { PlayerEvents } from "discord-player";
import fs from "fs"
import registerInteractions from "./events/interactions/registerInteractions";
import { IlluminatiClient } from "./structures";
import Command from "./types/IlluminatiCommand";

const eventFiles = fs
    .readdirSync(`${__dirname}/events/discord/`)
    .filter((file: string) => file.endsWith(".js"));

const playerEventFiles = fs
    .readdirSync(`${__dirname}/events/player/`)
    .filter((file: string) => file.endsWith(".js"))

export const eventImports = async (client: IlluminatiClient) => {
    console.group("Loading events...");
    console.time("events");
    try {
        console.group("Discord events");
        for await (const file of eventFiles) {
            import(`${__dirname}/events/discord/${file}`).then(({ default: evt }) => {
                let evtName = file.split(".")[0];
                if (client.isDevelopment) console.log(`Loaded discordEvt: ${evtName}`);
                client.on(evtName, evt.bind(null, client));
            }).catch(err => {
                throw new Error(`Error loading event ${file}: ${err}`);
            });
        }
        console.groupEnd();

        console.group("Player events");
        for await (const file of playerEventFiles) {
            import(`${__dirname}/events/player/${file}`).then(({ default: evt }) => {
                let evtName = file.split(".")[0] as keyof PlayerEvents
                if (client.isDevelopment) console.log(`Loaded playerEvt: ${evtName}`);
                client.player.on(evtName, evt.bind(null, client));
            }).catch(err => {
                throw new Error(`Error loading event ${file}: ${err}`);
            });
        }
        console.groupEnd();
    } catch (error) {
        console.error(error)
    }
    console.groupEnd();
    console.timeEnd("events");
};

// Command import
const commandFolders = fs.readdirSync(`${__dirname}/actions/commands/`)

export const commandImports = async (client: IlluminatiClient) => {
    console.group("Loading commands...");
    console.time("Loaded commands");
    for await (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`${__dirname}/actions/commands/${folder}`)
            .filter((file: string) => file.endsWith(".js"));

        console.group(`Loading commands from ${folder}...`);
        for await (const file of commandFiles) {
            console.group();
            import(`${__dirname}/actions/commands/${folder}/${file}`).then(async ({ default: command } : {default: Command}) => {
                IlluminatiClient.commands.set(command.name, command);
                console.log(`Loaded cmd: ${folder}/${file}`);
                await command.onInit?.(client);
            }).catch(err => {
                console.error(`Command ${file} failed to load.\n${err}`)
            })
            console.groupEnd();
        }
        console.groupEnd();
    };
    console.groupEnd();
    console.timeEnd("Loaded commands");
};


const interactionFiles = fs.readdirSync(`${__dirname}/actions/interactions/`).filter((file: string) => file.endsWith(".js"));

export const interactionImports = async (client: IlluminatiClient) => {
    console.group("Loading interactions...");
    for await (const file of interactionFiles) {
        import(`${__dirname}/actions/interactions/${file}`).then(({ default: interaction }) => {
            IlluminatiClient.interactions.set(interaction.data.name, interaction);
            console.log(`Loaded interaction: ${file}`);
        }).catch(console.error)
    }
    registerInteractions(client).then(() => console.log(`Interactions registered!`))
    console.groupEnd();
};


export default async (client: IlluminatiClient) => {
    await eventImports(client);
    await commandImports(client);
    await interactionImports(client);
    return;
};