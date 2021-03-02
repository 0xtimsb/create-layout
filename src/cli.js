import arg from "arg";
import { time } from "console";
import fs from "fs";
import path from "path";

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

const print = (dir, ignoreFolders, prefix = "") => {
  const children = fs.readdirSync(dir);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childPath = path.resolve(dir, child);
    const isFile = fs.statSync(childPath).isFile();
    const connector = children.length - 1 === i ? "└─" : "├─";
    console.log(prefix + connector + child);
    if (!isFile) {
      const ignore = ignoreFolders.includes(child);
      if (!ignore) {
        const indent = children.length - 1 === i ? "  " : "│ ";
        print(childPath, ignoreFolders, prefix + indent);
      }
    }
  }
};

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const targetDir = path.resolve(process.cwd(), options.directory);
  const ignoreFolders = ["node_modules", ".git", "build", "dir", "dist"];
  print(targetDir, ignoreFolders);
}
