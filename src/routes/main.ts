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

router.get("/ping", ({client}, res) => {
    res.json({
        ping: client.ws.ping,
    });
});

router.post("/activity", ({client, body}, res) => {
    const activity = body.activity;

    if (!activity) {
        return res.status(400).json({
            error: "No activity provided",
        });
    }

    client.user.setActivity(activity);

    res.json({
        activity: activity,
    });
});





export default router;