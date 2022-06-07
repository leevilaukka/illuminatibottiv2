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

export class PlayerError extends ErrorWithStack {
    constructor(message: string) {
        super(message);
        this.name = "PlayerError";
    }
}

export class DatabaseError extends ErrorWithStack {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}

export class CommandError extends ErrorWithStack {
    constructor(message: string) {
        super(message);
        this.name = "CommandError";
    }
}
