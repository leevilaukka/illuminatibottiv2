import { RequestHandler, Router } from "express";
import { checkChannel, checkGuild, checkQueue } from "./middlewares";
import { Track, useHistory, useMasterPlayer } from "discord-player";
import Playlist from "../models/Playlist";
import { Guild } from "../models";

const router = Router();

// Returns the current track and the progress of the track
router.get("/now-playing/:id", checkQueue, ({ queue, client }, res) => {
    try {
        const track = queue.currentTrack;
        client.logger.log(`[API] Now playing for ${queue.guild} is ${track}`);
        return res.json({
            playing: queue.node.isPlaying(),
            track: track,
            queue: queue.tracks,
            progress: queue.node.getTimestamp(),
            channel: queue.channel.toJSON(),
        });
    } catch (e) {
        res.status(500).json({
            error: e,
        });
    }
});

const burger: RequestHandler = async (req, res, next) => {
    const guildID = String(req.params.id || req.body.guildID);

    const queue = req.client.player.nodes.get(guildID);

    req.client.logger.log(`[API] Queue for ${guildID} is ${queue}`);

    req.queue = queue;
    next();
};

// Optimize this later
router.get("/events/:id", burger, ({ client, params }, res) => {
    res.set({
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
    });

    res.flushHeaders();
    res.write("retry: 10000\n\n");

    setInterval(() => {
        const node = client.player?.nodes?.get(params.id);
        const player = useMasterPlayer();
        res.write(
            `event: message\ndata: ${JSON.stringify({
                state: "ping",
                time: node?.node.getTimestamp(),
                track: node?.currentTrack,
                queue: node?.tracks,
                channel: node?.channel?.toJSON(),
                stats: player?.generateStatistics(),
            })}\n\n`
        );
    }, 2000);

    client.player.events.on("playerTrigger", (queue, track) => {
        res.write(
            `event: message\ndata: ${JSON.stringify({
                state: "start",
                track,
                queue: queue.tracks,
                channel: queue.channel.toJSON(),
            })}\n\n`
        );
    });

    client.player.events.on("audioTrackAdd", (queue, track) => {
        res.write(
            `event: message\ndata: ${JSON.stringify({
                state: "add",
                track,
                queue: queue.tracks,
            })}\n\n`
        );
    });

    client.player.events.on("audioTrackRemove", (queue) => {
        res.write(
            `event: message\ndata: ${JSON.stringify({
                state: "remove",
                queue: queue.tracks,
            })}\n\n`
        );
    });

    client.player.events.on("playerResume", (queue) => {
        res.write(
            `event: message\ndata: ${JSON.stringify({
                state: "resume",
                time: queue.node.getTimestamp(),
                queue: queue.tracks,
                track: queue.currentTrack,
            })}\n\n`
        );
    });

    client.player.events.on("playerPause", (queue) => {
        res.write(
            `event: message\ndata: ${JSON.stringify({
                state: "pause",
                time: queue.node.getTimestamp(),
                queue: queue.tracks,
                track: queue.currentTrack,
            })}\n\n`
        );
    });

    client.player.events.on("playerFinish", (queue, track) => {
        res.write(
            `event: message\ndata: ${JSON.stringify({ state: "finish" })}\n\n`
        );
    });
});

// Returns the queue and the current track
router.get("/queue/:id", checkQueue, ({ queue }, res) => {
    res.json({
        queue: queue.tracks,
        current: queue.currentTrack,
        history: useHistory(queue.guild.id).tracks,
    });
});

// Add a track to the queue
router.post("/add/", checkQueue, async ({ queue, body: { query } }, res) => {
    try {
        queue.addTrack(query);
        res.json({
            message: "Added track to queue",
            track: queue.currentTrack,
        });
    } catch (e) {
        res.status(500).json({
            error: e,
        });
    }
});

router.post(
    "/play/",
    checkGuild,
    checkChannel,
    async ({ client, channel, body }, res) => {
        try {
            client.player.play(channel.id, body.query, {
                requestedBy: client.user,
                nodeOptions: {
                    metadata: {
                        fromAPI: true,
                        channel: client.channels.cache.get(channel.id),
                    },
                },
            });

            res.json({
                message: "Playing track",
            });
        } catch (e) {
            res.status(500).json({
                error: e,
            });
        }
    }
);

router.post("/controls/:id", checkQueue, async ({ queue, body }, res) => {
    const action = body.action;

    if (!action) return res.status(400).json({ error: "No action provided" });

    try {
        const actionResult = await queue.node[action](body.data || undefined);

        res.json({
            action: body.action,
            result: actionResult,
            track: queue.currentTrack,
        });
    } catch (e) {
        return res.status(400).json({
            error: "Invalid action",
            message: e,
        });
    }
});

router.get("/history/:id", checkQueue, ({ queue }, res) => {
    res.json({
        history: queue.history.tracks,
    });
});

router.post("/previous/", checkQueue, async ({ queue, body }, res) => {
    const history = useHistory(queue.guild.id);
    await history.previous(body.preserveCurrent);

    res.json({
        track: queue.currentTrack,
    });
});

router.post("/shuffle/", checkQueue, ({ queue }, res) => {
    queue.tracks.shuffle();

    res.json({
        track: queue.currentTrack,
        queue: queue.tracks,
    });
});

router.post("/repeat/", checkQueue, ({ queue, body: { repeat } }, res) => {
    queue.setRepeatMode(repeat);

    res.json({
        repeat: repeat,
        track: queue.currentTrack,
        queue: queue.tracks,
    });
});

// TODO: Move to /controls
router.post("/seek/", checkQueue, ({ body: { position }, queue }, res) => {
    queue.node.seek(position);

    res.json({
        position,
        track: queue.currentTrack,
    });
});

// TODO: Move to /controls
router.post("/jump/", checkQueue, ({ body: { index }, queue }, res) => {
    queue.node.jump(index);

    res.json({
        index,
        track: queue.currentTrack,
    });
});

router.patch("/move/", checkQueue, ({ body: { from, to }, queue }, res) => {
    queue.moveTrack(from, to);

    res.status(200).json({
        from,
        to,
        current: queue.currentTrack,
    });
});

router.post("/top/", checkQueue, ({ body: { track }, queue }, res) => {
    queue.moveTrack(track, 0);

    res.status(200).json({
        track,
        index: 0,
        current: queue.currentTrack,
    });
});

router.delete("/remove/", checkQueue, ({ body: { track }, queue }, res) => {
    queue.removeTrack(track);

    res.status(200).json({
        track,
        current: queue.currentTrack,
        queue: queue.tracks,
    });
});

router.delete("/clear/", checkQueue, ({ queue }, res) => {
    queue.clear();

    res.status(200).json({
        current: queue.currentTrack,
        queue: queue.tracks,
    });
});

router.post(
    "/playlists/play/",
    checkQueue,
    ({ body: { name }, queue, client }, res) => {
        Guild.findOne({ guildID: queue.guild.id }).then((guild) => {
            const playlist = guild.playlists.find(
                (playlist) => playlist.name === name
            );

            if (!playlist)
                return res.status(404).json({ error: "Playlist not found" });

            queue.addTrack(playlist.tracks);

            res.json({
                message: "Added playlist to queue",
                playlist: playlist,
                track: queue.currentTrack,
            });
        });
    }
);

router.post(
    "/playlists/save/",
    checkQueue,
    ({ client, queue, body: { name } }, res) => {
        Guild.findOne({ guildID: queue.guild.id }).then((guild) => {
            const tracks = queue.tracks.map((track) => track);

            console.log(tracks);
            guild.playlists.push({
                name: name,
                tracks: tracks,
            });

            guild.save();
        });

        res.json({
            message: "Saved playlist",
            playlist: {
                name: name,
                tracks: queue.tracks.toJSON(),
            },
        });
    }
);

router.delete(
    "/playlists/delete/",
    checkQueue,
    ({ body: { name }, queue }, res) => {
        Guild.findOne({ guildID: queue.guild.id }).then((guild) => {
            guild.playlists = guild.playlists.filter(
                (playlist) => playlist.name !== name
            );

            guild.save();
        });
    }
);

router.get("/playlists/", async (req, res) => {
    const playlists = await Guild.findOne({
        guildID: req.query.guild,
    }).then((guild) => guild.playlists);

    res.json(playlists);
});

router.get("/stats/", ({ client }, res) => {
    res.json({
        stats: client.player.generateStatistics(),
    });
});

export default router;
