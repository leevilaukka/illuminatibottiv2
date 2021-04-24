const { default: axios } = require("axios");
const { VoiceConnection, StreamDispatcher, Message } = require("discord.js");
const moment = require("moment");
const ytdl = require("ytdl-core");
const { umlautRemover } = require("../helpers");
const IlluminatiEmbed = require("./IlluminatiEmbed");

/**
 * IlluminatiPlayer
 * 
 * Custom VoiceConnection and StreamDispatcher handler for playing Youtube audio
 * @constructor
 * @param {object} options Options to pass to player 
 */

module.exports = class IlluminatiPlayer {
    constructor(client, options) {
        this.client = client
        this.options = options;
        this.connection = VoiceConnection;
        this.dispatcher = StreamDispatcher;
        this.queue = [];
        this.nowPlaying; 
        this.playing = false;
        this.message = null;
        this.loop = false;
    }


    /**
     * @method
     * @param {Message} message Discord.js Message 
     * @returns {VoiceConnection} connection
     */

    async join(message) {
        this.message = message

        if (message.member.voice.channel) {
            this.connection = await message.member.voice.channel.join();
            return this.connection;
        } else {
            message.reply("et ole puhekanavalla.");
        }
        return this
    }

    /**
     * @method
     * @param {URL} url Youtube URL
     * @param {Message} message Discord.js Message
     * @param {Boolean} skipQueue Skip current Queue
     * @returns dispatcher
     */

    async play(url, message, skipQueue) {
        if (this.connection) {
            this.message = message

            const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(url)
            if (!regex) url = await this.searchVideo(url)

            const {videoDetails} = await ytdl.getInfo(url)
            
            if (this.playing && !skipQueue) {
                this.queueAdd(url, videoDetails, message)
            } else {

                this.dispatcher =  this.connection.play(
                    ytdl(url),
                    this.options
                );    
                
                this.playing = true;

                this.nowPlaying = videoDetails

                this.sendVideoEmbed(message, `:notes: Nyt toistetaan: ${videoDetails.title}`, videoDetails)

                return this;
            }
        } else {
            await this.join(message);
            await this.play(url, message);
        }

        // Playback ends
        this.dispatcher.on("finish", async () => {
            if(this.loop) {
                return this.play(url, message, true)
            }
            return this.skip(message)
        })
    }

    /**
     * @method
     * Skip currently playing song and play next from queue
     * @param {Message} message Discord Message
     * @param {boolean} fromUser Set to true, if skipping is requested by user
     */

    async skip(message) {
        this.playing = false
        if(this.queue.length > 0) {
            this.play(this.queue[0].url, message)
            this.queue.shift();
            return this
        } else this.stop()
    }

    async queueAdd(url, videoDetails, message) {
        this.queue = [...this.queue, {
            url,
            info: videoDetails
        }]

        return this.sendVideoEmbed(message, `:notes: Lisätty jonoon: ${videoDetails.title}`, videoDetails)
    }

    async playSkip(url, message) {
        this.queue = []
        await this.play(url, message, true)
        return this
    } 

    toggleLoop(message) {
        this.loop = !this.loop
        message.channel.send(`Loop: ${this.loop ? "**päällä**" : "**pois**"}`)
    }

    /**
     * Play from file
     * @param {FilePath} file 
     * @param {Message} message 
     */

    playFile(file, message) {
        if(this.connection) {
            this.connection.play(file)
        }
        else {
            this.join(message)
            this.playFile(file, message)
        }
    }
    
    /**
     * @method
     * @param {string} search Search query
     * @returns first search result from YouTube list
     */
    
    async searchVideo(search) {
        const token = process.env.GOOGLE_API;

        return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${umlautRemover(search)}&key=${token}&type=video&topicId=/m/04rlf`)
        .then(res => {
            return `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`
        })
        .catch(() => {
            return search
        })
    }

    

    /**
     * 
     * @param {number} index Song position in queue
     * @param {Message} message Discord.js Message object
     * @returns IlluminatiPlayer object
     */

    async queueDelete(index, message) {
        if(!this.queue.length) return message.reply(", jono on tyhjä.");
        if (!this.queue[index - 1]) return this.message.reply(", kappaletta ei löytynyt!")
        await message.channel.send(`Kappale ${this.queue[index - 1].info.title} poistettu`)

        this.queue = this.queue.splice(index - 1, 1);
        return this
    }

    clearQueue() {
        this.queue = []
    }

    /**
     * Send player queue to channel
     * @param {Message} message 
     * @returns IlluminatiPlayer object
     */

    async sendQueue(message) {
        if(!this.queue.length) return message.reply(", jono on tyhjä. Pistä bileet pystyyn!");
        let fields = [];

        this.nowPlaying && this.playing && fields.push({
            name: "Nyt soi:",
            value: this.nowPlaying.title
        })

        this.queue.forEach((song, i) => {
            fields.push({
                name: i + 1,
                value: `${song.info.title} - ${song.info.ownerChannelName}`
            })
        })

        new IlluminatiEmbed(message, {
            title: "Jono :notes:",
            fields
        }, this.client).send()

        return this
    }

    async sendVideoEmbed(message, title, videoData) {
        let seconds = videoData.lengthSeconds % 60;
        
        if (seconds < 10) {
            seconds = `0${seconds}`
        }

        const views = videoData.viewCount.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    
        new IlluminatiEmbed(message, {
            title,
            url: videoData.video_url,
            fields: [
                {
                    name: "Kanava",
                    value: videoData.ownerChannelName,
                    inline: true
                },
                {
                    name: "Julkaisupvm.",
                    value: moment(videoData.publishDate, "YYYY-MM-DD").format("DD.MM.YYYY"),
                    inline: true
                },
                {
                    name: "Näyttökerrat",
                    value: views,
                    inline: true
                },
                {
                    name: "Kesto",
                    value: `${Math.floor(videoData.lengthSeconds / 60)}:${seconds}`,
                    inline: true
                }
            ],
            thumbnail: {
                url: videoData.thumbnails[0].url
            }
        }, this.client).send()
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
