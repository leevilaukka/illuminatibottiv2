import { AnyZodObject } from "zod";
import { UserError } from "../structures/Errors";
import { ArgTypes, Command } from "../types";
import translateTable from "./translateTable";

export const validateArgs =
    (schema: AnyZodObject) =>
    async (args) => {
        if (!schema) return;
        try {
            await schema.parseAsync({
                args,
            });
        } catch (error) {
            throw new UserError(error);
        }
    };


export {
    translateTable
}