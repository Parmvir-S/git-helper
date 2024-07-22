require('dotenv').config();

const util = require('util');
const exec = util.promisify(require('child_process').exec);

let remoteOriginSet = false;

// Setup Local/Remote Repo
export async function setupRepository() {
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
        console.error("Failied Git Initalization: ", error);
    }   
}

function createGitignoreFile() {

}

// Git Status -> Get Added/Modified/Deleted Files
/*
ADDED: ["file1", "file2", "file3"]
MODIFIED: ["file4", "file5", "file6"]
DELETED: ["file7", "file8", "file9"]
*/

// Git Add & Commit 

// Git Push (Local And Remote)
