import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "IlluminatiBotti API",
    });
});

router.get("/status", ({ client, queue }, res) => {
    res.status(200).json({
        status: "online",
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        channels: client.channels.cache.size,
        uptime: client.uptime,
        environment: process.env.NODE_ENV,
        queue: queue || null,
        activity: client.user.presence.activities[0],
        ping: client.ws.ping,
    });
});

router.get("/ping", ({ client }, res) => {
    res.json({
        ping: client.ws.ping,
    });
});

router.post("/activity", ({ client, body }, res) => {
    const activity = body.activity;

    if (!activity) {
        return res.status(400).json({
            error: "No activity provided",
        });
    }

    const activityRes = client.user.setActivity(activity);

    res.json({
        activity: activityRes,
    });
});



export default router;
