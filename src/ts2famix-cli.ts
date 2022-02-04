import * as fs from "fs"
import yargs, { Argv, exit } from "yargs";
import { TS2Famix } from "./ts2famix";
import gitFactory from "simple-git";

const JSON_MODEL_DIRECTOY = './JSONModels/';
const REPOS_DIRECTORY = './repos/';
const LATEST_COMMIT = 'latest'

const argv = yargs
    .example('$0 -i ../myTypescriptProject -o myTypeScriptProject.json', 'creates JSON-format model of typescript project')
    .example('$0 -u https://github.com/microsoft/vscode.git -i "src/**/*.ts" -c fbdc009642ceffecb5f69a3bfdc78dd1124d64b5 -c 884273e35b35404e99e4787af0b026119e2a24dc', 'creates JSON-format model of typescript project')
    .alias('i', 'input')
    .alias('o', 'output')
    .alias('u', 'url')
    .alias('c','commit')
    .array('c')
    .default({c: [LATEST_COMMIT]})
    .argv;

const input = argv.input as string;
const output = argv.output as string;
const url = argv.url as string;
let commits = argv.commit as string[];

let importation: Promise<string[]>;
if (url){
    importation = processFromGit(url, commits, [input]);
} else {
    importation = Promise.resolve([process([input], output)])
}

importation.then((outputs)=>{
    console.info(`created ${outputs.join(", ")}`);
})


function process(inputs: string[], output: string) {
    const importer = new TS2Famix();
    const fmxRep2 = importer.famixRepFromPath(inputs);
    const jsonOutput = fmxRep2.getJSON();
    let directory = JSON_MODEL_DIRECTOY + output
    fs.writeFile(directory, jsonOutput, (err) => {
        if (err) { throw err; }
    });
    return directory
}

async function processFromGit(link: string, commits: string[], inputs: string[]){
    const projectName = getProjectName(link);
    const projectDir = REPOS_DIRECTORY + projectName;
    const repo = await cloneRepo(link, projectDir);
    const outputs: string[] = [];
    for(let commitSHA of commits){
        if (commitSHA !== LATEST_COMMIT){
            console.info("Checking out commit", commitSHA)
            const commit = repo.checkout(commitSHA);
        }
        const output = await process(inputs.map(input => `${projectDir}/${input}`), `${projectName}-${commitSHA}`);
        outputs.push(output);
    }
    return outputs;
}

function getProjectName(link: string){
    //https://github.com/microsoft/vscode.git
    return link.split("/").slice(-2).join("-").replace(".git", "");
}

async function cloneRepo(link: string, target: string){
    const repo = gitFactory(target);
    if(!fs.existsSync(target)){
        console.log("Downloading repo");
        await repo.clone(link, target);
    }
    return repo;
}

