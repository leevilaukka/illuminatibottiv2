import { FixedSizeArray } from "../types";

const argsToString = (args: FixedSizeArray<number>): string => {
    const regExp = /,/gi;
    return args.toString().replace(regExp, " ")
};

export default argsToString;