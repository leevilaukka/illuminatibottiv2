import { CommandArguments } from "../types/IlluminatiCommand";

const argsToString = (args: CommandArguments): string => {
    const regExp = /,/gi;
    return args.toString().replace(regExp, " ")
};

export default argsToString;