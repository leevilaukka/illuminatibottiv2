import mongoose, { InferSchemaType } from "mongoose";

export type Alcometer = {
    user: string;
    info: AlcometerInfo;
    drinks: AlcometerDrink[];
    bac: number;
    bacHistory: BacHistory[];
    lastDrink: Date;
};


type AlcometerInfo = {
    weight: number;
    gender: "m" | "n";
    lineColor: string;
    guild: string;
};

type AlcometerDrink = {
    name: string;
    volume: number;
    percentage: number;
    alcInGrams: number;
    time: Date;
};

type BacHistory = {
    bac: number;
    time: Date;
};

const alcometerSchema = new mongoose.Schema({
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


export default mongoose.model<Alcometer>("Alcometer", alcometerSchema);