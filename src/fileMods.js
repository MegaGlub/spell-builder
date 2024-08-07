const fs = module.require("fs");
const path = module.require("path");
import { logText } from "./logging.js";

export function readImageDirectory(dirPath){
    const result = [];
    const files = fs.readdirSync(dirPath);
    for (const file of files){
        if (path.extname(file) == ".png" || path.extname(file) == ".gif"){
            result.push(dirPath + "/" + file);
        }
    }
    return result;
}