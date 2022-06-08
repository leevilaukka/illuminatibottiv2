import { GuildMember } from "discord.js";
import { IlluminatiClient } from "../../structures";

export default async (client: IlluminatiClient, member: GuildMember) => {
    console.log(`${member.user.tag} left the server.`);

    const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const kickLog = fetchedLogs.entries.first();

	// Perform a coherence check to make sure that there's *something*
	if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);

	// Now grab the user object of the person who kicked the member
	// Also grab the target of this action to double-check things
	const { executor, target } = kickLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same kicked member
	if (target.id === member.id) {
		console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
	} else {
		console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
	}
}