import { categories } from "../utils";

const getCommandCategory = (categoryCode: string) => {
    // Check category array for categoryCode and return category name
    for (let i = 0; i < categories.length; i++) {
        if(categories[i].categoryCode === categoryCode){
            return categories[i].name
        }
    }
};

export default getCommandCategory;