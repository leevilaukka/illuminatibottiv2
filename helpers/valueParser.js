const array = require("../utils/translateTable");

const valueParser = (value) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].original === value) {
            return array[i].parsed;
        }
    }
};

module.exports = valueParser;
