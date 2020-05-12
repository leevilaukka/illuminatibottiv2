const argsToString = (arguments) => {
    const regExp = /,/gi;
    return arguments.toString().replace(regExp, " ")
};
module.exports = argsToString;