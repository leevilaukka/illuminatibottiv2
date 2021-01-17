module.exports = {
  name: "bruh",
  description: "bruh",
  async execute(message, args, settings, client) {
    message.delete({timeout: 1000});
    await client.playFile(message, "assets/bruh.mp3");
  },
};
