import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "bruh",
    description: "bruh",
    category: "other",
    outOfOrder: true,
    async execute(message, args, settings, client) {
        //await client.player.playFile("../../assets/bruh.mp3", message) 
    }
};

export default command