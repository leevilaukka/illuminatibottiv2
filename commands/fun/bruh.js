module.exports = {
  name: "bruh",
  description: "bruh",
  category: "other",
  async execute(message, args, settings, client) {
    let [volume] = args
    if (volume > 2 || isNaN(volume)) {
      volume = null;
    }
    message.delete({ timeout: 1000 });
    await client.playFile(message, "assets/bruh.mp3", {volume});
  },
};
