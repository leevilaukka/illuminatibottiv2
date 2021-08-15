import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: 'args-info',
    description: 'Information about the arguments provided.',
    args: true,
    category: "config",
    usage: '<argumentti>',
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};

export default command