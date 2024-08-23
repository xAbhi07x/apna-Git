#!/usr/bin/env node

const { Command } = require('commander');
const { saveVersion, listVersions, compareVersions } = require('./versionControl');

const program = new Command();

// Define the 'push' command for committing a new version
program
  .command('push <filePath>')
  .description('Commit a new version of the file')
  .option('-m, --message <message>', 'Commit message')
  .action((filePath, cmdObj) => {
    const commitMessage = cmdObj.message || 'No commit message provided';
    saveVersion(filePath, commitMessage);
  });

// Define the 'pull' command for viewing file history
program
  .command('pull <filePath>')
  .description('View file history')
  .action((filePath) => {
    listVersions(filePath);
  });

// Define the 'retrace' command for restoring a specific version
program
  .command('retrace <filePath>')
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

// Define the 'compare' command for comparing two versions
program
  .command('compare <filePath>')
  .description('Compare two versions of a file')
  .option('--version1 <versionName1>', 'First version to compare')
  .option('--version2 <versionName2>', 'Second version to compare')
  .action((filePath, cmdObj) => {
    const version1 = cmdObj.version1;
    const version2 = cmdObj.version2;
    if (!version1 || !version2) {
      console.error('Both version names are required.');
      return;
    }
    compareVersions(filePath, version1, version2);
  });

// Parse the command-line arguments
program.parse(process.argv);
