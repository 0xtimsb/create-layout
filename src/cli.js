import arg from "arg";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";

const write = promisify(fs.writeFile);

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--bullet": Boolean,
      "-b": "--bullet",
      "--numbered": Boolean,
      "-n": "--numbered",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    directory: args._[0] || "",
    bullet: args["--bullet"] || false,
    numbered: args["--numbered"] || false,
  };
}

const printTree = (targetDir, ignoreFolders, prefix = "") => {
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
        output += printTree(childPath, ignoreFolders, prefix + indent);
      }
    }
  }
  return output;
};

const printBulletList = (targetDir, ignoreFolders, prefix = "") => {
  let output = "";
  const children = fs.readdirSync(targetDir);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childPath = path.resolve(targetDir, child);
    const isFile = fs.statSync(childPath).isFile();
    const connector = "- ";
    output += "\n" + prefix + connector + child;
    if (!isFile) {
      const ignore = ignoreFolders.includes(child);
      if (!ignore) {
        output += printBulletList(childPath, ignoreFolders, prefix + "  ");
      }
    }
  }
  return output;
};

const printNumberedList = (targetDir, ignoreFolders, prefix = "") => {
  let output = "";
  const children = fs.readdirSync(targetDir);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childPath = path.resolve(targetDir, child);
    const isFile = fs.statSync(childPath).isFile();
    const connector = (i + 1) + '. ';
    output += "\n" + prefix + connector + child;
    if (!isFile) {
      const ignore = ignoreFolders.includes(child);
      if (!ignore) {
        output += printNumberedList(childPath, ignoreFolders, prefix + "    ");
      }
    }
  }
  return output;
};

const makeFile = async (targetDir, fileName, content, withCode) => {
  const writeDirectory = path.resolve(targetDir, fileName);
  if (withCode) {
    content = "```" + content + "\n```";
  }
  await write(writeDirectory, content, { flag: "w" });
};

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  const layoutDir = path.resolve(process.cwd(), options.directory);
  const targetDir = path.resolve(process.cwd());
  const ignoreFolders = [
    "node_modules",
    ".git",
    "build",
    "dir",
    "dist",
    ".next",
    "out",
    ".idea",
    ".cache",
    ".firebase"
  ];

  let content;
  if (options.bullet) {
    content = printBulletList(layoutDir, ignoreFolders);
  } else if (options.numbered) {
    content = printNumberedList(layoutDir, ignoreFolders);
  } else {
    content = printTree(layoutDir, ignoreFolders);
  }
  const isCode = !(options.bullet || options.numbered);
  await makeFile(targetDir, "layout.md", content, isCode);
  console.log(
    chalk.green.bold("layout.md"),
    "created at",
    chalk.blue.bold(targetDir)
  );
}
