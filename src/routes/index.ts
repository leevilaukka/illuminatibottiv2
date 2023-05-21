import main from "./main";
import music from "./music";
import guilds from "./guilds";
import oauth from "./oauth";
import user from "./user";

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
];

export default routes;
