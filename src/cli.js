import arg from "arg";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";

const write = promisify(fs.writeFile);

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      //   "--limit": String,
      //   "-l": "--limit",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    directory: args._[0] || "",
    //  limit: args["--limit"] || 12,
  };
}

const print = (targetDir, ignoreFolders, prefix = "") => {
  let output = "";
  const children = fs.readdirSync(targetDir);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childPath = path.resolve(targetDir, child);
    const isFile = fs.statSync(childPath).isFile();
    const connector = children.length - 1 === i ? "└─" : "├─";
    output += "\n" + prefix + connector + child;
    if (!isFile) {
      const ignore = ignoreFolders.includes(child);
      if (!ignore) {
        const indent = children.length - 1 === i ? "  " : "│ ";
        output += print(childPath, ignoreFolders, prefix + indent);
      }
    }
  }
  return output;
};

const makeFile = async (targetDir, fileName, content) => {
  const writeDirectory = path.resolve(targetDir, fileName);
  content = "```" + content + "\n```";
  await write(writeDirectory, content, { flag: "w" });
};

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const targetDir = path.resolve(process.cwd(), options.directory);
  const ignoreFolders = [
    "node_modules",
    ".git",
    "build",
    "dir",
    "dist",
    ".next",
  ];
  const content = print(targetDir, ignoreFolders);
  await makeFile(targetDir, "layout.md", content);
  console.log(
    chalk.green.bold("layout.md"),
    "created at",
    chalk.blue.bold(targetDir)
  );
}
