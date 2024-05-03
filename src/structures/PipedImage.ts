import fs from 'fs';
import Discord from 'discord.js';
import { resolve } from 'path';

/** 
 * @name AttachmentWriterWrapper
 * 
 * @description This class is used to create temporary files for Discord.js AttachmentBuilder
 * If the file is not deleted within 5 minutes, it will be deleted automatically.
 * 
 * onFinish() method callback is ran when writer finishes, used to send the file to Discord etc, also deletes the file.
 * 
 * @param path The path to the file
 * @param name The name of the file
 * 
 * @example
 * const { attachment, onFinish } = new AttachmentWriterWrapper("./temp/image.png", "image.png");
 * onFinish(() => {
 *     message.send({ files: [attachment] }})
 * }) 
*/
class AttachmentWriterWrapper {
    private _path: string;
    private _writer: fs.WriteStream;
    private _attachment: Discord.AttachmentBuilder;

    constructor(path?: string, name?: string) {
        this._path = path || resolve(`./temp/${Math.random().toString(36).substring(7)}.png`);
        this._attachment = new Discord.AttachmentBuilder(this._path, {
            name: name || "image",
        });
        
        this._writer = fs.createWriteStream(this._path, {
            flags: "w",
        });

        setTimeout(() => {
            this.unlink();
        }, 1000 * 60 * 5);
    }

    get path() {
        return this._path;
    }

    get writer() {
        return this._writer;
    }

    set path(path: string) {
        this._path = path;
    }

    set writer(writer: fs.WriteStream) {
        this._writer = writer;
    }

    public unlink() {
        fs.unlink(this._path, (err) => {
            throw err;
        });

        return this;
    }

    public onFinish(func: () => void) {
        this._writer.on("finish", func);
        this.unlink();
        return this;
    }


    get attachment() {
        return this._attachment;
    }
}

export default AttachmentWriterWrapper;