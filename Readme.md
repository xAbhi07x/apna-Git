You're right. Let's include the new comparison feature in the `README`:

```markdown
# Abhi Version Control

A simple and efficient file version control system that helps you manage file versions and maintain commit history with ease.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Examples](#examples)
5. [Features](#features)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

Abhi Version Control is designed to provide a straightforward way to version files and track changes. It supports committing new versions, viewing file history, retracing previous versions, and comparing different versions. This tool is ideal for developers, writers, and anyone needing a simple version control solution without the complexity of larger systems.

## Installation

You can install Abhi Version Control globally using npm:

```bash
npm install -g abhi-version-control
```

This command makes the `abhi` command available globally on your system.

## Usage

### Commands

- **Push a New Version**

  Use this command to commit a new version of a file:

  ```bash
  abhi push <filePath> --message "Your commit message"
  ```

  - `<filePath>`: The path to the file you want to version.
  - `--message`: Optional commit message describing the changes.

- **View File History**

  Use this command to view the history of a file:

  ```bash
  abhi pull <filePath>
  ```

  - `<filePath>`: The path to the file whose history you want to view.

- **Retrace a File Version**

  Use this command to restore a specific version of a file:

  ```bash
  abhi retrace <filePath> --version <versionName>
  ```

  - `<filePath>`: The path to the file you want to restore.
  - `--version`: The specific version of the file to restore.

- **Compare File Versions**

  Use this command to compare two different versions of a file:

  ```bash
  abhi compare <filePath> --version1 <version1Name> --version2 <version2Name>
  ```

  - `<filePath>`: The path to the file you want to compare.
  - `--version1`: The first version of the file to compare.
  - `--version2`: The second version of the file to compare.

## Examples

### Committing a New Version

To commit a new version of `example.txt` with a message:

```bash
abhi push example.txt --message "Added new section on features"
```

### Viewing File History

To view the history of `example.txt`:

```bash
abhi pull example.txt
```

### Retracing a Specific Version

To restore a previous version of `example.txt`:

```bash
abhi retrace example.txt --version example_1624416384316.txt
```

This will replace the current version of `example.txt` with the specified version.

### Comparing Two Versions

To compare two versions of `example.txt`:

```bash
abhi compare example.txt --version1 example_1624416384316.txt --version2 example_1624416402232.txt
```

This will show the differences between the specified versions of the file.

## Features

- **Version Management**: Save different versions of your files with timestamps and commit messages.
- **File History**: View the history of changes made to a file, including commit messages.
- **Retrace Versions**: Restore any previous version of a file, allowing you to easily revert to earlier states.
- **Compare Versions**: Compare differences between two versions of a file, highlighting changes and differences.
- **Simple CLI**: Use straightforward commands to manage file versions, view history, retrace previous versions, and compare file versions.

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

