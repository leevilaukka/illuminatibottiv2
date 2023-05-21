import express from "express";
import { checkChannel, checkGuild } from "./middlewares";
import { ChannelType } from "discord.js";

const router = express.Router();

router.get("/", ({ client }, res) => {
    res.json({
        guilds: client.guilds.cache.map((g) => g.toJSON()),
    });
});

router.get("/:id", checkGuild, ({ client, params, guild }, res) => {
    res.json({
        guild: guild.toJSON(),
    });
});

router.get("/:id/channels", checkGuild, ({ client, params, guild }, res) => {
    res.json({
        text: guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).map((c) => c.toJSON()),
        voice: guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).map((c) => c.toJSON()),
    });
});

router.get(
    "/:id/channels/:channelID",
    checkGuild,
    checkChannel,
    ({ client, params, guild, channel }, res) => {
        res.json({
            channel: channel.toJSON(),
        });
    }
);

export default router;
