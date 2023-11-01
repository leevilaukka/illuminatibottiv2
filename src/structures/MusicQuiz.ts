import { Collection, EmbedBuilder, GuildMember, Interaction, Message, MessageCollector, VoiceChannel } from 'discord.js';
import IlluminatiClient from './IlluminatiClient';
import { compareTwoStrings, findBestMatch } from 'string-similarity';
import { SearchResult } from 'discord-player';
import { randomArray } from './IlluminatiHelpers';

const { getPreview } = require("spotify-url-info")(fetch);

class MusicQuiz {
    private songUrls: string[];
    private client: IlluminatiClient;
    private interaction: Interaction;
    private timer: NodeJS.Timeout;
    scores: Collection<string, number>;
    collector: MessageCollector;
    private timeout: number;
    private correctAnswer: [boolean, boolean];
    private points: [number, number];
    private rounds: number;
    private playlistUrl: string;
    private currentSongInfo: any
    private guessTimeouts: Collection<string, NodeJS.Timeout>;
    private guessTimeout: number;
    private currentIndex: number;
    private playlist: SearchResult;

    constructor(interaction: Interaction, playlistUrl: string, client: IlluminatiClient, settings?: { timeout: number, rounds: number, points?: [number, number]}) {
        this.songUrls = [];
        this.playlistUrl = playlistUrl;
        this.currentSongInfo = null;
        this.currentIndex = 0;
        this.playlist = null

        this.client = client
        this.interaction = interaction

        this.collector = null;

        this.correctAnswer = [false, false]
        this.rounds = settings.rounds || 10;
        this.points = settings.points || [2, 1];
        this.scores = new Collection<string, number>();

        this.guessTimeouts = new Collection<string, NodeJS.Timeout>();
        this.guessTimeout = 1000;

        this.timeout = settings.timeout || 30000;
        this.timer = setTimeout(() => {
            this.rightAnswer();
            this.nextSong();
        }, settings.timeout);

        this.init();
    }
    
    async init() {
        // Get playlist
        this.playlist = await this.client.player.search(this.playlistUrl, { requestedBy: this.interaction.user })

        // Get all songs from playlist
        const songs = this.playlist.tracks.map(track => track.url);

        // Add all songs to songUrls
        this.songUrls.push(...songs);

        // Shuffle songs
        this.songUrls.sort(() => Math.random() - 0.5);
        // Cut down to amount of rounds
        this.songUrls = this.songUrls.slice(0, this.rounds);        

        // Play first song
        this.playSong(this.songUrls[0]);
    }

    cleanSongName(songName: string) {
        songName = songName.split(" - ")[0];
        songName = songName.replace(/[\(\[](feat|ft|with|featuring)[^\)\]]+?[\)\]]/g, "");
        songName = songName.replace(/\s{2,}/g, " ");
        return songName.trim();
    }

    async nextSong(getNewFromPlaylist: boolean = false) {
        // Reset correct answer
        this.correctAnswer = [false, false];

        // Get random song from songUrls
        const song = this.songUrls[this.currentIndex++];

        if(getNewFromPlaylist) this.songUrls.push(randomArray(this.playlist.tracks).url);

        if(!song) {
            return this.stop();
        }

        // Play song
        this.playSong(song, true);
    }

    async playSong(songUrl: string, skip: boolean = false) {
        this.currentSongInfo = await getPreview(songUrl);

        this.songUrls = this.songUrls.filter(url => url !== songUrl);

        if (!this.currentSongInfo) {
            return this.nextSong(true);
        }

        this.collector = this.interaction.channel.createMessageCollector({ filter: m => !m.author.bot, time: this.timeout }).on('collect', message => {
            this.checkAnswer(message);
        });

        // Play song
        await this.client.player.play((this.interaction.member as GuildMember).voice.channel as VoiceChannel, songUrl, {
            requestedBy: this.interaction.user,
            nodeOptions: {
                metadata: {
                    channel: this.interaction.channel,
                    queueHidden: true,
                }
            }
        }).catch(err => {
            console.error(err);
            // If error, play next song
            return this.nextSong(true);
        }).then(res => {
            // If no song was found, play next song
            if (!res) {
                return this.nextSong(true);
            }

            // Set timer for next song
            this.timer.refresh()

            this.client.isDevelopment && console.log(this.currentSongInfo);
            // Check if song is already playing
            if (skip) {
                // Move song to top of queue
                res.queue.moveTrack(res.queue.tracks.data.length - 1, 0);
                res.queue.node.skip();
            }
        });
    }

    checkAnswer(message: Message) {
        if (message.author.bot) {
            return;
        }

        // Check if user has tried to answer already
        if (this.guessTimeouts.has(message.member.id)) {
            return
        }

        let correct = false;

        const title = this.cleanSongName(this.currentSongInfo.title);
        console.log(title);
        // Set timeout
        this.guessTimeouts.set(message.member.id, setTimeout(() => {
            this.guessTimeouts.delete(message.member.id);
        }, this.guessTimeout));

        // Check similarity of message content and song title and artist
        const titleSimilarity = compareTwoStrings(message.content.toLowerCase(), title.toLowerCase());
        const authorSimilarity = compareTwoStrings(message.content.toLowerCase(), this.currentSongInfo.artist.toLowerCase());

        if (this.client.isDevelopment) {
            console.log(titleSimilarity);
            console.log(authorSimilarity);
        }

        // Check if answer is correct
        if (titleSimilarity > 0.7 && !this.correctAnswer[0]) {
            if (!this.scores.has(message.member.id)) {
                this.scores.set(message.member.id, 0);
            }
            // Add points to user
            this.scores.set(message.member.id, this.scores.get(message.member.id) + this.points[0]);

            message.reply(`Correct! You now have ${this.scores.get(message.member.id)} points!`);
            message.react('🎵');

            this.correctAnswer[0] = true;
            correct = true;
        } else if (authorSimilarity > 0.75 && !this.correctAnswer[1]) {
            if (!this.scores.has(message.member.id)) {
                this.scores.set(message.member.id, 0);
            }
            // Add points to user
            this.scores.set(message.member.id, this.scores.get(message.member.id) + this.points[1]);

            message.reply(`Correct! You now have ${this.scores.get(message.member.id)} points!`);
            message.react('🧑‍🎤');

            this.correctAnswer[1] = true;
            correct = true;
        } else {
            message.react('👎');
        }

        // Check if both answers are correct
        if (this.correctAnswer[0] && this.correctAnswer[1]) {
            this.rightAnswer();
            this.nextSong();
        }

        return this.correctAnswer;
    }

    stop() {
        const queue = this.client.player.queues.get((this.interaction.member as GuildMember).guild.id);
        // Stop timer
        clearTimeout(this.timer);

        // Stop collector
        this.collector.stop();

        // Stop player
        if(queue.isPlaying) queue.node.stop(true);

        // Send scores
        this.interaction.channel.send({ content: "Thanks for playing! Here are the results!", embeds: [this.getScores()] });

        this.scores.clear();
    }

    getScores() {
        // Get scores
        const scores = Array.from(this.scores.entries());

        // Sort scores
        scores.sort((a, b) => b[1] - a[1]);

        // Create embed
        const embed = new EmbedBuilder()
            .addFields(scores.map(score => ({ name: this.client.users.cache.get(score[0]).tag, value: score[1].toString()})))
            .setTitle("Results!")
            .setColor('Default')
        

        // Return embed
        return embed;
    }

    rightAnswer() {
        const embed = new EmbedBuilder()
            .setTitle("New song!")
            .setDescription("Last song was:")
            .setThumbnail(this.currentSongInfo.image)
            .addFields([
                {
                    name: "Title",
                    value: this.currentSongInfo.track,
                    inline: true
                },
                {
                    name: "Artist",
                    value: this.currentSongInfo.artist,
                    inline: true
                }
            ])
           

        this.interaction.channel.send({ embeds: [embed] });
    }
}

export default MusicQuiz;