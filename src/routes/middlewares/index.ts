import { RequestHandler } from "express";

const checkQueue: RequestHandler = async (req, res, next) => {
    const guildID = String(req.params.id || req.body.guildID);

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

    console.log("Check guild: ", guild);
    req.guild = guild;

    next();
};

const checkChannel: RequestHandler = (req, res, next) => {
    const channel = req.guild.channels.cache.get(
        req.params.channelID || req.body.channelID
    );

    if (!channel) {
        return res.status(206).json({
            error: "Channel not found",
        });
    }
    console.log("Check channel: ", channel);
    req.channel = channel;

    next();
};

export { checkQueue, checkGuild, checkChannel };
