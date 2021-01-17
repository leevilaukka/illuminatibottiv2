module.exports = {
  name: "bruh",
  description: "bruh",
  async execute(message, args, settings, client) {
    await client.playFile(message, "assets/bruh.mp3");
  },
};
