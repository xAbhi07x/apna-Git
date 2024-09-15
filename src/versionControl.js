const fs = require('fs');
const path = require('path');
const readline = require('readline');
const diff = require('diff'); // Example diffing library

// Directory to store versions and backups
const versionDir = path.join(__dirname, 'versions');
const mainBackupDir = path.join(__dirname, 'backups');

// Ensure the version and backup directories exist
if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir);
}

if (!fs.existsSync(mainBackupDir)) {
    fs.mkdirSync(mainBackupDir);
}

function listVersions(dirPath) {
    // Ensure the provided path is a directory
    if (!fs.lstatSync(dirPath).isDirectory()) {
        console.error(`${dirPath} is not a directory`);
        return;
    }

    // Get all version directories
    const versionDirectories = fs.readdirSync(versionDir).filter(file => {
        return fs.lstatSync(path.join(versionDir, file)).isDirectory();
    });

    if (versionDirectories.length === 0) {
        console.log('No versions found for this repository.');
        return;
    }

    console.log(`Versions for repository in ${dirPath}:`);

    versionDirectories.forEach(versionDirName => {
        // Construct the path for the commit message
        const commitMessagePath = path.join(versionDir, versionDirName, 'commit.msg');

        // Read the commit message
        let commitMessage = 'No commit message found.';
        if (fs.existsSync(commitMessagePath)) {
            commitMessage = fs.readFileSync(commitMessagePath, 'utf-8');
        }

        // Extract the timestamp from the version directory name
        const timestamp = versionDirName.split('_')[1];

        console.log(`Version: ${versionDirName} - Timestamp: ${timestamp}`);
        console.log(`Commit Message: ${commitMessage}\n`);
    });
}

function listBackups() {
    const backups = fs.readdirSync(mainBackupDir)
        .filter(file => fs.lstatSync(path.join(mainBackupDir, file)).isDirectory());

    if (backups.length === 0) {
        console.log('No backups found.');
        return;
    }

    console.log('Available backups:');
    backups.forEach(backup => console.log(backup));
}

function restoreFromBackup(backupName, dirPath) {
    const backupDir = path.join(mainBackupDir, backupName);

    if (!fs.existsSync(backupDir)) {
        console.error(`Backup ${backupName} not found.`);
        return;
    }

    // Confirmation before overwriting
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Are you sure you want to restore from this backup? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            performRestore();
        } else {
            console.log('Restore canceled.');
        }
        rl.close();
    });

    function performRestore() {
        // Create a timestamped backup directory
        const timestamp = Date.now();
        const currentBackupDir = path.join(mainBackupDir, `${path.basename(dirPath)}_current_${timestamp}.backup`);
        fs.mkdirSync(currentBackupDir, { recursive: true });

        // Copy all files from the current directory to the current backup directory
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const backupPath = path.join(currentBackupDir, file);
            if (fs.lstatSync(filePath).isFile()) {
                fs.copyFileSync(filePath, backupPath);
            } else if (fs.lstatSync(filePath).isDirectory()) {
                fs.mkdirSync(backupPath, { recursive: true });
                copyDirectory(filePath, backupPath);
            }
        });
        console.log(`Current directory backed up as ${currentBackupDir}`);

        // Restore from the selected backup
        const backupFiles = fs.readdirSync(backupDir);
        backupFiles.forEach(file => {
            const backupFilePath = path.join(backupDir, file);
            const restoreFilePath = path.join(dirPath, file);

            // If the file already exists in the current directory, back it up before overwriting
            if (fs.existsSync(restoreFilePath)) {
                const currentBackupPath = path.join(currentBackupDir, file);
                fs.copyFileSync(restoreFilePath, currentBackupPath);
            }

            if (fs.lstatSync(backupFilePath).isFile()) {
                fs.copyFileSync(backupFilePath, restoreFilePath);
            } else if (fs.lstatSync(backupFilePath).isDirectory()) {
                fs.mkdirSync(restoreFilePath, { recursive: true });
                copyDirectory(backupFilePath, restoreFilePath);
            }
        });
        console.log(`Directory restored from backup: ${backupName}`);
    }
}

// Helper function to recursively copy directories
function copyDirectory(srcDir, destDir) {
    fs.readdirSync(srcDir).forEach(item => {
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


module.exports = { listVersions, listBackups, restoreFromBackup };