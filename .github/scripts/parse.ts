import { CoreMods } from "./types/core-mods.ts";

// Read data
const jsonText = await Deno.readTextFile("core_mods.json");

const data = JSON.parse(jsonText) as CoreMods;
const stringifiedData = JSON.stringify(data, null, "  ");

console.log(stringifiedData);