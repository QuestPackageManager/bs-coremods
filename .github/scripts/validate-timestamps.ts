// Read and parse the JSON file asynchronously using Deno's API.
const fileText = await Deno.readTextFile("core_mods.json");
const parsedData = JSON.parse(fileText);

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function isStrictISO8601(value: string): boolean {
  const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:[+-]\d\d:\d\d|Z)?$/i;
  return ISO_8601_FULL.test(value);
}

let errored = false;

for (const [version, data] of Object.entries(parsedData)) {
  if (version === "$schema") {
    continue;
  }
  
  const valid = isStrictISO8601(data.lastUpdated);
  console.log(
    `${version}: ${data.lastUpdated} is ${
      valid ? `${GREEN}VALID${RESET}` : `${RED}INVALID${RESET}`
    }`
  );
  if (!valid) {
    errored = true;
  }
}

if (errored) {
  Deno.exit(1);
}
