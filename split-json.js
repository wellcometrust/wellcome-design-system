import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const jsonFile = path.join(__dirname, "tokens.json");
const rawData = fs.readFileSync(jsonFile);
const jsonData = JSON.parse(rawData);

// Define the base output directory
const baseDir = path.join(__dirname, "tokens");

// Define keys to exclude
const excludeKeys = ["$themes"];

// Function to write data to file
const writeFile = (filePath, data) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

Object.keys(jsonData).forEach((key) => {
  // Skip keys that are in the exclude list
  if (excludeKeys.includes(key)) {
    return;
  }

  // Split the key into parts
  let keyParts = key.split("/");

  // Remove the first part if there are multiple parts
  if (keyParts.length > 1) {
    keyParts.shift();
  }

  // Replace spaces in each part with hyphens
  keyParts = keyParts.map((part) => part.replace(/\s+/g, "-"));

  // Join the remaining parts with '-' and convert to lowercase
  const cleanKey = keyParts.join("-").toLowerCase();

  const filePath = path.join(baseDir, `${cleanKey}.json`);

  writeFile(filePath, jsonData[key]);
});

console.log("JSON files have been created in the tokens directory.");
