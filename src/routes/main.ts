import express from "express";
import Shortlink from "../models/Shortlink";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "IlluminatiBotti API",
    });
});

router.get("/sh/:shortlink", async (req, res) => {
    const shortlink = req.params.shortlink;

    const shortlinkData = await Shortlink.findOne({
        code: shortlink,
    });

    if (!shortlinkData) {
        return res.status(404).json({
            error: "Shortlink not found",
        });
    }

    shortlinkData.uses =+ 1;
    shortlinkData.save();

    res.redirect(shortlinkData.url);
});

router.get("/sh/stats/:shortlink", async (req, res) => {
    const shortlink = req.params.shortlink;

    const shortlinkData = await Shortlink.findOne({
        code: shortlink,
    });

    if (!shortlinkData) {
        return res.status(404).json({
            error: "Shortlink not found",
        });
    }

    res.json({
        result: shortlinkData,
    });
});

router.post("/sh", async (req, res) => {
    const { url, userID } = req.body;

    const code = Math.random().toString(36).substring(2, 7);

    if (!code || !url) {
        return res.status(400).json({
            error: "No code or url provided",
        });
    }

    const shortlink = await Shortlink.findOne({
        code: code,
    });

    if (shortlink) {
        return res.status(400).json({
            error: "Code already exists",
        });
    }

    const shortlinkData = await Shortlink.create({
        code: code,
        redirectURL: `${process.env.API_URL}:${process.env.EXPRESS_PORT}/api/sh/${code}`,
        url: url,
        owner: userID,
    });

    res.json({
        shortlink: shortlinkData,
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
