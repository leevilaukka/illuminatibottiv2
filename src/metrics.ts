import io from "@pm2/io";

// Init Command Counter
export const commandCounter = io.counter({
    name: "Commands",
    id: "commands"
})


