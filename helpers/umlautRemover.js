const umlautRemover = (str) => {
    // umlaut regular expressions
    const umlautA = /ä/gi;
    const umlautO = /ö/gi;

    return str.replace(umlautO, "o").replace(umlautA, "a")
};
module.exports = umlautRemover;

