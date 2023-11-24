import { Collection, EmbedBuilder, GuildMember, Interaction, Message, MessageCollector, User, VoiceChannel } from 'discord.js';
import IlluminatiClient from './IlluminatiClient';
import { compareTwoStrings } from 'string-similarity';
import { SearchResult } from 'discord-player';
import { randomArray } from './IlluminatiHelpers';
import IlluminatiUser from './IlluminatiUser';

const { getPreview } = require("spotify-url-info")(fetch);

enum QuizAnswerType {
    TITLE,
    ARTIST,
}

type PlayerType = {
    user: IlluminatiUser<User>,
    correctAnswers: number,
    incorrectAnswers: number,
    totalAnswers: number,
    totalPoints: number,
    totalWins: number,
}

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
    private skipStartTime: number;
    private answerThresholds: [number, number];
    players: Collection<string, PlayerType>;

    constructor(interaction: Interaction, playlistUrl: string, client: IlluminatiClient, settings?: { timeout: number, rounds: number, points?: [number, number], answerThresholds?: [number, number], skipStartTime?: number}) {
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
        this.skipStartTime = settings.skipStartTime || null;

        this.guessTimeouts = new Collection<string, NodeJS.Timeout>();
        this.guessTimeout = 1000;

        this.players = new Collection<string, PlayerType>();

        this.timeout = settings.timeout || 30000;
        this.timer = setTimeout(() => {
            this.rightAnswer();
            this.nextSong();
        }, settings.timeout);

        this.answerThresholds = settings.answerThresholds || [0.7, 0.75];

        this.init();
    }
    
    async init() {
        // Get playlist
        this.playlist = await this.client.player.search(this.playlistUrl, { requestedBy: this.interaction.user })
    
        // Add the same number of songs as rounds to songUrls
        this.songUrls = this.playlist.tracks.splice(0, this.rounds).map(track => track.url);

        console.log(this.songUrls.length);
    
        // Shuffle songs
        this.songUrls.sort(() => Math.random() - 0.5);

        (this.interaction.member as GuildMember).voice.channel.members.forEach(member => {
            const data = {
                user: new this.client.userManager(member.user),
                correctAnswers: 0,
                incorrectAnswers: 0,
                totalAnswers: 0,
                totalPoints: 0,
                totalWins: 0,
            }

            if(!member.user.bot) this.players.set(member.id, data);
        });

        console.log(this.players);

        // Play first song
        this.playSong(this.songUrls[0]);
    }

    cleanSongName(songName: string) {
        songName = songName.split(" - ")[0];
        songName = songName.replace(/[\(\[](feat|ft|with|featuring)[^\)\]]+?[\)\]]/g, "");
        if(songName.includes(" feat")) songName = songName.replace(/feat[^$]+$/g, "");
        songName = songName.replace(/\s{2,}/g, " ");
        
        this.client.isDevelopment && console.log(songName);
        return songName.trim();
    }

    async nextSong(/*getNewFromPlaylist: boolean = false*/) {
        // Reset correct answer
        this.correctAnswer = [false, false];

        // Get random song from songUrls
        const song = this.songUrls[this.currentIndex++];

        /*if (getNewFromPlaylist) {
            console.info("Getting new song from playlist");
            this.songUrls.push(randomArray(this.playlist.tracks).url);
        }*/

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
            console.error("No song info found, skipping song."); 
            return this.nextSong();
        }

        this.collector = this.interaction.channel.createMessageCollector({ filter: m => !m.author.bot, time: this.timeout }).on('collect', message => {
            this.checkAnswer(message);
        });

        // Play song
        
        this.client.player.play((this.interaction.member as GuildMember).voice.channel as VoiceChannel, songUrl, {
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
            console.error("Error playing song, skipping song.");
            return this.nextSong();
        }).then(res => {
            // If no song was found, play next song
            if (!res) {
                console.error("No song found, skipping song.");
                return this.nextSong();
            }

            // Set timer for next song
            this.timer.refresh()

            this.skipStartTime > 1 && res.queue.node.seek(this.skipStartTime * 1000);

            this.client.isDevelopment && console.log(this.currentSongInfo);
            // Check if song is already playing
            if (skip) {
                // Move song to top of queue
                res.queue.moveTrack(res.queue.tracks.data.length - 1, 0);
                res.queue.node.skip();
            }
        });
    }

    async checkAnswer(message: Message) {
        if (message.author.bot) {
            return;
        }

        if (message.content.toLowerCase() === "!!stop!!") {
            return this.stop();
        }

        // Check if user has tried to answer already
        if (this.guessTimeouts.has(message.member.id)) {
            return
        }

        // Clean song title
        const title = this.cleanSongName(this.currentSongInfo.track);

        // Set timeout
        this.guessTimeouts.set(message.member.id, setTimeout(() => {
            this.guessTimeouts.delete(message.member.id);
        }, this.guessTimeout));

        const similarities = [compareTwoStrings(message.content.toLowerCase(), title.toLowerCase()), compareTwoStrings(message.content.toLowerCase(), this.currentSongInfo.artist.toLowerCase())];

        if (this.client.isDevelopment) {
            console.log(similarities);
        }

        // Check if answer is correct
        if (similarities[QuizAnswerType.TITLE] > this.answerThresholds[QuizAnswerType.TITLE] && !this.correctAnswer[QuizAnswerType.TITLE]) {
            if (!this.scores.has(message.member.id)) {
                this.scores.set(message.member.id, 0);
            }
            // Add points to user
            this.scores.set(message.member.id, this.scores.get(message.member.id) + this.points[0]);

            message.reply(`Correct! You now have ${this.scores.get(message.member.id)} points!`);
            message.react('🎵');

            this.correctAnswer[QuizAnswerType.TITLE] = true;
        } else if (similarities[QuizAnswerType.ARTIST] > this.answerThresholds[QuizAnswerType.ARTIST] && !this.correctAnswer[QuizAnswerType.ARTIST]) {
            if (!this.scores.has(message.member.id)) {
                this.scores.set(message.member.id, 0);
            }
            // Add points to user
            this.scores.set(message.member.id, this.scores.get(message.member.id) + this.points[1]);

            message.reply(`Correct! You now have ${this.scores.get(message.member.id)} points!`);
            message.react('🧑‍🎤');

            this.correctAnswer[QuizAnswerType.ARTIST] = true;
        } else {
            message.react('👎');
        }

        // Check if both answers are correct
        if (this.correctAnswer[QuizAnswerType.TITLE] && this.correctAnswer[QuizAnswerType.ARTIST]) {
            this.rightAnswer();
            this.nextSong();
        }
    }

    async stop() {
        const queue = this.client.player.queues.get((this.interaction.member as GuildMember).guild.id);
        // Stop timer
        clearTimeout(this.timer);

        // Stop collector
        this.collector.stop();

        // Stop player
        if(queue.isPlaying()) queue.node.stop(true);

        // Send scores
        this.interaction.channel.send({ content: "Thanks for playing! Here are the results!", embeds: [await this.getScores()] });

        this.client.quizzes.delete(this.interaction.guildId);

        this.scores.clear();
    }

    async getScores() {
        // Get scores
        const scores = Array.from(this.scores.entries());

        // Sort scores
        scores.sort((a, b) => b[1] - a[1]);

        const winner = new this.client.userManager(this.client.users.cache.get(scores[0][0]));
        const winnerData = await winner.getStats();

        // Update stats
        winner.updateUserStats({
            musicQuiz: {
                totalWins: winnerData.musicQuiz.totalWins + 1,
            }
        });

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
            .setFooter({
                text:`Song ${this.currentIndex + 1}/${this.rounds}`
            })
           

        this.interaction.channel.send({ embeds: [embed] });
    }

    get currentSong() {
        return this.currentSongInfo;
    }

    get currentSongIndex() {
        return this.currentIndex;
    }

    get currentSongUrl() {
        return this.songUrls[this.currentIndex];
    }

    get urls() {
        return this.songUrls;
    }

    get currentScores() {
        return this.scores;
    }

    get currentTimeout() {
        return this.timer;
    }

    get messageCollector() {
        return this.collector;
    }

    get originalInteraction() {
        return this.interaction;
    }
}

export default MusicQuiz;