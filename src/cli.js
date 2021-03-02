import arg from "arg";
import { time } from "console";
import fs from "fs";
import path from "path";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--limit": String,
      "-l": "--limit",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    directory: args._[0] || "",
    limit: args["--limit"] || 12,
  };
}

const print = (dir, ignoreFolders, limit, level = 0) => {
  const children = fs.readdirSync(dir);
  for (let i = 0; i < children.length; i++) {
    if (i > limit) {
      return;
    }
    const child = children[i];
    const childPath = path.resolve(dir, child);
    const isFile = fs.statSync(childPath).isFile();
    if (isFile) {
      const indent = i === 0 ? "└─" : "├─";
      const prefix = "| ".repeat(level);
      const result = [indent, child];
      if (level > 0) result.unshift(prefix);
      console.log(...result);
    } else {
      console.log("├─", child);
      const ignore = ignoreFolders.includes(child);
      if (!ignore) print(childPath, ignoreFolders, limit, level + 1);
    }
  }
};

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const targetDir = path.resolve(process.cwd(), options.directory);
  const ignoreFolders = ["node_modules", ".git", "build", "dir", "dist"];
  print(targetDir, ignoreFolders, options.limit);
}
