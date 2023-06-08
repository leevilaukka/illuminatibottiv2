import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: String,
    tracks: [Object],
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
