const valueParser = (value) => {
    const array = [
        {
            original: "CLOSED_TEMPORARILY",
            parsed: "Väliaikaisesti suljettu"
        },
        {
            original: "OPERATIONAL",
            parsed: "Toiminnassa"
        },
        {
            original: "CLOSED_PERMANENTLY",
            parsed: "Suljettu pysyvästi"
        },

    ];
    for(let i=0; i < array.length; i++){
        if(array[i].original === value){
            return array[i].parsed
        }
    }
};
module.exports = valueParser;