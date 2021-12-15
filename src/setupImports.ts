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
    try {
        for await (const file of eventFiles) {
            import(`${__dirname}/events/discord/${file}`).then(({ default: evt }) => {
                let evtName = file.split(".")[0];
                if (client.isDevelopment) console.log(`Loaded discordEvt: ${evtName}`);
                client.on(evtName, evt.bind(null, client));
            })
        }
    
        for await (const file of playerEventFiles) {
            import(`${__dirname}/events/player/${file}`).then(({ default: evt }) => {
                console.log(evt)
                let evtName: any = file.split(".")[0];
                if (client.isDevelopment) console.log(`Loaded playerEvt: ${evtName}`);
                client.player.on(evtName, evt.bind(null, client));
            })
        }
    } catch (error) {
        console.error(error)
    }
    console.groupEnd();
};

// Command import
const commandFolders = fs.readdirSync(`${__dirname}/actions/commands/`)

export const commandImports = async (client: IlluminatiClient) => {
    console.group("Loading commands...");
    for await (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`${__dirname}/actions/commands/${folder}`)
            .filter((file: string) => file.endsWith(".js"));

        for await (const file of commandFiles) {
            import(`${__dirname}/actions/commands/${folder}/${file}`).then(({ default: cmd }) => {
                const command: Command = cmd
                client.commands.set(command.name, command);
                console.log(`Loaded cmd: ${folder}/${file}`);
            }).catch(console.error)
        }
    };
    console.groupEnd();
};


const interactionFiles = fs.readdirSync(`${__dirname}/actions/interactions/`).filter((file: string) => file.endsWith(".js"));

export const interactionImports = async (client: IlluminatiClient) => {
    for await (const file of interactionFiles) {
        import(`${__dirname}/actions/interactions/${file}`).then(({ default: interaction }) => {
            client.interactions.set(interaction.data.name, interaction);
        })
            .then(() => registerInteractions(client).then(() => console.log(`Interactions registered!`)))
            .catch(console.error)
    }
};

export const setupImports = async (client: IlluminatiClient) => {
    await eventImports(client);
    await commandImports(client);
    await interactionImports(client);
    return;
};