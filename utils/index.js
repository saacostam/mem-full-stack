import { dirname } from 'path';
import { fileURLToPath } from 'url';

function getDirName(){
    // Setup __dirname
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return __dirname;
}

export {getDirName};