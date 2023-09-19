import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../../models";
import { AnyZodObject, z } from "zod";

const checkQueue: RequestHandler = async (req, res, next) => {
    const guildID = String(req.body.guildID || req.params.id);

    const queue = req.client.player.nodes.get(guildID);

    req.client.logger.log(`[API] Queue for ${guildID} is ${queue}`);

    if (!queue) {
        return res.status(206).json({
            error: "No queue found",
        });
    }

    req.queue = queue;

    next();
};

const checkGuild: RequestHandler = (req, res, next) => {
    const guild = req.client.guilds.cache.get(
        req.params.id || req.body.guildID
    );

    if (!guild) {
        return res.status(206).json({
            error: "Guild not found in cache",
        });
    }

    req.guild = guild;

    next();
};

const checkChannel: RequestHandler = (req, res, next) => {
    const channel = req.guild.channels.cache.get(
        req.params.channelID || req.body.channelID
    );

    if (!channel) {
        return res.status(206).json({
            error: "Channel not found.",
        });
    }

    req.channel = channel;

    next();
};

const linkUser: RequestHandler = async (req, res, next) => {
    if (!req.params.userID && !req.body.userID) {
        next(); 
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

const validate =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            return res.status(400).json(error);
        }
    };

    



export { checkQueue, checkGuild, checkChannel, linkUser, validate };
