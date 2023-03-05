import { GuildVoiceChannelResolvable, TextBasedChannel, VoiceChannel } from "discord.js";
import { RequestHandler, Router } from "express";
import { PlayerMetadata } from "PlayerMetadata";
import { IlluminatiClient } from "../structures";

const router = Router();

const checkQueue: RequestHandler = (req, res, next) => {
    const guildID = req.params.id || req.body.guildID || req.body.id;

    const queue = req.client.player.getQueue(guildID);

    if (!queue) {
        return res.status(404).json({
            error: "No queue found",
        });
    }

    req.queue = queue;
    next();
};

const createQueue = (guildID: string, client: IlluminatiClient, metadata: PlayerMetadata, voiceChannel: GuildVoiceChannelResolvable) => {
    const queue = client.player.createQueue(guildID, {
        metadata
    });

    if (!queue.connection) {
        queue.connect(voiceChannel);
    }

    return queue;
}


// TODO: Implement this
router.post<{
    body: {
        guildID: string;
        channel: string;
        voiceChannel: string;
    }
}>("/create", (req, res) => {
    res.json({
        error: "Not implemented",
    });

    const guildID = req.body.guildID;

    const channel = req.client.channels.cache.get(req.body.channel) as TextBasedChannel;
    const v = req.client.channels.cache.get(req.body.voiceChannel) as VoiceChannel;

    const metadata: PlayerMetadata = {
        channel: channel,
        fromAPI: true
    }

    const queue = createQueue(guildID, req.client, metadata, v);

    res.json({
        queue: queue,
    });
});

router.get("/now-playing/:id", checkQueue, ({queue}, res) => {
    try {
        const track = queue.nowPlaying();
    
        res.json({
            playing: queue.playing,
            track: track,
            progress: queue.getPlayerTimestamp(),
            queue: queue.toJSON(),

        });
    } catch (e) {
        res.status(500).json({
            error: e,
        });
    }
});

router.post("/play/", checkQueue, async ({client, body, queue}, res) => {
    const track = await client.player
        .search(body.query, {
            requestedBy: client.user,
        })
        .then((x) => x.tracks[0]);

    if (!track) {
        return res.status(404).json({
            error: "No track found",
        });
    }

    queue.play(track)
        .then(() => {
            res.json({
                track: track,
            });
        })
        .catch((e) => {
            console.error(e);
            return res.status(500).json({
                error: "An error occurred",
            });
        });    
});

router.post("/controls/", checkQueue, ({queue, body}, res) => {
    const action = body.action;

    switch (action) {
        case "pause":
            queue.setPaused(true);
            break;
        case "resume":
            queue.setPaused(false);
            break;
        case "skip":
            queue.skip();
            break;
        case "stop":
            queue.stop();
            break;
        default:
            return res.status(400).json({
                error: "Invalid action",
            });
    }

    res.json({
        action: action,
        track: queue.nowPlaying(),
    });
});

router.post("/volume/", checkQueue, ({queue, body}, res) => {
    const volume = body.volume;

    queue.setVolume(volume);

    res.json({
        volume: volume,
        track: queue.nowPlaying(),
    });
});

router.post("/seek/", checkQueue, (req, res) => {
    const position = req.body.position;
    const queue = req.queue

    queue.seek(position);

    res.json({
        position: position,
        track: queue.nowPlaying(),
    });
});

export default router;