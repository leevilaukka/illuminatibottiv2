import express from "express";

const router = express.Router();

router.get("/", ({client}, res) => {
    res.json({
        guilds: client.guilds.cache.map(g => g.toJSON()),
    });
});

router.get("/:id", ({client, params}, res) => {
    const guild = client.guilds.cache.get(params.id);
    
    if (!guild) {
        return res.status(404).json({
            error: "Guild not found",
        });
    }

    res.json({
        guild: guild.toJSON(),
    });
});

router.get("/:id/channels", ({client, params}, res) => {
    const guild = client.guilds.cache.get(params.id);

    if (!guild) {
        return res.status(404).json({
            error: "Guild not found",
        });
    }

    res.json({
        channels: guild.channels.cache.map(c => c.toJSON()),
    });
});

router.get("/:id/channels/:channelID", ({client, params}, res) => {
    const guild = client.guilds.cache.get(params.id);
    
    if (!guild) {
        return res.status(404).json({
            error: "Guild not found",
        });
    }

    const channel = guild.channels.cache.get(params.channelID);

    if (!channel) {
        return res.status(404).json({
            error: "Channel not found",
        });
    }

    res.json({
        channel: channel.toJSON(),
    });
});

export default router;