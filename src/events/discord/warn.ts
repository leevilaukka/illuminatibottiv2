import { IlluminatiClient } from "../../structures";

export default (_client: IlluminatiClient, info: string) => {
    // Log warning
    return console.warn(info);
}