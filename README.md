# check-for-api-keys

A command-line tool to scan directories for potential API keys and sensitive information in files.

## Features

- Scans directories recursively for potential API keys
- Supports multiple API key patterns including:
  - OpenAI API keys
  - GitHub Personal Access Tokens
  - Google API Keys
  - AWS Access Keys
  - And many more!
- Respects `.gitignore` files
- Easy to use CLI interface

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/check-for-api-keys.git
   cd check-for-api-keys
   ```

2. Install dependencies:
   ```
   bun install
   ```

## Usage

To check the current directory:

```
bun run start
```

To check a specific directory:

```
bun run start /path/to/directory
```

## Running Tests

To run the test suite:

```
bun test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
