import { Player } from "discord-player";
import { Command } from "../types";
import MusicQuiz from "./MusicQuiz";
import { Interaction, Message } from "discord.js";

/**
 * @class
 * General purpose class for handling bot errors.
 * @extends Error
 */
export class BotError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BotError";
    }
}

/**
 * @class
 * Error for user input errors etc.
 * @extends BotError
 */
export class UserError extends BotError {
    constructor(message: string) {
        super(`Nyt mokasit! | ${message}`);
        this.name = "UserError";
    }
}

/**
 * @class
 * Error to be thrown when command is not found
 * @extends BotError
 */
export class CommandNotFoundError extends BotError {
    constructor(message: string) {
        super(`Command not found: ${message}`);
        this.name = "CommandNotFoundError";
    }
}

/**
 * @class
 * Error to be thrown when a stack trace is wanted to be sent to the guild
 * @extends BotError
 */
export class ErrorWithStack extends BotError {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * @class
 * Error to be thrown when an player error is thrown, sends stack trace to guild
 * @extends ErrorWithStack
 */
export class PlayerError extends ErrorWithStack {
    private Player: Player;
    constructor(message: string, player: Player) {
        super(`Player Error: ${message}`);
        this.name = "PlayerError";
        this.Player = player;
    }

    get player() {
        return this.Player;
    }
}

/**
 * @class
 * Error to be thrown when an database error is thrown, sends stack trace to guild
 * @extends ErrorWithStack
 */
export class DatabaseError extends ErrorWithStack {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}

export class NotFoundError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}


/**
 * @class
 * Error to be thrown when an error in a command is thrown, sends stack trace to guild
 * @extends ErrorWithStack
 */
export class CommandError extends ErrorWithStack {
    private Iniator: Command | Interaction; 
    constructor(message: string, iniator: Command | Interaction) {
        super(message);
        this.name = "CommandError";
        this.Iniator = iniator;
    }

    get iniator() {
        return this.Iniator;
    }
}

export class CommandNotImplementedError extends CommandError {
    constructor(message: string, iniator: Command | Interaction) {
        super(message, iniator)
        this.name = "CommandNotImplemented"
    }
}

export class MusicQuizError extends ErrorWithStack {
    private Quiz: MusicQuiz;
    constructor(message: string, quiz: MusicQuiz) {
        super(message);
        this.name = "MusicQuizError";
        this.Quiz = quiz;
    }

    get quiz() {
        return this.Quiz;
    }
}

export default {
    BotError,
    UserError,
    CommandNotFoundError,
    ErrorWithStack,
    PlayerError,
    DatabaseError,
    CommandError,
    MusicQuizError,
}
