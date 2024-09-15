
# Abhi Version Control

A simple and efficient file version control system designed to manage versions of entire directories and track changes with Delta for efficient versioning. Ideal for developers, writers, and anyone needing straightforward version control for directories.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Examples](#examples)
5. [Features](#features)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

Abhi Version Control provides an easy-to-use interface for managing versions of entire directories. It supports committing new versions, viewing history, restoring specific versions, and comparing different versions using Delta for efficient versioning and comparison.

## Installation

You can install Abhi Version Control globally using npm:

```bash
npm install -g abhi-version-control
```

This command makes the `abhi` command available globally on your system.

## Usage

### Commands

- **Commit a New Version**

  Use this command to commit a new version of a directory:

  ```bash
  abhi commit <dirPath> --message "Your commit message"
  ```

  - `<dirPath>`: The path to the directory you want to version.
  - `--message`: Optional commit message describing the changes.

- **View Version History**

  Use this command to view the history of a directory:

  ```bash
  abhi log <dirPath>
  ```

  - `<dirPath>`: The path to the directory whose history you want to view.

- **Restore a Specific Version**

  Use this command to restore a specific version of a directory:

  ```bash
  abhi checkout <dirPath> --version <versionName>
  ```

  - `<dirPath>`: The path to the directory you want to restore.
  - `--version`: The specific version of the directory to restore.

- **List Available Backups**

  Use this command to list all available backups:

  ```bash
  abhi tag
  ```

- **Restore from a Backup**

  Use this command to restore a directory from a backup:

  ```bash
  abhi restore <backupName> <dirPath>
  ```

  - `<backupName>`: The name of the backup to restore from.
  - `<dirPath>`: The path to the directory to restore.



## Examples

### Committing a New Version

To commit a new version of the directory `exampleDir` with a message:

```bash
abhi commit exampleDir --message "Updated documentation and fixed bugs"
```

### Viewing Directory History

To view the history of `exampleDir`:

```bash
abhi log exampleDir
```

### Restoring a Specific Version

To restore a previous version of `exampleDir`:

```bash
abhi checkout exampleDir --version exampleDir_1624416384316
```

This will replace the current version of `exampleDir` with the specified version.

### Listing Available Backups

To list all available backups:

```bash
abhi tag
```

### Restoring from a Backup

To restore `exampleDir` from a backup named `backup_20240915`:

```bash
abhi restore backup_20240915 exampleDir
```



This will show the differences between the specified versions of the file within the directory.

## Features

- **Version Management**: Save different versions of directories with timestamps and commit messages.
- **File History**: View the history of changes made to directories, including commit messages.
- **Retrace Versions**: Restore any previous version of a directory, allowing easy reversion to earlier states.
- **Backup and Restore**: List and restore from backups to safeguard your data.
- **Simple CLI**: Use straightforward commands to manage directory versions, view history, restore previous versions, and compare file versions.

## Contributing

We welcome contributions to enhance the functionality of Abhi Version Control. If you have suggestions or improvements, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a description of your changes.

Please ensure that your code adheres to the project’s coding standards and includes relevant tests.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
```
