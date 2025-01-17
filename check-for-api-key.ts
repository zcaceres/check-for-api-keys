import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";

const apiKeyPatterns = {
  "OpenAI API key": /sk-[a-zA-Z0-9]{48}/,
  "GitHub Personal Access Token": /ghp_[a-zA-Z0-9]{36}/,
  "Generic 32-character API key": /[a-zA-Z0-9]{32}/,
  "Google API Key": /AIza[0-9A-Za-z\-_]{35}/,
  "MD5 hash": /[0-9a-f]{32}/,
  "Stripe API Key": /[A-Za-z0-9_]{21}--[A-Za-z0-9_]{8}/,
  "AWS Access Key ID": /AKIA[0-9A-Z]{16}/,
  "AWS Secret Access Key": /[0-9a-zA-Z]{40}/,
  "Twilio API Key": /[A-Za-z0-9]{25}/,
  "UUID format": /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
  "Facebook Access Token": /EAACEdEose0cBA[0-9A-Za-z]+/,
  "Twitter API Key": /[1-9][0-9]+-[0-9a-zA-Z]{40}/,
  "Azure Key": /[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}/,
  "Slack Token": /xox[baprs]-[0-9]{12}-[0-9]{12}-[0-9a-zA-Z]{24}/,
  "Sendgrid API Key": /SK[a-zA-Z0-9]{32}/,
  "Sendgrid API Key (alternative format)":
    /SG\.[a-zA-Z0-9_\-\.]{22}\.[a-zA-Z0-9_\-\.]{43}/,
  "Mailgun API Key": /key-[0-9a-zA-Z]{32}/,
  "Mailchimp API Key": /[a-zA-Z0-9]{32}-us[0-9]{1,2}/,
  "Generic all-caps 20-character key": /\b[A-Z0-9]{20}\b/,
};

function checkForApiKey(directory: string) {
  const gitignorePath = path.join(directory, ".gitignore");
  let ignoredFiles: string[] = [];

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ignoredFiles = gitignoreContent.split("\n").filter(Boolean);
  }

  const checkDirectory = (dir: string) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        if (!file.name.includes("node_modules")) {
          checkDirectory(fullPath);
        }
      } else if (
        file.isFile() &&
        file.name !== "check-for-api-key.ts" &&
        file.name !== ".gitignore" &&
        !ignoredFiles.includes(file.name)
      ) {
        const content = fs.readFileSync(fullPath, "utf8");
        for (const [patternName, pattern] of Object.entries(apiKeyPatterns)) {
          if (pattern.test(content)) {
            console.error(
              `Error: File '${fullPath}' contains a potential API key.`,
            );
            console.error(
              "!!!!!!!!!!!YOU MIGHT BE COMMITTING YOUR API KEY!!!!!!!!!!!",
            );
            console.error(`Matched pattern: ${patternName}`);
            process.exit(1);
          }
        }
      }
    }
  };

  checkDirectory(directory);
  console.log("No API keys found.");
  process.exit(0);
}

const program = new Command();

program
  .name("check-for-api-key")
  .description("Check for potential API keys in files")
  .version("1.0.0")
  .argument("[directory]", "Directory to check", ".")
  .action((directory) => {
    checkForApiKey(directory);
  });

program.parse(process.argv);
