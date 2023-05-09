import { GuildVoiceChannelResolvable, TextBasedChannel, VoiceChannel } from "discord.js";
import { RequestHandler, Router } from "express";
import { PlayerMetadata } from "PlayerMetadata";
import { IlluminatiClient } from "../structures";

const router = Router();

const checkQueue: RequestHandler = async (req, res, next) => {
    const guildID = req.params.id || req.body.guildID || req.body.id;

    const queue = req.client.player.nodes.get(guildID);

    if (!queue) {
        return res.status(404).json({
            error: "No queue found",
        });
    }

    req.queue = queue;
    next();
};


// TODO: Implement this


router.get("/now-playing/:id", checkQueue, ({queue}, res) => {
    try {
        const track = queue.currentTrack;
    
        res.json({
            playing: queue.node.isPlaying,
            track: track,
            progress: queue.node.getTimestamp(),
            queue: queue

        });
    } catch (e) {
        res.status(500).json({
            error: e,
        });
    }
});


router.post("/controls/", checkQueue, ({queue, body}, res) => {
    const action = body.action;

    switch (action) {
        case "pause":
            queue.node.setPaused(true);
            break;
        case "resume":
            queue.node.setPaused(false);
            break;
        case "skip":
            queue.node.skip();
            break;
        case "stop":
            queue.node.stop();
            break;
        default:
            return res.status(400).json({
                error: "Invalid action",
            });
    }

    res.json({
        action: action,
        track: queue.currentTrack,
    });
});

router.post("/volume/", checkQueue, ({queue, body}, res) => {
    const volume = body.volume;

    queue.node.setVolume(volume);

    res.json({
        volume: volume,
        track: queue.currentTrack,
    });
});

router.post("/seek/", checkQueue, (req, res) => {
    const position = req.body.position;
    const queue = req.queue

    queue.node.seek(position);

    res.json({
        position: position,
        track: queue.currentTrack,
    });
});

export default router;