import { CommandArguments } from "../types";

const argsToString = (args: CommandArguments): string => {
    const regExp = /,/gi;
    return args.toString().replace(regExp, " ")
};

export default argsToString;