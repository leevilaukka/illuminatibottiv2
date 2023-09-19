import express from "express";
import { checkChannel, checkGuild } from "./middlewares";
import { Channel, ChannelType } from "discord.js";

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

router.get("/:id/channels", checkGuild, async ({ client, params, guild }, res) => {
    const lastUsed = client.channels.cache.get((await new client.guildManager(guild).getGuild()).lastUsedVoiceChannel);

    const voiceFilter = (c: Channel) => c.type === ChannelType.GuildVoice

    return res.json({
        text: guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).map((c) => c.toJSON()),
        voice: guild.channels.cache.filter(voiceFilter).map((c) => c.toJSON()),
        lastUsed: lastUsed?.toJSON()
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
