
export class UserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserError";
    }
}

export class BotError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BotError";
    }
}

export class CommandError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandError";
    }
}

export class CommandNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandNotFoundError";
    }
}

export class ErrorWithStack extends BotError {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}