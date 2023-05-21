import axios from "axios";
import { OAuth2Routes } from "discord.js";
import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
    res.json({
        message: "Hello world!",
    });
});

// Get spotify auth credentials
router.get("/spotify", (req, res) => {
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
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
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
});

router.get("/discord/auth", (req, res) => {
    res.redirect(
        `${OAuth2Routes.authorizationURL}?client_id=${
            encodeURIComponent(process.env.DISCORD_CLIENT_ID) || "none"
        }&redirect_uri=${encodeURIComponent(
            "http://localhost:3000/"
        )}&response_type=token&scope=${encodeURIComponent(
            "identify guilds"
        )}&prompt=consent`
    );
});

router.get("/discord/callback", (req, res) => {
    res.json({
        code: req.query.code,
    });
});

export default router;
