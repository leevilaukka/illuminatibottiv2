import { RequestHandler, Response, Router } from "express";
import {
    checkChannel,
    checkGuild,
    checkQueue,
    linkUser,
    validate,
} from "./middlewares";
import { QueryType, useHistory } from "discord-player";
import Playlist from "../models/Playlist";
import { Guild } from "../models";
import { z } from "zod";
import multer from "multer";
import { validateRequestBody } from "zod-express-middleware";

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
        return res.status(500).json({
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
router.get("/events/:id", burger, ({ client, params, query }, res) => {
    const { player } = client;
    const pingInterval = Number(query.interval) || 2000;
    res.set({
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
    });

    res.flushHeaders();
    res.write("retry: 10000\n\n");

    setInterval(() => {
        const node = client.player?.nodes?.get(params.id);
        if (params.id == node?.guild.id) {
            return res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "ping",
                    time: node?.node.getTimestamp(),
                    track: node?.currentTrack,
                    queue: node?.tracks,
                    channel: node?.channel?.toJSON(),
                    stats: node?.player.generateStatistics(),
                })}\n\n`
            );
        }
        return null;
    }, pingInterval);

    player.events.on("playerTrigger", (queue, track, reason) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "start",
                    track,
                    queue: queue.tracks,
                    channel: queue.channel.toJSON(),
                    reason,
                })}\n\n`
            );
    });

    player.events.on("audioTrackAdd", (queue, track) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "add",
                    track,
                    queue: queue.tracks,
                })}\n\n`
            );
    });

    player.events.on("audioTrackRemove", (queue) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "remove",
                    queue: queue.tracks,
                })}\n\n`
            );
    });

    player.events.on("playerResume", (queue) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "resume",
                    time: queue.node.getTimestamp(),
                    queue: queue.tracks,
                    track: queue.currentTrack,
                })}\n\n`
            );
    });

    player.events.on("playerPause", (queue) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "pause",
                    time: queue.node.getTimestamp(),
                    queue: queue.tracks,
                    track: queue.currentTrack,
                })}\n\n`
            );
    });

    player.events.on("playerFinish", (queue, track) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "finish",
                })}\n\n`
            );
    });

    player.events.on("disconnect", (queue) => {
        params.id == queue.guild.id &&
            res.write(
                `event: message\ndata: ${JSON.stringify({
                    state: "disconnect",
                })}\n\n`
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

const playSchema = 
    z.object({
        query: z.string()
    })

// Add a track to the queue
router.post(
    "/add/",
    checkQueue,
    validateRequestBody(playSchema),
    ({ queue, body: { query } }, res) => {
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
    }
);

router.post(
    "/play/",
    checkGuild,
    checkChannel,
    // linkUser,
    validateRequestBody(playSchema),
    async ({ client, channel, body, user }, res) => {
        try {
            await client.player.play(channel.id, body.query, {
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

const upload = multer({ 
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("audio/")) {
            return cb(new Error("File is not an audio file"));
        }

        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 100,
        files: 1
    }
});

router.post(
    "/playfile/",
    upload.single("file"),
    checkGuild,
    checkChannel,
    // linkUser,
    async ({ client, body, file, channel }, res) => {
        try {
            if (!file) {
                return res.status(400).json({
                    error: "No file provided",
                });
            }
            
            await client.player.play(channel.id, file.path, {
                searchEngine: QueryType.FILE,
                requestedBy: client.user,
                nodeOptions: {
                    metadata: {
                        fromAPI: true,
                        channel: channel
                    },
                },
            });

            res.status(200).json({
                message: "Playing track",
            });
        } catch (e) {
            res.status(500).json({
                error: e,
            });
        }
    }
);

const autocompleteSchema = z.object({
    body: z.object({
        query: z.string().optional(),
        limit: z.number().optional(),
    }),
});

router.post(
    "/autocomplete",
    checkQueue,
    validate(autocompleteSchema),
    async ({ queue, body, client }, res) => {
        const results = await queue.player.search(body.query, {
            requestedBy: client.user,
        });
        const limit = body.limit || 5;

        res.json({
            results: results.tracks.splice(0, limit),
        });
    }
);

const actionSchema = z.object({
    body: z.object({
        action: z.enum(
            [
                "play",
                "pause",
                "resume",
                "stop",
                "skip",
                "volume",
                "seek",
                "jump",
            ],
            {
                required_error: "No action provided",
                invalid_type_error: "Invalid action",
            }
        ),
        data: z.any().optional(),
    }),
});

router.post(
    "/controls/:id",
    checkQueue,
    validate(actionSchema),
    async ({ queue, body }, res) => {
        const action = body.action;
        try {
            const actionResult = await queue.node[action](
                body.data || undefined
            );

            return res.json({
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
    }
);

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
router.post("/seek/", checkQueue, async ({ body: { position }, queue }, res) => {
    await queue.node.seek(position);

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

router.get("/:id/filters/", checkQueue, ({ queue }, res) => {
    const filters = {
        enabled: queue.filters.ffmpeg.getFiltersEnabled(),
        disabled: queue.filters.ffmpeg.getFiltersDisabled(),
    };

    res.status(200).json({
        filters,
        current: queue.currentTrack,
    });
});

router.post(
    "/filters/toggle/",
    checkQueue,
    ({ body: { filter }, queue }, res) => {
        if (!filter)
            return res.status(400).json({ error: "No filter provided" });

        if (!queue.filters.ffmpeg.isValidFilter(filter))
            return res.status(400).json({ error: "Invalid filter" });

        queue.setTransitioning(true);
        queue.filters.ffmpeg.toggle(filter);
        queue.setTransitioning(false);

        return res.status(200).json({
            toggled: filter,
            current: queue.currentTrack,
        });
    }
);

const eqSchema = z.object({
    body: z.object({
        bands: z
            .array(
                z.object({
                    band: z.number().min(0).max(14),
                    gain: z.number().min(-0.25).max(1.0),
                }),
                {
                    required_error: "No bands provided",
                    invalid_type_error: "Invalid bands",
                    description: "An array of bands and their gain",
                }
            )
            .max(15),
    }),
});

router.post(
    "/eq/",
    checkQueue,
    validate(eqSchema),
    ({ body: { bands }, queue }, res) => {
        queue.setTransitioning(true);
        queue.filters.equalizer.setEQ(bands);
        queue.setTransitioning(false);

        res.status(200).json({
            bands,
            current: queue.currentTrack,
        });
    }
);

router.post(
    "/playlists/play/",
    checkQueue,
    ({ body: { id }, queue, client }, res) => {
        Playlist.findOne({ _id: id }).then((playlist) => {
            if (!playlist)
                return res.status(404).json({ error: "Playlist not found" });

            console.log(playlist.tracks);

            queue.addTrack(playlist.tracks);

            return res.json({
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
        const tracks = queue.tracks.map((track) => track.toJSON());

        Playlist.findOne({ name: name }).then((playlist) => {
            if (playlist) {
                playlist.tracks = tracks;
                playlist.save();
            } else {
                const newPlaylist = new Playlist({
                    name: name,
                    tracks: tracks,
                });
                newPlaylist.save();
            }

            Guild.findOne({ guildID: queue.guild.id }).then((guild) => {
                guild.playlists.push(playlist._id);
                guild.save();

                res.json({
                    message: "Saved playlist",
                    playlist: playlist,
                });
            });
        });
    }
);

router.delete(
    "/playlists/delete/",
    checkQueue,
    ({ body: { name }, queue }, res) => {
        return res.status(400).json({ error: "Not implemented" });
        res.json({
            message: "Deleted playlist",
            playlist: {
                name: name,
            },
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
