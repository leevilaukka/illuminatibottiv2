import mongoose, { Schema } from "mongoose";

const AuthSchema = new Schema({
    userID: { type: String },
    expireAt: { type: Date },
    access_token: {
        type: String,
    },
    refresh_token: { type: String },
    scope: { type: String },
});

export default mongoose.model("Auth", AuthSchema);
