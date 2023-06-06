import mongoose, { ObjectId, PopulatedDoc, Document } from "mongoose";
import { IlluminatiUserTypes } from "../structures/IlluminatiUser";
import User from "./User";
import { Guild } from "discord.js";

interface IAlcometer {
    user: string;
    info: {
        weight: number;
        gender: string;
        lineColor: string;
        guild: string;
    };
    drinks: [
        {
            name: string;
            volume: number;
            percentage: number;
            alcInGrams: number;
            time: Date;
        }
    ];
    bac: number;
    bacHistory: [
        {
            bac: number;
            time: Date;
        }
    ];
    lastDrink: Date;
}

const alcometerSchema = new mongoose.Schema<IAlcometer>({
    user: {
        type: String,
        required: true,
    },
    info: {
        weight: Number,
        gender: String,
        lineColor: String,
        guild: String,
    },
    drinks: [
        {
            name: String,
            volume: Number,
            percentage: Number,
            alcInGrams: Number,
            time: Date,
        },
    ],
    bac: Number,
    bacHistory: [
        {
            bac: Number,
            time: Date,
        },
    ],
    lastDrink: Date,
});

export default mongoose.model<IAlcometer>("Alcometer", alcometerSchema);