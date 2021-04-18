const {argsToString} = require("../../helpers")

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript expressions',
    ownerOnly: true,
    args: true,
    category: "config",
    execute(message, args, _settings, client) {
        try {
            const code = argsToString(args)
            let evaled = eval(code)

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            
            message.channel.send(client.clean(evaled), {code:"xl", split: true});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${client.clean(err)}\n\`\`\``);
        }
    }
}