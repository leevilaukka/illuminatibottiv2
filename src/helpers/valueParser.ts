import {translateTable} from "../utils";

const valueParser = (value: any) => {
    for (let i = 0; i < translateTable.length; i++) {
        if (translateTable[i].original === value) {
            return translateTable[i].parsed;
        }
    }
};

export default valueParser;
