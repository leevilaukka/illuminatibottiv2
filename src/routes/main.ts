import express from "express";
const router = express.Router();

router.get("/status", ({client, queue}, res) => {
    res.json({
        status: "online",
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        channels: client.channels.cache.size,
        uptime: client.uptime,
        isDevelopment: client.isDevelopment,
        queue: queue,
    });
});


export default router;