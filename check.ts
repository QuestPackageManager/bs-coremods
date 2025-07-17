// Deno script to ensure the core mods are valid

interface CoreModListing {
  [version: string]: GameCoreMods;
}

interface GameCoreMods {
  lastUpdated: string;
  mods: CoreMod[];
}

interface CoreMod {
  id: string;
  version: string;
  downloadLink: string;
}


function isValidTime(timeStr: string) {
  // Use Date parsing to check for valid ISO 8601 timestamp
  const d = new Date(timeStr);
  return !isNaN(d.getTime());
}

function isValidSemver(version: string) {
  // assert string is semver
  return /^\d+\.\d+\.\d+$/.test(version);
}

async function isValidUrl(url: string) {
  // assert string is a valid URL
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}

const json: CoreModListing = JSON.parse(
  await Deno.readTextFile("./core_mods.json")
);

delete json["$schema"]; // Remove schema reference if present

// ensure all have valid time
Object.entries(json).forEach(([version, coreMods]) => {
  console.log(`Checking version ${version}`);
  if (!isValidTime(coreMods.lastUpdated)) {
    throw new Error(
      `Invalid lastUpdated time for version ${version}: ${coreMods.lastUpdated}`
    );
  }

  coreMods.mods.forEach(async (mod) => {
    if (!isValidSemver(mod.version)) {
      throw new Error(
        `Invalid version for mod ${mod.id} in version ${version}: ${mod.version}`
      );
    }
    const validURL = await isValidUrl(mod.downloadLink);
    if (!validURL) {
      throw new Error(
        `Invalid download link for mod ${mod.id} in version ${version}: ${mod.downloadLink}`
      );
    }
    // Green color for valid mods using "colorette"
    console.log(`%cMod ${mod.id} is valid`, "color: green");
  });
});
