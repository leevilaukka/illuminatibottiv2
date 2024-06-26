import axios from "axios";
import { OAuth2Routes } from "discord.js";
import { Router } from "express";
import { z } from "zod";
import { validate } from "./middlewares";
import { Paths, handleError } from ".";
import { IlluminatiUserTypes } from "../../structures/IlluminatiUser";

const jsonToUrlParams = (data: Record<string, any>) => {
    const params = new URLSearchParams();
    for (const key in data) {
        params.append(key, `${data[key]}`);
    }
    return params;
};

const router = Router();

const HOMEURL =
    process.env.NODE_ENV === "production"
        ? "https://player.leevila.fi/"
        : "http://localhost:4000/";

const REDIRECT_URI = `${HOMEURL}api/oauth/discord/callback` as const;

router.get("/", (_, res) => {
    res.json({
        message: "Hello world!",
    });
});

// Get spotify auth credentials
router.get("/spotify", (req, res) => {
    const authOptions = {
        url: Paths.OauthProviders.Spotify.auth,
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
        },
        form: {
            grant_type: "client_credentials",
        },
        json: true,
    };

    axios
        .post(authOptions.url, authOptions.form, {
            headers: authOptions.headers,
        })
        .then((response) => {
            res.json({
                access_token: response.data.access_token,
            });
        })
        .catch((error) => handleError(res, { error, code: 500 }));
});

const discordAuthSchema = z.object({
    query: z.object({
        state: z.string().optional(),
    }),
});

router.get("/discord/auth", validate(discordAuthSchema), (req, res) => {
    res.redirect(
        `${OAuth2Routes.authorizationURL}?client_id=${
            encodeURIComponent(process.env.DISCORD_CLIENT_ID) || "none"
        }&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&response_type=code&scope=${encodeURIComponent("identify guilds")}${
            req.query.state
                ? `&state=${encodeURIComponent(req.query.state as string)}`
                : ""
        }&prompt=consent`
    );
});

const discordCallbackSchema = z.object({
    query: z.object({
        code: z.string({
            required_error: "Missing code",
        }),
    }),
});

router.post("/activity  ", (req, res) => {
    const params = jsonToUrlParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: REDIRECT_URI,
        scope: "identify",
    });

    axios
        .post<IlluminatiUserTypes["discordAuth"]>(
            `${OAuth2Routes.tokenURL}`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then(async ({ data }) => {
            return res.json({
                access_token: data.access_token
            })
        })
        .catch((error) => handleError(res, { error, code: 500 }));
})

router.get("/discord/callback", validate(discordCallbackSchema), (req, res) => {
    const params = jsonToUrlParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: REDIRECT_URI,
        scope: "identify guilds",
    });

    axios
        .post<IlluminatiUserTypes["discordAuth"]>(
            `${OAuth2Routes.tokenURL}`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then(async ({ data }) => {
            return res.redirect(
                `${HOMEURL}?access_token=${data.access_token}&refresh_token=${data.refresh_token}&state=${req.query.state}`
            );
        })
        .catch((error) => handleError(res, { error, code: 500 }));
});

const discordRefreshSchema = z.object({
    query: z.object({
        refresh_token: z.string({
            required_error: "Missing refresh_token",
        }),
    }),
});

router.get("/discord/refresh", validate(discordRefreshSchema), (req, res) => {
    const params = jsonToUrlParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: req.query.refresh_token,
        redirect_uri: `${HOMEURL}/api/oauth/discord/callback`,
        scope: "identify guilds",
    });

    axios
        .post(`${OAuth2Routes.tokenURL}`, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            res.json({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
            });
        });
});

export default router;
