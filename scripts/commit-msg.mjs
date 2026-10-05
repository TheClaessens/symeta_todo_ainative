#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

const commitMsgFilePath = process.argv[2]; // Path to the temporary commit message file

if (!commitMsgFilePath) {
  console.error('Error: No commit message file path provided.');
  process.exit(1);
}

const commitMessage = fs.readFileSync(commitMsgFilePath, 'utf8').trim();

console.log(`Original commit message: "${commitMessage}"`);

// --- STEP 1: VALIDATE THE COMMIT MESSAGE ---

// Simple regex for convention: type: subject or merge commits
// Examples: feat: add new login, fix: correct button spacing, Merge branch 'feature/xyz'
const validationRegex =
  /^(?:fixup! )?(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert): .{1,}|^Merge .{1,}/u;

if (!validationRegex.test(commitMessage)) {
  console.error('\n🚫 Invalid commit message format!');
  console.error(
    'Commit messages should follow the convention: `type: subject` or be merge commits'
  );
  console.error('Examples:');
  console.error('  feat: Implement user profile page');
  console.error('  fix: Resolve login redirect bug');
  console.error('  docs: Update installation guide');
  console.error("  Merge branch 'feature/user-profile'");
  console.error(
    '\nValid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert'
  );
  console.error('Or merge commits starting with "Merge branch"');
  process.exit(1); // Abort commit
}

console.log('✅ Commit message convention validated.');

// --- STEP 2: ADAPT THE COMMIT MESSAGE TO ATTACH TICKET NAME ---

// This script will try to find a ticket ID in the current branch name.
// Assumes branch names like 'feature/KICKSTART-123-new-feature' or 'bugfix/KICKSTART-45-fix-login'
// You might need to adjust this regex based on your actual ticket ID pattern and branch naming convention.
const getTicketIdFromBranchName = () => {
  try {
    // Get the current branch name
    const branchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    console.log(`Current branch name: "${branchName}"`);

    // Regex to find ticket ID (e.g., KICKSTART-123, JIRA-456)
    // Adjust this regex for your specific ticket ID pattern
    const ticketIdRegex = /([A-Z]+-\d+)/u;
    const match = branchName.match(ticketIdRegex);

    if (match && match[1]) {
      return match[1].toUpperCase(); // Return the found ticket ID in uppercase
    }
  } catch (error) {
    console.warn(
      'Could not determine branch name or find ticket ID in branch name:',
      error.message
    );
  }
  return null; // No ticket ID found
};

const ticketId = getTicketIdFromBranchName();

if (ticketId && !commitMessage.includes(`(${ticketId})`)) {
  // If a ticket ID is found and it's not already in the message
  // We'll insert it after the 'type' and before the subject, like type(TICKET-ID): subject
  const parts = commitMessage.match(/^(?<type>[a-z]+): (?<subject>.+)$/iu); // Adjusted to handle optional scope
  if (parts && parts.groups) {
    const type = parts.groups.type;
    const subject = parts.groups.subject;
    const adaptedMessage = `${type}(${ticketId}): ${subject}`;
    fs.writeFileSync(commitMsgFilePath, adaptedMessage, 'utf8');
    console.log(
      `✨ Commit message adapted with ticket ID: "${adaptedMessage}"`
    );
  } else {
    console.warn(
      'Could not parse commit message to insert ticket ID. Skipping adaptation.'
    );
  }
} else if (ticketId && commitMessage.includes(`(${ticketId})`)) {
  console.log(
    `Ticket ID "${ticketId}" already present in commit message. No adaptation needed.`
  );
} else {
  console.log(
    'No ticket ID found in branch name or already adapted. Keeping original message.'
  );
}

console.log('Commit message processing complete.');
process.exit(0); // Allow commit to proceed
