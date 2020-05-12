module.exports = {
    function: umlautFix = (str) => {
        const umlautA = /ä/gi;
        const umlautO = /ö/gi;

        return str.replace(umlautO, "o").replace(umlautA, "a")
    }
};
