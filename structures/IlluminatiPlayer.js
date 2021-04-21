const { default: axios } = require("axios");
const { VoiceConnection, StreamDispatcher, Message } = require("discord.js");
const moment = require("moment");
const ytdl = require("ytdl-core");
const { umlautRemover } = require("../helpers");

/**
 * IlluminatiPlayer
 * 
 * Custom VoiceConnection and StreamDispatcher handler for playing Youtube audio
 * @constructor
 * @param {object} options Options to pass to player 
 */

module.exports = class IlluminatiPlayer {
    constructor(options) {
        this.options = options;
        this.connection = VoiceConnection;
        this.dispatcher = StreamDispatcher;
        this.queue = [];
        this.playing = false;
        this.message = null;
    }


    /**
     * @method
     * @param {Message} message Discord.js Message 
     * @returns connection
     */

    async join(message) {
        this.message = message

        if (message.member.voice.channel) {
            this.connection = await message.member.voice.channel.join();
            return this.connection;
        } else {
            message.reply("et ole puhekanavalla.");
        }
    }

    /**
     * @method
     * @param {URL} url Youtube URL
     * @param {Message} message Discord.js Message
     * @returns dispatcher
     */

    async play(url, message) {
        if (this.connection) {
            const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(url)
            console.log(regex)
            if (!regex) url = await this.searchVideo(url)
            console.log(url)

            const {videoDetails} = await ytdl.getInfo(url)
            
            console.log(videoDetails)
            if (this.playing) {
                this.queue = [...this.queue, {
                    url,
                    info: videoDetails
                }]
                this.message.channel.send(`Lisätty jonoon: ${videoDetails.title}`)
            } else {
                this.dispatcher = this.connection.play(
                    await ytdl(url),
                    this.options
                );      
                this.playing = true;

                const minutes = Math.floor(videoDetails.lengthSeconds / 60)
                const seconds = videoDetails.lengthSeconds % 60

                const views = videoDetails.viewCount.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
           
                const embed = {
                    title: `:notes: Nyt toistetaan: ${videoDetails.title}`,
                    url: videoDetails.video_url,
                    fields: [
                        {
                            name: "Kanava",
                            value: videoDetails.ownerChannelName,
                            inline: true
                        },
                        {
                            name: "Julkaisupvm.",
                            value: moment(videoDetails.publishDate, "YYYY-MM-DD").format("DD.MM.YYYY"),
                            inline: true
                        },
                        {
                            name: "Näyttökerrat",
                            value: views
                        },
                        {
                            name: "Kesto",
                            value: `${minutes}:${seconds}`,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: videoDetails.thumbnails[0].url
                    }
                }
                this.message.channel.send({embed})
                return this.dispatcher;
            }
        } else {
            await this.join(message);
            await this.play(url);
        }
        
        this.dispatcher.on("finish", async () => {
            this.skip()
        })
    }

    async searchVideo(search) {
        const token = process.env.GOOGLE_API;

        return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${umlautRemover(search)}&key=${token}&type=video&topicId=/m/04rlf`)
        .then(res => {
            console.log("video",res.data.items[0].id.videoId)
            return `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`
        })
        .catch(err => {
            console.error(err)
            return search
        })
    }

    async sendQueue(message) {
        if(!this.queue) return message.reply(", jono on tyhjä. Pistä bileet pystyyn!");
        let fields = [];
        this.queue.forEach((song, i) => {
            fields.push({
                name: i + 1,
                value: `${song.info.title} - ${song.info.ownerChannelName}`
            })
        })

        const embed = {
            title: "Jono :notes:",
            fields
        }

        message.channel.send({embed})
    }

    /**
     * @method
     * Skip currently playing song and play next from queue
     */

    async skip() {
        this.playing = false
        console.log(this.queue)
        if(this.queue.length > 0) {
            await this.message.channel.send("Skipataan..")
            await this.play(this.queue[0].url, this.message)
            this.queue.shift();
        } else this.stop()
    }

    /**
     * @method
     * Stop playback and reset player state
     */
    async stop() {
        await this.message.channel.send("Se on loppu ny.")
        this.connection && this.connection.disconnect();
        this.connection = null
        this.dispatcher = null
        this.playing = false;
        this.queue = []
    }

    clearQueue() {
        this.queue = []
    }

    pause() {
        this.dispatcher?.pause();
    }

    resume() {
        this.dispatcher?.resume();
    }

    setVolume(vol) {
        if(isNaN(vol)) return 
        this.dispatcher?.setVolume(vol)
    }
};
