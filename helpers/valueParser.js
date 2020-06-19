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
        {
            original: "volume",
            parsed: "Tilavuus"
        },
        {
            original: "length",
            parsed: "Pituus"
        },
        {
            original: "area",
            parsed: "Pinta-ala"
        },
        {
            original: "mass",
            parsed: "Massa"
        },
        {
            original: "each",
            parsed: "Kappalemäärä"
        },
        {
            original: "temperature",
            parsed: "Lämpötila"
        },
        {
            original: "time",
            parsed: "Aika"
        },
        {
            original: "digital",
            parsed: "Tallennustila"
        },
        {
            original: "partsPer",
            parsed: "Parts per (ppm)"
        },
        {
            original: "speed",
            parsed: "Nopeus"
        },
        {
            original: "pace",
            parsed: "Tahti"
        },
        {
            original: "pressure",
            parsed: "Paine"
        },
        {
            original: "current",
            parsed: "Sähkövirta"
        },
        {
            original: "voltage",
            parsed: "Jännite"
        },
        {
            original: "power",
            parsed: "Teho"
        },
        {
            original: "reactivePower",
            parsed: "Loisteho"
        },
        {
            original: "apparentPower",
            parsed: "Näennäisteho"
        },
        {
            original: "energy",
            parsed: "Energia"
        },
        {
            original: "reactiveEnergy",
            parsed: "Loisenergia"
        },
        {
            original: "volumeFlowRate",
            parsed: "Tilavuusvirta"
        },
        {
            original: "illuminance",
            parsed: "Valaistusvoimakkuus"
        },
        {
            original: "frequency",
            parsed: "Taajuus"
        },
        {
            original: "angle",
            parsed: "Kulma"
        },


    ];

    for(let i=0; i < array.length; i++){
        if(array[i].original === value){
            return array[i].parsed
        }
    }
};
module.exports = valueParser;