const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { defaultSettings: defaults } = require("../config");

const PlaceSchema = new Schema({
  name: String,
  coords: {
    lat: Number,
    lon: Number,
  },
});

const MemberSchema = new Schema({
  name: String,
  id: String,
  discriminator: String
});

const TextChannelSchema = new Schema({
  name: String,
  id: String
})

const DeletedMessageSchema = new Schema({
    message: String,
    author: MemberSchema,
    deletor: MemberSchema,
    timestamp: Date,
    messageID: String,
    channel: TextChannelSchema,
    embeds: Array,
});

const GuildSchema = new Schema({
  guildName: {
    type: String,
    required: true,
  },
  guildID: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: defaults.prefix,
  },
  volume: {
    type: String,
    default: defaults.volume,
  },
  joinedAt: {
    type: Date,
    required: true,
  },
  places: [PlaceSchema],
  removedMemberChannel: String,
  removedMembers: [MemberSchema],
  deletedMessages: [DeletedMessageSchema],
  throws: {
    type: Array,
    default: defaults.throws,
  },
});

module.exports = mongoose.model("Guild", GuildSchema);
