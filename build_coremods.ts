#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

// Import required modules
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { compress } from "https://deno.land/x/zip@v1.2.5/mod.ts";
const {
  mkdirSync,
  readTextFileSync,
  utimeSync,
  writeTextFileSync,
  removeSync,
} = Deno;

// Define constants
const deployPath = ".";
const coreJsonPath = "./core_mods.json";
const indexPath = join(deployPath, "index.html");

// Create the deployment directory
mkdirSync(deployPath, { recursive: true });

// Write the starting HTML tags to index.html
writeTextFileSync(
  indexPath,
  "<html><head><title>Beat Saber Core Mods</title></head><body><ul>",
);

// Parse core_mods.json
const coreJson = JSON.parse(readTextFileSync(coreJsonPath));

// Loop through the game versions
for (const gameVersion in coreJson) {
  const modLoader = gameVersion > "1.28.0_4124311467"
    ? "Scotland2"
    : "QuestLoader";

  // Defining mod object
  const mod = {
    _QPVersion: "0.1.1",
    name: `Core mods for ${gameVersion}`,
    id: `CoreMods_${gameVersion}`,
    author: "QuestPackageManager",
    description:
      `Downloads all Core mods for Beat Saber version ${gameVersion}`,
    version: "1.0.0",
    packageId: "com.beatgames.beatsaber",
    packageVersion: gameVersion,
    modloader: modLoader,
    modFiles: [],
    libraryFiles: [],
    fileCopies: [],
    copyExtensions: [],
    dependencies: coreJson[gameVersion].mods.map((
      mod: {
        id: string;
        version: string;
        downloadLink: string;
      },
    ) => ({
      id: mod.id,
      version: `^${mod.version}`,
      downloadIfMissing: mod.downloadLink,
    })),
  };

  // Write the mod object to mod.json
  const modJsonPath = "mod.json";
  writeTextFileSync(modJsonPath, JSON.stringify(mod, null, 2));

  // Update the modified time of mod.json
  const lastUpdated = new Date(coreJson[gameVersion].lastUpdated);
  utimeSync(modJsonPath, lastUpdated, lastUpdated);

  // Set the zip file path
  const zipPath = join(deployPath, `${gameVersion}.qmod`);

  // Delete the archive if it already exists
  try {
    removeSync(zipPath);
  } catch (_err) {
    // Just ignore the error, the file doesn't exist most likely.
  }

  // Compress mod.json
  await compress([modJsonPath], zipPath);

  // Update the modified time of the archive
  utimeSync(zipPath, lastUpdated, lastUpdated);

  // Write the list item to index.html
  writeTextFileSync(
    indexPath,
    `<li><a href="${gameVersion}.qmod">${gameVersion}.qmod</a></li>`,
    { append: true },
  );

  // Remove mod.json
  removeSync(modJsonPath);
}

// Write the closing tags to index.html
writeTextFileSync(indexPath, "</ul></body></html>", {
  append: true,
});
