import { User } from "discord.js";
import Alcometer from "../models/Alcometer";

export default async function Meter(user: User) {
    const meter = await Alcometer.findOne({ user: user.id });

    return {
        get: () => meter,
        hasMeter: () => meter !== null,
        start: ({
            weight,
            gender,
            user,
        }: {
            weight: number;
            gender: "m" | "n";
            user: User;
        }) => {
            const newAlcometer = new Alcometer({
                user: user.id,
                info: {
                    weight: weight,
                    gender: gender,
                    lineColor: `#${Math.floor(
                        Math.random() * 16777215
                    ).toString(16)}`,
                },
                drinks: [],
                bac: 0,
                lastDrink: null,
            });

            newAlcometer.save();

            return newAlcometer;
        },

        getDrinks: () => meter.drinks,

        decrementBAC: async () => {
            const time = new Date().getTime() - meter.lastDrink.getTime();
            const hours = time / 1000 / 60 / 60;

            const bac = meter.bac - 0.1 * hours;
            meter.bac = bac < 0 ? 0 : bac;

            await meter.save();
        },

        updateBAC: async () => {
            meter.bac = 0;
            meter.drinks.forEach((drink) => {
                const time = new Date().getTime() - drink.time.getTime();
                const hours = time / 1000 / 60 / 60;

                const bac =
                    drink.alcInGrams / (meter.info.weight * 0.7) - 0.1 * hours;
                meter.bac += bac;
            });

            meter.bacHistory.push({
                bac: meter.bac,
                time: new Date(),
            });

            await meter.save();
        },

        addDrink: async (drink: {
            name: string;
            volume: number;
            percentage: number;
            alcInGrams: number;
            time: Date;
        }) => {
            meter.drinks.push(drink);
            meter.lastDrink = drink.time;

            console.log("Added drink");

            (await Meter(user)).updateBAC();

            await meter.save();
        },

        joinGuild: async (guildId: string) => {
            meter.info.guild = guildId;
            await meter.save();
        },

        clearHistory: async () => {
            meter.bacHistory = [{ bac: 0, time: new Date()}];
            await meter.save();
        },
    };
}
