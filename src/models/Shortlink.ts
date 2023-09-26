import mongoose, { Schema } from "mongoose";

const ShortlinkSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    uses: {
        type: Number,
        default: 0,
    },
    owner: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const model = mongoose.model("Shortlink", ShortlinkSchema);

export default model;