import { setupRepository, createGitignoreFile, gitAdd } from "./git-helpers/git-helpers";

// Works
// createGitignoreFile()

// Works
// setupRepository();

// Main Program Execution
// ** Just for testing purposes -> will create routes to access these functions 
function main(): void {
  let isRepoSetup: boolean = false;
  if (!isRepoSetup) {
    createGitignoreFile();
    setupRepository();
    isRepoSetup = true;
  }
}

gitAdd()
