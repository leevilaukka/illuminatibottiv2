import { GuildVoiceChannelResolvable } from "discord.js";
import { RequestHandler, Router } from "express";
import { IlluminatiClient } from "../structures";

const router = Router();

const checkQueue: RequestHandler = (req, res, next: any) => {
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

const createQueue = (guildID: string, client: IlluminatiClient, channel: GuildVoiceChannelResolvable) => {
    const queue = client.player.createQueue(guildID, {
        metadata: {
            channel,
        },
    });

    queue.connect(channel);

    return queue;
}


// TODO: Implement this
router.post("/create", (req, res) => {
    res.json({
        error: "Not implemented",
    });

    // const guildID = req.body.guildID;

    // const channel = req.client.channels.cache.get(req.body.channel);

    // const queue = createQueue(guildID, req.client, channel as GuildVoiceChannelResolvable);

    // res.json({
    //     queue: queue,
    // });
});

router.get("/now-playing/:id", checkQueue, ({queue}, res) => {
    try {
        const track = queue.nowPlaying();
    
        res.json({
            playing: queue.playing,
            track: track,
            progress: queue.getPlayerTimestamp(),
            queue: queue,

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

router.post("/pause/", checkQueue, (req, res) => {
    const queue = req.queue

    queue.setPaused(true);

    res.json({
        paused: true,
        track: queue.nowPlaying(),
    });
});

router.post("/resume/", checkQueue, ({queue}, res) => {
    queue.setPaused(false);

    res.json({
        paused: false,
        track: queue.nowPlaying(),
    });
});

router.post("/skip/", checkQueue, ({queue}, res) => {
    if (!queue) {
        return res.json({
            error: "No queue found",
        });
    }

    const track = queue.skip();

    res.json({
        track: track,
    });
});

router.post("/stop/", checkQueue, ({queue}, res) => {
    queue.stop();

    res.json({
        stopped: true,
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