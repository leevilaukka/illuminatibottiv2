import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: "reload",
    description: "Reloads a command",
    args: true,
    category: Categories.config,
    outOfOrder: true,
    run(message, args: string[], settings, client) {
        const commandName = args[0].toLowerCase();
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

            console.log(command);

        if (!command) {
            return message.channel.send(
                `There is no command with name or alias \`${commandName}\`, ${message.author}!`
            );
        }

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(
                `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
            );
        }
    },
};

export default command