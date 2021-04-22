module.exports = {
  name: "bruh",
  description: "bruh",
  category: "other",
  async execute(message, args, settings, client) {
      await client.player.playFile("../../assets/bruh.mp3", message) 
  }
};
