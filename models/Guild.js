const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {defaultSettings: defaults} = require('../config');

const PlaceSchema = new Schema({
    name: String,
    coords: {
        lat: String,
        lon: String
    }
})


const GuildSchema = new Schema({
    guildName: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: defaults.prefix
    },
    volume: {
        type: String,
        default: defaults.volume
    },
    joinedAt: {
        type: Date,
        required: true
    },
    places: [PlaceSchema],
    deletedMessages: [
        {
            message: String,
            author: {
                name: String,
                discriminator: String,
                id: String
            },
            timestamp: String,
            messageID: String,
            channelID: String,
            embeds: Array
        }
    ]
});



module.exports = mongoose.model("Guild", GuildSchema);
