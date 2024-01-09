import { getInput, info } from "@actions/core";
import create from "unitypackage";
import { readFile, access } from "node:fs/promises";
import { chdir } from "node:process";
import { constants } from "node:fs";

const IsNotNullOrWhiteSpace = (value) => value && value.trim();
const Split = (linesConcat) => {
    const splits = linesConcat.split(/\r\n|\n|\r/);
    return splits.filter(IsNotNullOrWhiteSpace);
};

const workingFolder = getInput("working-folder", { required: false });
const output = getInput("package-path", { required: true });
const projectFolder = getInput("project-folder", { required: false }) ?? "./";
const includeFilesPath = getInput("include-files", { required: true });

if (workingFolder != null) {
    try {
        await access(workingFolder, constants.F_OK);
        chdir(workingFolder);
    } catch (error) {
        info(`Error with directory: ${workingFolder}`); // Log the value of workingFolder
        throw new Error(`The directory ${workingFolder} does not exist or cannot be accessed.`);
    }
}

const data = await readFile(includeFilesPath, { encoding: "utf-8" });
const metaFiles = Split(data);
await create(metaFiles, projectFolder, output, info);
