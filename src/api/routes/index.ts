import main from "./main";
import music from "./music";
import guilds from "./guilds";
import oauth from "./oauth";
import user from "./user";
import plex from "./plex";
import { OAuth2Routes } from "discord.js";
import { Response } from "express";

const routes = [
    {
        file: main,
        path: "/",
    },
    {
        file: music,
        path: "/music",
    },
    {
        file: guilds,
        path: "/guilds",
    },
    {
        file: oauth,
        path: "/oauth",
    },
    {
        file: user,
        path: "/user",
    },
    {
        file: plex,
        path: "/plex",
    },
] as const;

export const handleError = (
    res: Response,
    data: {
        error: Error;
        code: number;
    }
) => {
    return res.status(data.code).json({
        error: data.error,
    });
};

type Route = (typeof routes)[number];

export type RoutePath = Route["path"];

export type RouteFile = Route["file"];

export type ApiRoute = `/api${RoutePath}`;

export const Paths = {
    OauthProviders: {
        Discord: {
            auth: OAuth2Routes.authorizationURL,
            token: OAuth2Routes.tokenURL,
            revoke: OAuth2Routes.tokenRevocationURL,
        },
        Spotify: {
            base: "https://api.spotify.com/v1" as const,
            token: "https://accounts.spotify.com/api/token" as const,
            auth: "https://accounts.spotify.com/authorize" as const,
            albums: "https://api.spotify.com/v1/albums" as const,
            artists: "https://api.spotify.com/v1/artists" as const,
            browse: "https://api.spotify.com/v1/browse" as const,
            search: "https://api.spotify.com/v1/search" as const,
            me: "https://api.spotify.com/v1/me" as const,
        },
    },
};

export default routes;
