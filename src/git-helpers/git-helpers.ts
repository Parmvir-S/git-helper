import path from 'path';
require('dotenv').config();
const fs = require('node:fs/promises');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let remoteOriginSet = false;

// Setup Local/Remote Repo
export async function setupRepository(): Promise<void> {
    // const datePattern = /\b\d{2}\/\d{2}\/\d{4}\b/;
    // exec('dir', (error, stdout, stderr) => {
    //     const fileLines = stdout.split("\n").filter(line => datePattern.test(line));
    //     console.log(fileLines)
    //     console.log(process.env.GIT_REPO)
    // })
    try {
        const { stdout, stderr } = await exec('git init');
        console.log(stdout);
if (!remoteOriginSet) {
            await exec(`git remote add origin ${process.env.GIT_REPO}`);
            await exec('git branch -M main');
            await exec('git add .');
            await exec('git commit -m "Initial Commit"');
            await exec('git push -u origin main');
            remoteOriginSet = true;
        }
    } catch(error) {
        console.error('Failied Git Initalization Process Or Already Initialized');
    }   
}

export async function createGitignoreFile(): Promise<void> {
    const content: string = '.env\n/node_modules\n/dist\n';
    const filePath = path.resolve(__dirname, '../../.gitignore2');
    try {
        await fs.writeFile(filePath, content, { encoding: 'utf8' });

    } catch(error) {
        console.log('Error Creating .gitignore File: ', error);
    } 
}

// Git Status -> Get Added/Modified/Deleted Files
/*
ADDED: ["file1", "file2", "file3"]
MODIFIED: ["file4", "file5", "file6"]
DELETED: ["file7", "file8", "file9"]
*/

// Git Add 
export async function gitAdd(): Promise<void> {
  // 1) View all added, modified and deleted items via git status 
  // 2) Select which items to add to git 
        // git add . -> for all items
        // git add <item-name> -> for individual items (keep track of items to add in array, loop through and add) 
  try {
    const { stdout, stderr } = await exec('git status');
    processGitStatusLog(stdout);
  } catch (error) {
      console.log('Error with git add');
  }
}

function processGitStatusLog(gitStatus: string): void {
  const fileLines = gitStatus.split('\n');
  let untrackedFilesStarted = false;
  const dontAddFromFile = ['(use "git add <file>..." to include in what will be committed)', 'no changes added to commit (use "git add" and/or "git commit -a")', 'Untracked files:', ''];
  console.log(fileLines);

  let data = {modified: [], deleted: [], untracked: []};
  for (let line of fileLines) {
    if (line.includes('modified:')) {
      const fileNameTemp = line.split("modified:")[1];
      const fileName = fileNameTemp.split('/')[fileNameTemp.split('/').length - 1];
      console.log("MODIFICO: ", fileName);
      data.modified.push(fileName);
    } else if (line.includes('deleted:')) {
      const fileNameTemp = line.split("deleted:")[1];
      const fileName = fileNameTemp.split('/')[fileNameTemp.split('/').length -1];
      console.log('DELETICO: ', fileName);
      data.deleted.push(fileName);
    } else {
        let trimmedLine = line.trim();
        if (trimmedLine === 'Untracked files:') {
          untrackedFilesStarted = true;
        }

        if (untrackedFilesStarted) {
          if (!(dontAddFromFile.includes(trimmedLine))) {
            const fileName = trimmedLine.split('/')[trimmedLine.split('/').length -1];
            data.untracked.push(fileName);
          }
        }
    }
  }

  console.log(data);
}

//TRIM:  Untracked files:
//TRIM:  (use "git add <file>..." to include in what will be committed)
//TRIM:  .gitignore2
//TRIM:  git-logs.txt
//TRIM:  src/testAdd2.txt
//TRIM:
//TRIM:  no changes added to commit (use "git add" and/or "git commit -a")

// Git Commit 
// export async function gitCommit(): Promise<void> {
//  return promise<null>;
//}

// Git Push (Local And Remote)
