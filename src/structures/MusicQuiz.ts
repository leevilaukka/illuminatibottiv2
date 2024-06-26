import {
    ChatInputCommandInteraction,
    Collection,
    EmbedBuilder,
    GuildMember,
    Message,
    MessageCollector,
    User,
    VoiceChannel,
} from "discord.js";
import IlluminatiClient from "./IlluminatiClient";
import { compareTwoStrings } from "string-similarity";
import { SearchResult } from "discord-player";
import IlluminatiUser from "./IlluminatiUser";
import { MusicQuizError } from "../structures/Errors";

const { getPreview } = require("spotify-url-info")(fetch);

import _ from "lodash";

async function getSpotify(url: string): Promise<SpotifyPreview> {
    return await getPreview(url);
}

type SpotifyPreview = {
    title: string;
    type: string;
    track: string;
    artist: string;
    image: string;
    audio: string;
    link: string;
    embed: string;
    date: string;
    description: string;
};

enum QuizAnswerType {
    TITLE,
    ARTIST,
    YEAR,
}

type PlayerType = {
    user: IlluminatiUser<User>;
    stats: {
        correctAnswers: number;
        incorrectAnswers: number;
        totalAnswers: number;
        totalPoints: number;
        totalWins: number;
    };
};

class MusicQuiz {
    private songUrls: string[];
    private client: IlluminatiClient;
    private interaction: ChatInputCommandInteraction;
    private timer: NodeJS.Timeout;
    scores: Collection<string, number>;
    collector: MessageCollector;
    private locked: boolean;
    fullScore: number;

    private playlistUrl: string;
    private currentSongInfo: SpotifyPreview;
    private guessTimeouts: Collection<string, NodeJS.Timeout>;
    private guessTimeout: number;
    private currentIndex: number;
    private playlist: SearchResult;

    players: Collection<string, PlayerType>;
    vc: VoiceChannel;
    correctAnswer: [boolean, boolean, boolean];

    private options: {
        timeout?: number;
        points?: [number, number, number];
        rounds?: number;
        skipStartTime?: number;
        answerThresholds?: [number, number, number];
        firstArtistOnly?: boolean;
        guessYear: boolean;
    };

    constructor(
        interaction: ChatInputCommandInteraction,
        playlistUrl: string,
        client: IlluminatiClient,
        settings?: typeof MusicQuiz.prototype.options
    ) {
        this.songUrls = [];
        this.playlistUrl = playlistUrl;
        this.currentSongInfo = null;
        this.playlist = null;

        this.client = client;
        this.interaction = interaction;

        this.collector = null;
        this.currentIndex = 0;

        this.options = {
            timeout: settings.timeout || 30000,
            points: settings.points || [
                2 /** Title */, 1 /** Artist */, 1 /** Year */,
            ],
            rounds: settings.rounds || 10,
            skipStartTime: settings.skipStartTime || null,
            answerThresholds: settings.answerThresholds || [0.7, 0.75, 1],
            firstArtistOnly: settings.firstArtistOnly || false,
            guessYear: settings.guessYear || false,
        };

        this.correctAnswer = [false, false, !this.options.guessYear];
        this.locked = false;

        this.vc = (this.interaction.member as GuildMember).voice
            .channel as VoiceChannel;

        this.guessTimeouts = new Collection<string, NodeJS.Timeout>();
        this.guessTimeout = 800;

        this.timer = setTimeout(
            async () => await this.advanceSong(),
            settings.timeout
        );

        this.scores = new Collection<string, number>();
        this.players = new Collection<string, PlayerType>();

        this.fullScore =
            settings.rounds * settings.points[0] +
            settings.rounds * settings.points[1];

        this.init();
    }

    async init() {
        if (!this.vc || !this.vc.joinable) {
            return this.interaction.reply({
                content: "You need to be in a voice channel to start a quiz!",
            });
        }

        this.client.quizzes.set(this.interaction.guildId, this);

        // Get playlist
        this.playlist = await this.client.player.search(this.playlistUrl, {
            requestedBy: this.interaction.user,
        });

        // Add the same number of songs as rounds to songUrls
        this.songUrls = _.shuffle(this.playlist.tracks)
            .splice(0, this.options.rounds)
            .map((track) => track.url);

        // Shuffle songs
        this.vc.members.forEach((member) => {
            this.addPlayer(member);
        });

        console.log(this.players);

        // Play first song
        this.playSong(this.songUrls[0]);
    }

    addPlayer(member: GuildMember) {
        if (this.players.has(member.id)) return;
        if (member.user.bot) return;
        if (!member.voice.channel) return;

        const data = {
            user: new this.client.userManager(member.user),
            stats: {
                correctAnswers: 0,
                incorrectAnswers: 0,
                totalAnswers: 0,
                totalPoints: 0,
                totalWins: 0,
            },
        };

        this.players.set(member.id, data);
    }

    async updatePlayerScore(message: Message, answerType: QuizAnswerType) {
        const reactionTable = ["🎶", "👨‍🎤", "📅"];

        if (!this.scores.has(message.member.id)) {
            this.scores.set(message.member.id, 0);
        }

        if (!this.players.has(message.member.id)) {
            this.addPlayer(message.member);
        }

        this.correctAnswer[answerType] = true;

        // Add points to user
        this.scores.set(
            message.member.id,
            this.scores.get(message.member.id) + this.options.points[answerType]
        );
        this.players.get(message.member.id).stats.totalPoints +=
            this.options.points[answerType];
        this.players.get(message.member.id).stats.correctAnswers++;

        await message.reply(
            `Correct! You now have ${this.scores.get(
                message.member.id
            )} points!`
        );

        message.react(reactionTable[answerType]);
    }

    cleanSongName(songName: string) {
        songName = songName.split(" - ")[0];
        songName = songName.replace(
            /[\(\[](feat|ft|with|featuring)[^\)\]]+?[\)\]]/g,
            ""
        );
        if (songName.includes(" feat"))
            songName = songName.replace(/feat[^$]+$/g, "");
        if (songName.includes("Remastered"))
            songName = songName.replace(/remastered[^$]+$/g, "");
        songName = songName.replace(/\s{2,}/g, " ");

        this.client.isDevelopment && console.log(songName);
        return songName.trim();
    }

    getFirstArtist(artist: string) {
        return artist.split(/,|&/g)[0].trim();
    }

    async nextSong(/*getNewFromPlaylist: boolean = false*/) {
        // Reset correct answer
        this.correctAnswer = [false, false, !this.options.guessYear];

        // Get next song from songUrls
        const song = this.songUrls.splice(0, 1)[0];
        this.currentIndex++;

        /*if (getNewFromPlaylist) {
            console.info("Getting new song from playlist");
            this.songUrls.push(randomArray(this.playlist.tracks).url);
        }*/

        if (!song) {
            console.log("No more songs, stopping quiz");
            return this.stop();
        }

        // Play song
        this.playSong(song, true);
    }

    async advanceSong() {
        if (this.locked) return;
        this.locked = true;
        this.rightAnswer().then(() => {
            this.nextSong();
            this.locked = false;
        });
    }

    async handlePoll(
        message: Message,
        callback: () => Promise<void> | void,
        info: {
            message: string;
            emoji: string;
            requiredVotes: number;
        } = {
            emoji: "",
            message: "",
            requiredVotes: Math.ceil(this.vc.members.size / 2)
        }
    ) {
        const pollMessage = await message.channel.send({
            content: info.message,
        });

        const collector = pollMessage
            .createReactionCollector({
                filter: (reaction, user) =>
                    reaction.emoji.name === info.emoji &&
                    user.id != message.author.id,
                time: 10000,
            })
            .on("collect", async (reactions) => {
                if (reactions.count >= info.requiredVotes) {
                    await callback();
                    collector.stop();
                }
            })
            .on("end", async () => {
                await pollMessage.delete();
                await message.delete();
            });

        await pollMessage.react(info.emoji);
    }

    async playSong(songUrl: string, skip: boolean = false) {
        try {
            this.currentSongInfo = await getSpotify(songUrl);
    
            this.songUrls = this.songUrls.filter((url) => url !== songUrl);
    
            if (!this.currentSongInfo) {
                this.interaction.channel.send({
                    content: "No song info found, skipping song.",
                });
                return await this.nextSong();
            }
    
            this.collector = this.interaction.channel
                .createMessageCollector({
                    filter: (m) => !m.author.bot,
                    time: this.options.timeout,
                })
                .on("collect", async (m) => await this.checkAnswer(m));
    
            // Play song
            this.client.player
                .play(this.vc, songUrl, {
                    requestedBy: this.client.user,
                    nodeOptions: {
                        metadata: {
                            channel: this.interaction.channel,
                            queueHidden: true,
                        },
                    },
                })
                .catch(async (err) => {
                    console.error(err);
                    // If error, play next song
                    this.interaction.channel.send({
                        content: "Error playing song, skipping song.",
                    });
                    return await this.nextSong();
                })
                .then(async (res) => {
                    // If no song was found, play next song
                    if (!res) {
                        this.interaction.channel.send({
                            content: "No song found, skipping song.",
                        });
                        return await this.nextSong();
                    }
    
                    // Set timer for next song
                    this.timer.refresh();
    
                    this.options.skipStartTime > 5 &&
                        (await res.queue.node.seek(
                            this.options.skipStartTime * 1000 +
                                Math.random() * randomNumberBetween(0, 5000)
                        ));
    
                    this.client.isDevelopment && console.log(this.currentSongInfo);
                    // Check if song is already playing
                    if (skip) {
                        // Move song to top of queue
                        // res.queue.moveTrack(res.queue.tracks.data.length - 1, 0);
                        res.queue.node.skip();
                    }
                });
        } catch (error) {
            throw new MusicQuizError(`PlaySong: ${error}`, this)
        }
    }

    async checkAnswer(message: Message) {
        try {
            if (this.locked) return;

            const { content } = message;

            if (content.toLowerCase() === "stop!!")
                return await this.handlePoll(message, this.stop, {
                    message: "Vote to stop quiz!",
                    emoji: "🏁",
                    requiredVotes: Math.ceil(this.vc.members.size / 2),
                });

            if (content.toLowerCase() === "skip!!") 
                return await this.handlePoll(message, this.advanceSong, {
                    message: "Vote to skip song!",
                    emoji: "⏭️",
                    requiredVotes: Math.ceil(this.vc.members.size / 2),
                });
            
            // Check if user has tried to answer already
            if (this.guessTimeouts.has(message.member.id)) {
                return;
            }

            // Clean song title
            const title = this.cleanSongName(this.currentSongInfo.track);
            const artist =
                (this.options.firstArtistOnly &&
                    this.getFirstArtist(this.currentSongInfo.artist)) ||
                this.currentSongInfo.artist;

            const releaseYear = new Date(this.currentSongInfo.date)
                .getFullYear()
                .toString();

            // Set timeout
            this.guessTimeouts.set(
                message.member.id,
                setTimeout(() => {
                    this.guessTimeouts.delete(message.member.id);
                }, this.guessTimeout)
            );

            const similarities = [
                compareTwoStrings(content.toLowerCase(), title.toLowerCase()),
                compareTwoStrings(content.toLowerCase(), artist.toLowerCase()),
            ];

            const correct = (type: QuizAnswerType) =>
                similarities[type] > this.options.answerThresholds[type] &&
                !this.correctAnswer[type];

            if (this.client.isDevelopment) console.log(similarities);

            // Check if answer is correct
            if (correct(QuizAnswerType.TITLE)) {
                this.updatePlayerScore(message, QuizAnswerType.TITLE);
            } else if (correct(QuizAnswerType.ARTIST)) {
                this.updatePlayerScore(message, QuizAnswerType.ARTIST);
            } else if (this.options.guessYear && content === releaseYear) {
                this.updatePlayerScore(message, QuizAnswerType.YEAR);
                this.correctAnswer[QuizAnswerType.YEAR] = true;
            } else {
                message.react("👎");
                this.players.get(message.member.id).stats.incorrectAnswers++;
            }

            // Check if both answers are correct
            if (
                this.correctAnswer[QuizAnswerType.TITLE] &&
                this.correctAnswer[QuizAnswerType.ARTIST] &&
                (this.options.guessYear
                    ? this.correctAnswer[QuizAnswerType.YEAR]
                    : true)
            )
                await this.advanceSong();
        } catch (error) {
            throw new MusicQuizError(error, this);
        }
    }

    async stop() {
        const queue = this.client.player.nodes.get(this.interaction.guildId);
        // Stop timer
        clearTimeout(this.timer);

        // Stop collector
        this.collector.stop();

        // Stop player
        queue?.node.stop();

        // Send scores
        await this.interaction.channel.send({
            content: "Thanks for playing! Here are the results!",
            embeds: [await this.getScores()],
        });

        this.client.quizzes.delete(this.interaction.guildId);

        this.scores.clear();
    }

    async getScores() {
        // Get scores
        const scores = Array.from(this.scores.entries());

        // Sort scores
        scores.sort((a, b) => b[1] - a[1]);

        // Create embed
        const embed = new EmbedBuilder()
            .addFields(
                scores.map((score) => ({
                    name: this.client.users.cache.get(score[0]).tag,
                    value:
                        (score[1] === this.fullScore &&
                            `${score[1].toString()} - FC :medal:`) ||
                        score[1].toString(),
                }))
            )
            .setTitle("Results!")
            .setColor("Default");

        this.players.forEach(async (player) => {
            if (!player.user) return;
            if (scores[0][0] === player.user.id) {
                return await this.updatePlayerStats(player.user, true);
            }

            await this.updatePlayerStats(player.user);
        });

        // Return embed
        return embed;
    }

    async rightAnswer() {
        const embed = new EmbedBuilder()
            .setTitle("New song!")
            .setDescription("Last song was:")
            .addFields([
                {
                    name: "Title",
                    value: this.currentSongInfo.track,
                    inline: true,
                },
                {
                    name: "Artist",
                    value: this.currentSongInfo.artist,
                    inline: true,
                },
                {
                    name: "Year",
                    value: new Date(this.currentSongInfo.date)
                        .getFullYear()
                        .toString(),
                },
            ])
            .setFooter({
                text: `Song ${this.currentIndex + 1}/${this.options.rounds}`,
            });

        this.currentSongInfo.image &&
            embed.setThumbnail(this.currentSongInfo.image);

        await this.interaction.channel.send({ embeds: [embed] });
        return this;
    }

    async updatePlayerStats(
        member: IlluminatiUser<User>,
        won: boolean = false
    ) {
        const { stats } = this.players.get(member.id);
        const userStats = await member.getStats();

        const totalAnswers = stats.correctAnswers + stats.incorrectAnswers;

        await member.updateUserStats({
            musicQuiz: {
                totalPoints:
                    userStats.musicQuiz.totalPoints + stats.totalPoints,
                totalAnswers: userStats.musicQuiz.totalAnswers + totalAnswers,
                correctAnswers:
                    userStats.musicQuiz.correctAnswers + stats.correctAnswers,
                incorrectAnswers:
                    userStats.musicQuiz.incorrectAnswers +
                    stats.incorrectAnswers,
                totalWins: userStats.musicQuiz.totalWins + (won ? 1 : 0),
                totalGames: userStats.musicQuiz.totalGames + 1,
            },
        });
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

    get currentOptions() {
        return this.options;
    }

    get list() {
        return this.playlist.playlist;
    }
}

export default MusicQuiz;

function randomNumberBetween(arg0: number, arg1: number): number {
    return Math.random() * (arg1 - arg0) + arg0;
}
