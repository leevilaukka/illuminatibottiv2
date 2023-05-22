import { DatabaseError, ErrorWithStack } from "../../structures/Errors";
import { Guild } from "../../models";
import { IlluminatiClient } from "../../structures";
import { AuditLogEvent, Message, TextChannel } from "discord.js";
import { DeletedMessage } from "../../config";

export default async (client: IlluminatiClient, deletedMessage: Message) => {
    try {
        if (!(deletedMessage.channel instanceof TextChannel)) return;
        if (deletedMessage.author.bot) return;
        if (!deletedMessage.guild) return;

        const fetchedLogs = await deletedMessage.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
        });

        // Pick first entry from deletedLog and destructure executor out
        const deletedLog = fetchedLogs.entries.first();
        if (!deletedLog) return;
        const { executor } = deletedLog;

        // If executor is a bot account, return
        if (executor.bot) return;

        const {
            author,
            content: message,
            id: messageID,
            channel,
            embeds,
        } = deletedMessage;
        const newDoc = {
            author: {
                name: author.username,
                discriminator: author.discriminator,
                id: author.id,
            },
            deletor: executor
                ? {
                      name: executor.username,
                      discriminator: executor.discriminator,
                      id: executor.id,
                  }
                : null,
            message,
            timestamp: Date.now(),
            messageID,
            channel: {
                name: channel.name,
                id: channel.id,
            },
            embeds,
        } satisfies DeletedMessage;

        client
            .guildManager(deletedMessage.guild)
            .pushToArray("deletedMessages", newDoc)
            .then(() => {
                console.log("Message deleted!");
            })
            .catch((e: DatabaseError) => {
                throw e;
            });
    } catch (e) {
        throw new ErrorWithStack(e);
    }
};
