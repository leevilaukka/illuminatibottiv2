import {
    AutocompleteInteraction,
    ButtonInteraction,
    Channel,
    CommandInteraction,
    ContextMenuCommandBuilder,
    Guild,
    Message,
    MessageComponentInteraction,
    MessageInteraction,
    PermissionResolvable,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SelectMenuInteraction,
    SlashCommandAttachmentOption,
    SlashCommandBuilder,
    User,
} from "discord.js";
import { RawInteractionData } from "discord.js/typings/rawDataTypes";
import { Categories } from "IlluminatiCommand";
import { GuildSettings } from "./config";
import {
    IlluminatiClient,
    IlluminatiGuild,
    IlluminatiUser,
} from "./structures";
import GuildFunctions from "./structures/IlluminatiGuild";
import UserFunctions, {
    IlluminatiUserTypes,
} from "./structures/IlluminatiUser";
import { GuildQueue } from "discord-player";
import { AnyZodObject, ZodAny, ZodAnyDef, ZodArray, z } from "zod";
import { PlayerQueue } from "PlayerMetadata";

type BotError = {
    error: Error;
    message: string;
};

type EventType = (client: IlluminatiClient, ...args: any[]) => void;

// DHL API response types

type DHLAddress = {
    countryCode: string;
    postalCode: string;
    addressLocality: string;
};

type DHLDetails = {
    product: {
        productName: string;
    };
    weight: {
        value: number;
        unitText: string;
    };
    references: [
        {
            [key: string]: string;
        }
    ];
};

type DHLShipment = {
    id: string;
    service: string;
    origin: {
        address: DHLAddress;
    };
    destination: {
        address: DHLAddress;
    };
    status: {
        timestamp: string;
        statusCode: string;
        status: string;
    };
    details: DHLDetails;
    events: [
        {
            timestamp: string;
            statusCode: string;
            status: string;
        }
    ];
};

type DHLResponse = {
    shipments: DHLShipment[];
};

// Command types

type CommandArguments = string[];

type ArgTypes = ("string" | "number")[];

type SlashOptions = {
    name: string;
    type: string;
    description: string;
    required?: boolean;
};

//** Metadata for a command, guild and user settings */
type CommandMeta = {
    guild: IlluminatiGuild<Guild>;
    user: IlluminatiUser<User>;
    queue: GuildQueue<{
        channel: Channel;
        author?: User;
        message?: Message;
        command?: Command;
        fromAPI?: boolean;
        guild?: Guild;
        queueHidden?: boolean;
    }>;
};

type CommandResponse =
    | string
    | { embed: any }
    | { content: string; embed: any }
    | Message
    | void;

interface Command {
    name: string;
    aliases?: string[];
    description?: string;
    guildOnly?: boolean;
    args?: boolean;
    usage?: string;
    category: Categories | keyof typeof Categories;
    cooldown?: number;
    outOfOrder?: boolean;
    options?: SlashOptions[];
    permissions?: PermissionResolvable[];
    ownerOnly?: boolean;
    evalSchema?: AnyZodObject;
    run: (
        message: Message,
        args: any[],
        settings: GuildSettings,
        client: IlluminatiClient,
        meta: CommandMeta
    ) => Promise<CommandResponse>;
    onInit?: (client: IlluminatiClient) => void;
    cleanUp?: (client: IlluminatiClient) => void;
}

type CommandBuilders = SlashCommandBuilder | ContextMenuCommandBuilder;
type CommandJSONBodyTypes = RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIApplicationCommandsJSONBody;


interface SlashCommand<InteractionType = CommandInteraction> {
    data: CommandBuilders | CommandJSONBodyTypes;
    execute: (
        client: IlluminatiClient,
        interaction: InteractionType
    ) => Promise<any>;
    autocomplete?: (
        client: IlluminatiClient,
        interaction: AutocompleteInteraction
    ) => Promise<any>;        
}

// Express types
declare global {
    namespace Express {
        interface Request {
            client?: IlluminatiClient;
            queue?: GuildQueue;
            guild?: Guild;
            channel?: Channel;
            user: {
                discordUser: User;
                dbUser: IlluminatiUserTypes;
            };
        }
    }

    export interface Number {
        times: (callback: (i: number) => void) => void;
    }
}
