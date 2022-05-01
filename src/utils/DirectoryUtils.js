import path from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';

async function getFilesInDirectory(directory, fileNameEnding) {
    const read = promisify(readdir);
    const directoryContent = await read(directory);

    /* eslint-disable */
    return directoryContent
        .filter(file => file.endsWith(fileNameEnding))
        .map(file => {
            const filePath = path.join(directory, file);
            return (require(filePath)).default;
        });
    /* eslint-enable */
}

export default { getFilesInDirectory };
