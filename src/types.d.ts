+import {
    AutocompleteInteraction,
    ButtonInteraction,
    Channel,
    CommandInteraction,
    Guild,
    Message,
    MessageComponentInteraction,
    MessageInteraction,
    PermissionResolvable,
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
    queue: GuildQueue;
};

type CommandResponse =
    | string
    | { embed: any }
    | { content: string; embed: any }
    | Message<true | false>
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
    enableSlash?: boolean;
    outOfOrder?: boolean;
    options?: SlashOptions[];
    permissions?: PermissionResolvable[];
    ownerOnly?: boolean;
    evalSchema?: AnyZodObject;
    autocomplete?: (
        client: IlluminatiClient,
        interaction: AutocompleteInteraction
    ) => Promise<any>;
    interactionRun?: (
        client: IlluminatiClient,
        interaction: CommandInteraction
    ) => Promise<any>;
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

interface SlashCommand {
    data: any;
    execute: (
        client: IlluminatiClient,
        interaction: CommandInteraction
    ) => Promise<any>;
    autocomplete?: (
        client: IlluminatiClient,
        interaction: AutocompleteInteraction
    ) => Promise<any>;        
}

type Interactions =
    | CommandInteraction
    | MessageInteraction
    | ButtonInteraction
    | SelectMenuInteraction
    | MessageComponentInteraction;
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
