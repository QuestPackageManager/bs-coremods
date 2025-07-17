import Ajv from "https://esm.sh/ajv@8";
import addFormats from "https://esm.sh/ajv-formats";

// Read schema and data
const schemaText = await Deno.readTextFile("core_mods.schema.json");
const jsonText = await Deno.readTextFile("core_mods.json");

const schema = JSON.parse(schemaText);
const data = JSON.parse(jsonText);

// Create AJV instance with formats (for date-time, uri, etc.)
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schema);
const valid = validate(data);

if (valid) {
  console.log("%ccore_mods.json is valid.", "color: green");
} else {
  console.error("%cValidation errors:", "color: red");
  console.error(validate.errors);
  Deno.exit(1);
}