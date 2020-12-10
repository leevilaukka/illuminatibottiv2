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

const MemberSchema = new Schema({
    name: String,
    id: String
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
    removedMemberChannel: String,
    removedMembers: [MemberSchema],
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
    ],
    throws: {
        type: Array,
        defaults: [
            "https://i.imgur.com/qrzJlKR.jpg",
            "https://i.imgur.com/K5WcvWk.png",
            "https://i.imgur.com/4FEtyd9.png",
            "https://i.imgur.com/f0jDgS9.png",
            "https://i.imgur.com/f0jDgS9.png",
            "https://i.imgur.com/ls7jWCt.png",
            "https://i.imgur.com/vlMWwEk.png",
            "https://i.imgur.com/avQq1Yv.png",
            "https://i.imgur.com/3LzycVP.png",
            "https://i.imgur.com/ZsUP3qK.png",
            "https://i.imgur.com/GxzvpmA.png",
            "https://i.imgur.com/gkr54q4.png",
            "https://i.imgur.com/OeAd8mK.png",
        ]
    }

});



module.exports = mongoose.model("Guild", GuildSchema);
