import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    tracks: [
        {
            // Define the schema for a track
            // Assuming each track has an ID and a URL
            id: { type: String, required: true },
            url: { type: String, required: true },
            // Add other track properties as needed
        },
    ],
    author: {
        name: { type: String, required: true },
        url: { type: String, required: true },
    },
    description: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    source: { type: String, required: true },
    thumbnail: { type: String },
    title: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
