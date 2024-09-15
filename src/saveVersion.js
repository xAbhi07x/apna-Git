const path = require('path');
const fs = require('fs');
const diff = require('diff');

const versionDir = './versions'; // Directory where versions are saved
const commitInterval = 5; // Number of commits after which to save a full version

function shouldSaveFullVersion(versionCount) {
    return versionCount % commitInterval === 0;
}

function getLatestFileVersion(file) {
    try {
        const versionPaths = fs.readdirSync(versionDir)
            .map(version => path.join(versionDir, version, file))
            .filter(filePath => fs.existsSync(filePath))
            .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
        
        return versionPaths.length ? fs.readFileSync(versionPaths[0], 'utf-8') : null;
    } catch (error) {
        console.error(`Error retrieving latest file version: ${error.message}`);
        return null;
    }
}

function getCommitCount() {
    try {
        const countFilePath = path.join(versionDir, 'commitCount.txt');
        
        if (fs.existsSync(countFilePath)) {
            return parseInt(fs.readFileSync(countFilePath, 'utf-8'), 10);
        }
        return 0;
    } catch (error) {
        console.error(`Error reading commit count: ${error.message}`);
        return 0;
    }
}

function incrementCommitCount() {
    try {
        const countFilePath = path.join(versionDir, 'commitCount.txt');
        const currentCount = getCommitCount();
        fs.writeFileSync(countFilePath, (currentCount + 1).toString(), 'utf-8');
    } catch (error) {
        console.error(`Error incrementing commit count: ${error.message}`);
    }
}

function saveVersion(dirPath, commitMessage) {
    try {
        if (!fs.lstatSync(dirPath).isDirectory()) {
            console.error(`${dirPath} is not a directory`);
            return;
        }

        const files = fs.readdirSync(dirPath);
        const versionCount = getCommitCount();
        const saveFullVersion = shouldSaveFullVersion(versionCount);
        const timestamp = Date.now();
        const versionName = `repo_${timestamp}`;
        const versionDirPath = path.join(versionDir, versionName);

        fs.mkdirSync(versionDirPath, { recursive: true });

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            if (saveFullVersion) {
                const targetPath = path.join(versionDirPath, file);
                fs.writeFileSync(targetPath, fileContent, 'utf-8');
            } else {
                const previousVersion = getLatestFileVersion(file);
                
                if (previousVersion) {
                    const diffResult = diff.createPatch(file, previousVersion, fileContent);
                    const diffPath = path.join(versionDirPath, `${file}.diff`);
                    fs.writeFileSync(diffPath, diffResult, 'utf-8');
                } else {
                    const targetPath = path.join(versionDirPath, file);
                    fs.writeFileSync(targetPath, fileContent, 'utf-8');
                }
            }
        });

        fs.writeFileSync(path.join(versionDirPath, 'commit_message.txt'), commitMessage, 'utf-8');
        incrementCommitCount();

        console.log(`Repository version saved as ${versionName} with message: "${commitMessage}"`);
    } catch (error) {
        console.error(`Error saving version: ${error.message}`);
    }
}

module.exports = { saveVersion };
