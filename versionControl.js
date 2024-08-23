const fs = require('fs');
const path = require('path');
const readline = require('readline');
const diff = require('diff'); // Example diffing library

// Directory to store versions
const versionDir = path.join(__dirname, 'versions');

// Ensure the version directory exists
if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir);
}

function saveVersion(filePath, commitMessage) {
    // Get the file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Get the file extension (if any)
    const ext = path.extname(filePath);    

    // Create a unique version name using a timestamp
    const timestamp = Date.now();
    const versionName = ext ? 
    `${path.basename(filePath, ext)}_${timestamp}${ext}` : 
    `${path.basename(filePath)}_${timestamp}.txt`;
    const versionPath = path.join(versionDir, versionName);

    // Save the file version
    fs.writeFileSync(versionPath, fileContent, 'utf-8');

    // Save commit message alongside file
    fs.writeFileSync(versionPath + '.msg', commitMessage);

    console.log(`Version saved as ${versionName} with message: "${commitMessage}"`);
}

function listVersions(filePath) {
    const baseName = path.basename(filePath, path.extname(filePath)); // Extract base name without extension
    const files = fs.readdirSync(versionDir);

    // Filter out only the version files (ignore .msg files)
    const versions = files.filter(file => file.startsWith(baseName + '_') && !file.endsWith('.msg'));

    if (versions.length === 0) {
        console.log('No versions found for this file.');
        return;
    }

    console.log(`Versions for ${baseName}:`);
    versions.forEach(version => {
        const timestamp = version.split('_')[1].split('.')[0]; // Extract the timestamp part
        
        // Construct the corresponding commit message file name
        const messageFile = path.join(versionDir, `${version}.msg`);
        
        // Debugging: Log the constructed message file path
        console.log(`Looking for message file: ${messageFile}`);

        // Read the commit message if the file exists
        let commitMessage = 'No commit message found.';
        
        if (fs.existsSync(messageFile)) {
            commitMessage = fs.readFileSync(messageFile, 'utf-8');
        } else {
            console.error(`Commit message file not found for version: ${version}`);
        }

        console.log(`Version: ${version} - Timestamp: ${timestamp}`);
        console.log(`Commit Message: ${commitMessage}\n`);
    });
    
}


function retraceVersion(filePath, versionName, options = {}) {
    const versionPath = path.join(versionDir, versionName);

    if (!fs.existsSync(versionPath)) {
        console.error(`Version ${versionName} not found.`);
        return;
    }

    // Show differences if requested
    if (options.showDiff) {
        const currentContent = fs.readFileSync(filePath, 'utf-8');
        const versionContent = fs.readFileSync(versionPath, 'utf-8');
        const diffOutput = diff.createPatch(filePath, currentContent, versionContent);
        console.log(`Differences between current file and version ${versionName}:`);
        console.log(diffOutput);
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
        // Backup the current file with timestamp
        const backupPath = `${filePath}.${Date.now()}.backup`;
        fs.copyFileSync(filePath, backupPath);
        console.log(`Current version backed up as ${backupPath}`);

        // Restore the selected version
        const versionContent = fs.readFileSync(versionPath, 'utf-8');
        fs.writeFileSync(filePath, versionContent, 'utf-8');
        console.log(`File restored to version: ${versionName}`);
    }
}


function compareVersions(filePath, version1Name, version2Name) {
    const versionDir = path.join(__dirname, 'versions');
    
    // Paths to the version files
    const file1Path = path.join(versionDir, version1Name);
    const file2Path = path.join(versionDir, version2Name);
    
    // Read the file contents
    const file1Content = fs.readFileSync(file1Path, 'utf-8');
    const file2Content = fs.readFileSync(file2Path, 'utf-8');
    
    // Generate the diff
    const differences = diff.createTwoFilesPatch(version1Name, version2Name, file1Content, file2Content);
    
    // Format the output for better readability
    const formattedDiff = differences
        .split('\n')
        .map(line => {
            if (line.startsWith('---') || line.startsWith('+++')) {
                return `File: ${line}`;
            }
            if (line.startsWith('-')) {
                return `Removed: ${line.slice(1)}`;
            }
            if (line.startsWith('+')) {
                return `Added: ${line.slice(1)}`;
            }
            return `Unchanged: ${line}`;
        })
        .join('\n');
    
    console.log(`Comparison between versions of ${filePath}:\n`);
    console.log(formattedDiff);
}



module.exports = { saveVersion, listVersions, retraceVersion, compareVersions };