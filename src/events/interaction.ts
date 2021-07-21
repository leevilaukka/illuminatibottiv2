import { IlluminatiClient } from "../structures";

export default async (client: IlluminatiClient, interaction: any)  => {
    if(!interaction.isCommand()) return

    let settings;
    try {
        if (!interaction.guild) {
            settings = client.config.defaultSettings;
        } else {
            settings = await interaction.guild.getGuild(interaction.guild);
        }
    } catch (e) {
        console.error(e);
    }

    console.log(interaction)
    const cmd = client.commands.get(interaction.commandName)
    console.log("cmd: ", cmd)
    
    let args = [];

    interaction.options.forEach(opt => {
        args.push(opt.value)
    });
    console.log(interaction)
    cmd.execute(null, args, settings, client, interaction)
}
