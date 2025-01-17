import { expect, test, beforeAll, afterAll } from "bun:test";
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const testDir = "test_files";
const testFileName = path.join(testDir, "test_api_keys.txt");
const safeFileName = path.join(testDir, "safe_file.txt");

beforeAll(() => {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  const testContent = `
    This is a test file with dummy API keys:
    OpenAI: sk-1234567890abcdef1234567890abcdef1234567890abcdef
    GitHub: ghp_1234567890abcdef1234567890abcdef
    Generic: 1234567890abcdef1234567890abcdef
    Google: AIzaSyC1234567890-abcdefghijklmnopqrstuvwxyz
    MD5: 1234567890abcdef1234567890abcdef
    Stripe: sk_test_1234567890abcdefghijklmnop
    AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Twilio: 1234567890abcdefghijklmnopqrstuw
    UUID: 550e8400-e29b-41d4-a716-446655440000
    Facebook: EAACEdEose0cBA1234567890abcdefghijklmnopqrstuvwxyz
    Twitter: 1234567890-1234567890abcdef1234567890abcdef1234567890
    Azure: 1234567890abcdef1234567890abcdef
    Slack: xoxb-123456789012-123456789012-abcdefghijklmnopqrstuvwx
    Sendgrid: SG.1234567890abcdefghijklmn.1234567890abcdefghijklmnopqrstuvwxyzABCDEF
    Mailgun: key-1234567890abcdefghijklmnopqrstuv
    Mailchimp: 1234567890abcdef1234567890-us1
    Generic All-Caps: ABCDEFGHIJ1234567890
  `;
  fs.writeFileSync(testFileName, testContent);

  fs.writeFileSync(safeFileName, "This is a safe file with no API keys.");
});

test("check for API keys", () => {
  const result = spawnSync("bun", ["run", "start", testDir], {
    encoding: "utf8",
  });

  expect(result.status).toBe(1);
  expect(result.stderr).toContain(
    `Error: File '${testFileName}' contains a potential API key.`,
  );
  expect(result.stderr).toContain("YOU MIGHT BE COMMITTING YOUR API KEY");
  expect(result.stderr).toContain("Matched pattern: ");

  // Check for at least one specific pattern name
  expect(result.stderr).toMatch(
    /Matched pattern: (OpenAI API key|GitHub Personal Access Token|Google API Key)/,
  );
});

test("no API keys in safe file", () => {
  // First, remove the file with API keys
  fs.unlinkSync(testFileName);

  const result = spawnSync("bun", ["run", "start", testDir], {
    encoding: "utf8",
  });

  expect(result.stdout).toContain("No API keys found.");
  expect(result.status).toBe(0); // Expect the script to exit with status 0 (success)
});
