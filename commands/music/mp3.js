const ytdl = require("ytdl-core");
const fs = require("fs");

module.exports = {
  name: "mp3",
  description: "Lataa Youtube-videoita MP3-tiedostoina",
  execute(message, args, settings, client) {
    const [ytLink] = args;
    const writer = fs.createWriteStream("pipes/ytdl.mp3");
    console.log(ytLink);
    ytdl(ytLink).pipe(writer);

    writer.on("finish", (resolve) => {
      console.log("Ladattu!");
    });

    writer.on("error", (err) => {
        console.error(err)
    });
  },
};
