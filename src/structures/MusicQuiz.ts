import { Collection, EmbedBuilder, GuildMember, Interaction, Message, MessageCollector, User, VoiceChannel } from 'discord.js';
import IlluminatiClient from './IlluminatiClient';
import { compareTwoStrings } from 'string-similarity';
import { SearchResult } from 'discord-player';
import IlluminatiUser from './IlluminatiUser';

const { getPreview } = require("spotify-url-info")(fetch);

enum QuizAnswerType {
    TITLE,
    ARTIST,
}

type PlayerType = {
    user: IlluminatiUser<User>,
    stats: {
        correctAnswers: number,
        incorrectAnswers: number,
        totalAnswers: number,
        totalPoints: number,
        totalWins: number,
    }
}

class MusicQuiz {
    private songUrls: string[];
    private client: IlluminatiClient;
    private interaction: Interaction;
    private timer: NodeJS.Timeout;
    scores: Collection<string, number>;
    collector: MessageCollector;
    
    private playlistUrl: string;
    private currentSongInfo: {
        track: string,
        artist: string,
        image: string,
    }
    private guessTimeouts: Collection<string, NodeJS.Timeout>;
    private guessTimeout: number;
    private currentIndex: number;
    private playlist: SearchResult; 
    private skipStartTimeVariance: number;

    players: Collection<string, PlayerType>;
    vc: VoiceChannel;
    correctAnswer: [boolean, boolean];

    private options: {
        timeout?: number;
        points?: [number, number];
        rounds?: number;
        skipStartTime?: number;
        answerThresholds?: [number, number];
        firstArtistOnly?: boolean;
    }

    constructor(interaction: Interaction, playlistUrl: string, client: IlluminatiClient, settings?: typeof MusicQuiz.prototype.options) {
        this.songUrls = [];
        this.playlistUrl = playlistUrl;
        this.currentSongInfo = null;
        this.currentIndex = 0;
        this.playlist = null

        this.client = client
        this.interaction = interaction

        this.collector = null;

        this.options = {
            timeout: settings.timeout || 30000,
            points: settings.points || [2, 1],
            rounds: settings.rounds || 10,
            skipStartTime: settings.skipStartTime || null,
            answerThresholds: settings.answerThresholds || [0.7, 0.75],
            firstArtistOnly: settings.firstArtistOnly || false,
        }

        this.correctAnswer = [false, false];

        this.skipStartTimeVariance = 2000;

        this.vc = (this.interaction.member as GuildMember).voice.channel as VoiceChannel;

        this.guessTimeouts = new Collection<string, NodeJS.Timeout>();
        this.guessTimeout = 500;

        this.players = new Collection<string, PlayerType>();

        this.timer = setTimeout(() => {
            this.rightAnswer();
            this.nextSong();
        }, settings.timeout);

        this.scores = new Collection<string, number>();


        this.init();
    }
    
    async init() {
        this.client.quizzes.set(this.interaction.guildId, this);

        // Get playlist
        this.playlist = await this.client.player.search(this.playlistUrl, { requestedBy: this.interaction.user })
        
        // Add the same number of songs as rounds to songUrls
        this.songUrls = this.playlist.tracks.sort(() => Math.random() - 0.5).splice(0, this.options.rounds).map(track => track.url);
    
        // Shuffle songs
        this.vc.members.forEach(member => {
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
            }
        }

        this.players.set(member.id, data);
    }

    cleanSongName(songName: string) {
        songName = songName.split(" - ")[0];
        songName = songName.replace(/[\(\[](feat|ft|with|featuring)[^\)\]]+?[\)\]]/g, "");
        if(songName.includes(" feat")) songName = songName.replace(/feat[^$]+$/g, "");
        songName = songName.replace(/\s{2,}/g, " ");
        
        this.client.isDevelopment && console.log(songName);
        return songName.trim();
    }

    getFirstArtist(artist: string) {
        return artist.split(/,|&/g)[0].trim();
    }


    async nextSong(/*getNewFromPlaylist: boolean = false*/) {
        // Reset correct answer
        this.correctAnswer = [false, false];

        // Get next song from songUrls
        const song = this.songUrls[this.currentIndex++];

        /*if (getNewFromPlaylist) {
            console.info("Getting new song from playlist");
            this.songUrls.push(randomArray(this.playlist.tracks).url);
        }*/

        if(!song) {
            console.log("No more songs, stopping quiz");
            return this.stop();
        }

        // Play song
        this.playSong(song, true);
    }

    async playSong(songUrl: string, skip: boolean = false) {
        this.currentSongInfo = await getPreview(songUrl);

        this.songUrls = this.songUrls.filter(url => url !== songUrl);
        console.log("playSong:", this.songUrls, this.songUrls.length)

        if (!this.currentSongInfo) {
            console.error("No song info found, skipping song."); 
            this.interaction.channel.send({ content: "No song info found, skipping song." });
            return this.nextSong();
        }

        this.collector = 
            this.interaction.channel.createMessageCollector({ filter: m => !m.author.bot, time: this.options.timeout })
            .on('collect', m => this.checkAnswer(m));

        // Play song
        this.client.player.play(this.vc, songUrl, {
            requestedBy: this.client.user,
            nodeOptions: {
                metadata: {
                    channel: this.interaction.channel,
                    queueHidden: true,
                }
            }
        }).catch(err => {
            console.error(err);
            // If error, play next song
            this.interaction.channel.send({ content: "Error playing song, skipping song." });
            return this.nextSong();
        }).then(res => {
            // If no song was found, play next song
            if (!res) {
                console.error("No song found, skipping song.");
                this.interaction.channel.send({ content: "No song found, skipping song." });
                return this.nextSong();
            }
            // Set timer for next song
            this.timer.refresh()

            this.options.skipStartTime > 5 && res.queue.node.seek(this.options.skipStartTime * 1000 + Math.random() * this.skipStartTimeVariance);

            this.client.isDevelopment && console.log(this.currentSongInfo);
            // Check if song is already playing
            if (skip) {
                // Move song to top of queue
                // res.queue.moveTrack(res.queue.tracks.data.length - 1, 0);
                res.queue.node.skip();
            }
        });
    }

    async checkAnswer(message: Message) {
        if (message.author.bot) {
            return;
        }

        if (message.content.toLowerCase() === "stop!!") {
            return this.stop();
        }

        // Check if user has tried to answer already
        if (this.guessTimeouts.has(message.member.id)) {
            return
        }

        // Clean song title
        const title = this.cleanSongName(this.currentSongInfo.track);
        const artist = this.options.firstArtistOnly && this.getFirstArtist(this.currentSongInfo.artist) || this.currentSongInfo.artist;

        // Set timeout
        this.guessTimeouts.set(message.member.id, setTimeout(() => {
            this.guessTimeouts.delete(message.member.id);
        }, this.guessTimeout));

        const similarities = [compareTwoStrings(message.content.toLowerCase(), title.toLowerCase()), compareTwoStrings(message.content.toLowerCase(), artist.toLowerCase())];

        if (this.client.isDevelopment) {
            console.log(similarities);
        }

        // Check if answer is correct
        if (similarities[QuizAnswerType.TITLE] > this.options.answerThresholds[QuizAnswerType.TITLE] && !this.correctAnswer[QuizAnswerType.TITLE]) {
            if (!this.scores.has(message.member.id)) {
                this.scores.set(message.member.id, 0);
            }

            if (!this.players.has(message.member.id)) {
                this.addPlayer(message.member as GuildMember);
            }

            this.correctAnswer[QuizAnswerType.TITLE] = true;

            // Add points to user
            this.scores.set(message.member.id, this.scores.get(message.member.id) + this.options.points[QuizAnswerType.TITLE]);
            this.players.get(message.member.id).stats.totalPoints += this.options.points[QuizAnswerType.TITLE];
            this.players.get(message.member.id).stats.correctAnswers++;

            message.reply(`Correct! You now have ${this.scores.get(message.member.id)} points!`);
            message.react('🎵');

        } else if (similarities[QuizAnswerType.ARTIST] > this.options.answerThresholds[QuizAnswerType.ARTIST] && !this.correctAnswer[QuizAnswerType.ARTIST]) {
            if (!this.scores.has(message.member.id)) {
                this.scores.set(message.member.id, 0);
            }

            this.correctAnswer[QuizAnswerType.ARTIST] = true;

            // Add points to user
            this.scores.set(message.member.id, this.scores.get(message.member.id) + this.options.points[QuizAnswerType.ARTIST]);
            this.players.get(message.member.id).stats.totalPoints += this.options.points[QuizAnswerType.ARTIST];
            this.players.get(message.member.id).stats.correctAnswers++;

            message.reply(`Correct! You now have ${this.scores.get(message.member.id)} points!`);
            message.react('🧑‍🎤');
        } else {
            message.react('👎');
            this.players.get(message.member.id).stats.incorrectAnswers++;
        }

        // Check if both answers are correct
        if (this.correctAnswer[QuizAnswerType.TITLE] && this.correctAnswer[QuizAnswerType.ARTIST]) {
            this.rightAnswer();
            this.nextSong();
        }
    }

    async stop() {
        const queue = this.client.player.nodes.get(this.interaction.guildId);
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

        // Create embed
        const embed = new EmbedBuilder()
            .addFields(scores.map(score => ({ name: this.client.users.cache.get(score[0]).tag, value: score[1].toString()})))
            .setTitle("Results!")
            .setColor('Default')
        

        this.players.forEach(async player => {
            if (!player.user) return;

            if (scores[0][0] === player.user.id) {
                return await this.updatePlayerStats(player.user, true);
            }

            await this.updatePlayerStats(player.user);
        });

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
                text:`Song ${this.currentIndex + 1}/${this.options.rounds}`
            })
           

        this.interaction.channel.send({ embeds: [embed] });
    }

    async updatePlayerStats(member: IlluminatiUser<User>, won: boolean = false) {
        const { stats } = this.players.get(member.id);
        const userStats = await member.getStats();

        await member.updateUserStats({
            musicQuiz: {
                totalPoints: userStats.musicQuiz.totalPoints + stats.totalPoints,
                totalAnswers: userStats.musicQuiz.totalAnswers + stats.totalAnswers,
                correctAnswers: userStats.musicQuiz.correctAnswers + stats.correctAnswers,
                incorrectAnswers: userStats.musicQuiz.incorrectAnswers + stats.incorrectAnswers,
                totalWins: userStats.musicQuiz.totalWins + (won ? 1 : 0),
                totalGames: userStats.musicQuiz.totalGames + 1,
            }
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