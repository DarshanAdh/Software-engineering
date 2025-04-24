// Script to copy environment variables to Netlify functions
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Copying environment variables to Netlify functions...');

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source .env file
const sourceEnvPath = path.join(__dirname, '.env.netlify');

// Destination .env file in Netlify functions directory
const destEnvPath = path.join(__dirname, 'netlify', 'functions', '.env');

// Check if source file exists
if (!fs.existsSync(sourceEnvPath)) {
  console.error('Source .env file not found:', sourceEnvPath);
  process.exit(1);
}

// Create the destination directory if it doesn't exist
const destDir = path.dirname(destEnvPath);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the file
try {
  fs.copyFileSync(sourceEnvPath, destEnvPath);
  console.log('Environment variables copied successfully to:', destEnvPath);
} catch (error) {
  console.error('Error copying environment variables:', error);
  process.exit(1);
}
