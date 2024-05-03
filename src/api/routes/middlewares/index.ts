import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../../../models";
import { AnyZodObject, z } from "zod";

const checkQueue: RequestHandler = async (req, res, next) => {
    const guildID = String(req.body.guildID || req.params.id);

    const queue = req.client.player.nodes.get(guildID);

    req.client.logger.log(`[API] Queue for ${guildID} is ${queue}`);

    if (!queue) {
        return next(
            new Error("Queue not found", {
                cause: "Queue not found in cache",
            })
        );
    }

    req.queue = queue;
    next();
};

const checkGuild: RequestHandler = (req, res, next) => {
    const guild = req.client.guilds.cache.get(
        req.params.id || req.body.guildID
    );

    if (!guild) {
        return next(
            new Error("Guild not found", {
                cause: "Guild not found in cache",
            })
        );
    }

    req.guild = guild;
    next();
};

const checkChannel: RequestHandler = (req, res, next) => {
    const channel = req.guild.channels.cache.get(
        req.params.channelID || req.body.channelID
    );

    if (!channel) {
        return next(
            new Error("Channel not found", {
                cause: "Channel not found in cache",
            })
        );
    }

    req.channel = channel;
    next();
};

const linkUser: RequestHandler = async (req, res, next) => {
    if (!req.params.userID || !req.body.userID) {
        return next(new Error("No userID provided"));
    }
    const user = req.client.users.cache.get(
        req.params.userID || req.body.userID
    );

    const dbUser = await User.findOne({ discordID: user.id });

    req.user = {
        discordUser: user,
        dbUser,
    };

    next();
};

const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            return next(error);
        }
    };

export { checkQueue, checkGuild, checkChannel, linkUser, validate };
