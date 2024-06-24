import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const jsonFile = path.join(__dirname, 'tokens/$metadata.json');
const rawData = fs.readFileSync(jsonFile);
const metadata = JSON.parse(rawData);

// Process the tokenSetOrder array
const updatedTokenSetOrder = metadata.tokenSetOrder.map(key => {
// Split the key into parts
let keyParts = key.split('/');

// Remove the first part if there are multiple parts
if (keyParts.length > 1) {
keyParts.shift();
}

// Replace spaces in each part with hyphens
keyParts = keyParts.map(part => part.replace(/\s+/g, '-'));

// Join the remaining parts with '-' and convert to lowercase
return keyParts.join('-').toLowerCase();
});

// Update the metadata object
metadata.tokenSetOrder = updatedTokenSetOrder;

// Write the updated metadata back to the JSON file
fs.writeFileSync(jsonFile, JSON.stringify(metadata, null, 2));

console.log('$metadata.json has been updated.');