import express from "express";
import Shortlink from "../models/Shortlink";
import pm2 from "pm2";
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

router.get("/shstats/:shortlink", async (req, res) => {
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
            error: "Code already exists, try again",
            retry: {    
                url: url,
                userID: userID,
                to: "/api/sh",
            }
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
        activities: client.user.presence.activities,
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

router.get("/quizzes", ({ client }, res) => {
    const quizzes = client.quizzes;

    res.json({
        quizzes: quizzes,
    });
});

// Teapot
router.get("/teapot", (req, res) => {
    res.status(418).json({
        error: "I'm a teapot",
    });
});

// RESTART BOT
/* router.post("/restart", async (req, res) => {
    const { client } = req;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            error: "No password provided",
        });
    }

    if (password !== process.env.RESTART_PASSWORD) {
        return res.status(403).json({
            error: "Incorrect password",
        });
    }

    if (client.isDevelopment) {
        return res.status(403).json({
            error: "Restarting is not allowed in development mode",
        });
    }

    res.json({
        message: "Restarting bot...",
    });

    client.destroy();
    pm2.connect((err) => {
        if (err) {
            console.error(err);
            process.exit(2);
        }
        pm2.restart("illuminatibotti", (err, proc) => {
            if (err) {
                console.error(err);
            }

            console.log(proc);

            pm2.disconnect();
        });
    });
}); */
    


export default router;
