#!/usr/bin/env node

const { Command } = require('commander');
const { listVersions, listBackups, restoreFromBackup } = require('./src/versionControl');
const { saveVersion } = require('.//src/saveVersion');
const { retraceVersion } = require('./src/retraceVersion');

const program = new Command();

// Define the 'commit' command for committing a new version (now for repositories)
program
  .command('commit <dirPath>')
  .description('Commit a new version of the repository (directory)')
  .option('-m, --message <message>', 'Commit message')
  .action((dirPath, cmdObj) => {
    const commitMessage = cmdObj.message || 'No commit message provided';
    console.log(`Commit message received: "${commitMessage}"`); // Debug log
    saveVersion(dirPath, commitMessage);
  });

// Define the 'log' command for viewing version history (similar to `git log`)
program
  .command('log <filePath>')
  .description('View version history')
  .action((filePath) => {
    listVersions(filePath);
  });

// Define the 'checkout' command for restoring a specific version (similar to `git checkout`)
program
  .command('checkout <filePath>')
  .description('Restore a specific version of the file')
  .option('--version <versionName>', 'Version name to restore')
  .action((filePath, cmdObj) => {
    const versionName = cmdObj.version;
    if (!versionName) {
      console.error('Version name is required.');
      return;
    }
    retraceVersion(filePath, versionName);
  });

// Define the 'tag' command for listing all available backups (similar to `git tag`)
program
  .command('tag')
  .description('List all available backups')
  .action(() => {
    listBackups();
  });

// Define the 'restore' command for restoring from a backup (similar to `git restore`)
program
  .command('restore <backupName> <dirPath>')
  .description('Restore a directory from a backup')
  .action((backupName, dirPath) => {
    restoreFromBackup(backupName, dirPath);
  });

// Parse the command-line arguments
program.parse(process.argv);
