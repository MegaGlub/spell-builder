const fs = window.ballfish.require('fs');
const path = window.ballfish.require('path');
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

export function getRootDir(){
    const p = path.parse(window.ballfish.projectPath);
    if (p.base == "electron.exe"){
        return "./";
    } else{
        return p.dir + "/";
    }
}