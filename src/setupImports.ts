import { GuildQueueEvents, Player } from "discord-player";
import express, { RequestHandler } from "express";
import fs from "fs";
import routes from "./api/routes";
import { IlluminatiClient, Errors } from "./structures";
import cors from "cors";
import schedules from "./schedules";
import { Command, EventType, SlashCommand } from "./types";
import { YouTubeExtractor } from "@discord-player/extractor";
import path from "path";

const importMap = {
    player: {
        path: `${__dirname}/events/player/`,
    },
    discord: {
        path: `${__dirname}/events/discord/`,
    },
    process: {
        path: `${__dirname}/events/process/`,
    },
    client: {
        path: `${__dirname}/events/client/`,
    },
};

export const importEvents = (client: IlluminatiClient) => {
    for (const [key, value] of Object.entries(importMap)) {
        const eventFiles = fs
            .readdirSync(value.path)
            .filter((file: string) => file.endsWith(".js"));
        for (const file of eventFiles) {
            import(`${value.path}${file}`).then(
                ({ default: evt }: { default: EventType }) => {
                    let evtName = file.split(".")[0];
                    switch (key) {
                        case "player":
                            client.player.events.on(
                                evtName as keyof GuildQueueEvents,
                                evt.bind(null, client)
                            );
                            break;
                        case "discord":
                            client.on(evtName, evt.bind(null, client));
                            break;
                        case "process":
                            process.on(evtName, evt.bind(null, client));
                            break;
                        case "client":
                            client.events.on(evtName, evt.bind(null, client));
                            break;
                    }

                    if (client.isDevelopment)
                        console.log(`Loaded Evt: ${evtName}`);
                }
            );
        }
    }
};

// Slash command import
const slashCommandFolders = fs.readdirSync(
    `${__dirname}/actions/slashcommands/`
);

export const slashCommandImports = async () => {
    try {
        console.group("Loading slash commands...");
        for await (const folder of slashCommandFolders) {
            const slashCommandFiles = fs
                .readdirSync(`${__dirname}/actions/slashcommands/${folder}`)
                .filter((file: string) => file.endsWith(".js"));
            for await (const file of slashCommandFiles) {
                const command: SlashCommand =
                    require(`${__dirname}/actions/slashcommands/${folder}/${file}`).default;
                IlluminatiClient.slashCommands.set(command.data.name, command);
                console.log(`Loaded slash cmd: ${file}`);
            }
        }
        console.groupEnd();
    } catch (error) {
        console.error(error);
    }
};

// Command import
const commandFolders = fs.readdirSync(`${__dirname}/actions/commands/`);

export const commandImports = async (client: IlluminatiClient) => {
    console.group("Loading commands...");
    console.time("Loaded commands");
    try {
        for await (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`${__dirname}/actions/commands/${folder}`)
                .filter((file: string) => file.endsWith(".js"));

            console.group(`Loading commands from:`, folder);
            for await (const file of commandFiles) {
                console.group();
                import(`${__dirname}/actions/commands/${folder}/${file}`)
                    .then(
                        async ({ default: command }: { default: Command }) => {
                            IlluminatiClient.commands.set(
                                command.name,
                                command
                            );
                            console.log(`Loaded cmd: ${folder}/${file}`);
                            command.onInit?.(client);
                        }
                    )
                    .catch((err) => {
                        throw new Errors.ErrorWithStack(
                            `Command ${file} failed to load.\n${err}`
                        );
                    });
                console.groupEnd();
            }
            console.groupEnd();
        }
    } catch (error) {
        throw new Errors.ErrorWithStack(error);
    }
    console.groupEnd();
    console.timeEnd("Loaded commands");
};

const setupExpress = async (client: IlluminatiClient) => {
    try {
        const app = express();
        const wwwPath = path.join(__dirname, "www");

        console.log(`[Express] Serving static files from ${wwwPath}`);
        app.use(express.static(wwwPath));

        const limiter = require("express-rate-limit")({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: {
                error: "Too many requests, please try again later.",
            },
            legacyHeaders: false,
            standardHeaders: true,
        });

        //app.use("/api", limiter);

        app.use(
            cors({
                origin: "*",
            })
        );

        app.use((req, res, next) => {
            req.client = client;
            next();
        });

        app.use(express.json());

        routes.forEach((route) => {
            app.use(`/api${route.path}`, route.file);
        });

        app.listen(process.env.EXPRESS_PORT || 3000, () => {
            console.log("Express server started!");
        });

        app.setMaxListeners(0);

        return app;
    } catch (error) {
        throw new Errors.ErrorWithStack(error);
    }
};

const initPlayer = async (client: IlluminatiClient) => {
    client.player = new Player(client, {
        ytdlOptions: {
            filter: "audioonly",
            highWaterMark: 1 << 25,
        },
    });
    await client.player.extractors.loadDefault();
    await client.player.extractors.register(YouTubeExtractor, {});
    client.player.setMaxListeners(0);
    console.log("Player initialized!");
};

export default async (client: IlluminatiClient) => {
    await Promise.all([
        importEvents(client),
        commandImports(client),
        initPlayer(client),
        setupExpress(client),
        schedules.importSchedules(client),
        slashCommandImports(),
    ]).catch((err) => {
        throw new Errors.ErrorWithStack(err.message);
    });

    return;
};
