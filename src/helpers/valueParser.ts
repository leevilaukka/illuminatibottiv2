import { translateTable } from "../utils";

const valueParser = (value: any) => {
    // Get value from translate table array of objects
    const translatedValue = translateTable.find((v) => v.original === value);

    // If value is found, return the translated value
    if (translatedValue) return translatedValue.parsed;

    // If value is not found, return the original value
    return value;
};

export default valueParser;
