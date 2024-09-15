const fs = require('fs');
const path = require('path');
const readline = require('readline');
const diff = require('diff'); // For text diffs

const versionDir = './versions'; // Update with the actual version directory
const mainBackupDir = './backups'; // Update with the actual backup directory

function retraceVersion(dirPath, versionName, options = {}) {
    const versionPath = path.join(versionDir, versionName);

    if (options.showDiff) {
        showDirectoryDiff(dirPath, versionName);
        return;
    }

    if (!fs.existsSync(versionPath)) {
        console.error(`Version ${versionName} not found.`);
        return;
    }

    // Confirmation before overwriting
    if (!options.force) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Are you sure you want to restore this version? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                performRetrace();
            } else {
                console.log('Retrace canceled.');
            }
            rl.close();
        });
    } else {
        performRetrace();
    }

    function performRetrace() {
        // Create a timestamped backup directory
        const timestamp = Date.now();
        const backupDir = path.join(mainBackupDir, `${path.basename(dirPath)}_${timestamp}.backup`);
        fs.mkdirSync(backupDir, { recursive: true });

        // Backup current directory
        backupDirectory(dirPath, backupDir);
        console.log(`Current directory backed up as ${backupDir}`);

        // Restore the selected version
        applyDeltas(dirPath, versionPath);
        console.log(`Directory restored to version: ${versionName}`);
    }
}

// Function to apply deltas from a version
function applyDeltas(baseDir, versionPath) {
    const versionFiles = fs.readdirSync(versionPath);

    versionFiles.forEach(file => {
        const versionFilePath = path.join(versionPath, file);
        const restoreFilePath = path.join(baseDir, file);

        if (file.endsWith('.diff')) {
            // Apply the diff
            const baseFilePath = getLastFullVersionPath(baseDir, file);
            if (fs.existsSync(baseFilePath)) {
                const baseFileContent = fs.readFileSync(baseFilePath, 'utf-8');
                const patch = fs.readFileSync(versionFilePath, 'utf-8');
                const newContent = diff.applyPatch(baseFileContent, patch);

                fs.writeFileSync(restoreFilePath, newContent, 'utf-8');
            }
        } else if (fs.lstatSync(versionFilePath).isFile()) {
            // Directly copy files
            fs.copyFileSync(versionFilePath, restoreFilePath);
        } else if (fs.lstatSync(versionFilePath).isDirectory()) {
            fs.mkdirSync(restoreFilePath, { recursive: true });
            // Recursively copy subdirectories
            copyDirectory(versionFilePath, restoreFilePath);
        }
    });
}

function getLastFullVersionPath(dirPath, file) {
    // Logic to retrieve the path of the latest full version for a given file
    // This might involve searching through the version history to find the last full version
    // Return a placeholder path for now
    return path.join(versionDir, 'latest_full_version', file);
}

function backupDirectory(dirPath, backupDir) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const backupPath = path.join(backupDir, file);

        if (fs.lstatSync(filePath).isFile()) {
            fs.copyFileSync(filePath, backupPath);
        } else if (fs.lstatSync(filePath).isDirectory()) {
            fs.mkdirSync(backupPath, { recursive: true });
            // Recursively copy subdirectories
            copyDirectory(filePath, backupPath);
        }
    });
}

function copyDirectory(srcDir, destDir) {
    // Recursively copy files and subdirectories from srcDir to destDir
    const items = fs.readdirSync(srcDir);
    items.forEach(item => {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);

        if (fs.lstatSync(srcPath).isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

function showDirectoryDiff(dirPath, versionName) {
    // Placeholder function for showing directory differences
    console.log('Directory diff functionality not implemented.');
}

module.exports = { retraceVersion };
