import mongoose, { Schema } from "mongoose";

const PackageSchema = new Schema({
    owner: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
});

const model = mongoose.model("Package", PackageSchema);

export default model;
