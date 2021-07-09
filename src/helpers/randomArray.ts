const randomArray = (array: string | any[]) => {
    return array[Math.floor(Math.random() * array.length)]
};
export default randomArray;