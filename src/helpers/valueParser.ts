import array from "../utils/translateTable";

const valueParser = (value: any) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].original === value) {
            return array[i].parsed;
        }
    }
};

export default valueParser;
