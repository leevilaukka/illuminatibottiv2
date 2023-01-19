import main from "./main"
import music from "./music"


const routes = [ 
    {
        file: main,
        path: "/",
    },
    {
        file: music,
        path: "/music",
    }
]

export default routes

