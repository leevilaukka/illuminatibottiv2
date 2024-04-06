import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder  } from "discord.js";
import { SlashCommand } from "../../../types";
import { getLibraryByID } from "../../../api/handlers/plex";
import { CommandNotImplementedError } from "../../../structures/Errors";

// TODO!!
const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("plex")
        .setDescription("Play from Plex")
        .addStringOption(option => option
            .setName("artist")
            .setDescription("Artist")
            .setAutocomplete(true)
        ).
        addStringOption(option => option
            .setAutocomplete(true)
            .setDescription("song")
            .setName("song")
        )
        .toJSON()
    ,async execute(client, interaction) {
        throw new CommandNotImplementedError("Not yet implemented", interaction)
    },
    async autocomplete({ player }, interaction) {
        const artist = interaction.options.getString("artist")
        const song = interaction.options.getString("song")
        const library = await getLibraryByID("1")

        const foundArtists = library.MediaContainer.Metadata.filter((data) => data.title.includes(artist))
        
        
        return interaction.respond(
            foundArtists.map(artist => ({
                value: artist.ratingKey,
                name: artist.title
            }))
        )
    }
}

const slice = (str: string, length: number) => {
    if (str.length > length) {
        return str.slice(0, length) + "...";
    } else {
        return str;
    }
}

export default command;