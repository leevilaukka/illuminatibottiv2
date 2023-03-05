import main from "./main"
import music from "./music"
import guilds from "./guilds"

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
    }
]

export default routes

