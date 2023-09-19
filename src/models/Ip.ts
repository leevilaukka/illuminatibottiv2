import { Schema, model } from "mongoose";

const IPSchema = new Schema({
    botID: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    domains: [
        {
            name: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            }
        }
    ]
});

const IP = model("IP", IPSchema);

export default IP;