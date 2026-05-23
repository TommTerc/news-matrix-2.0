#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Client } from 'basic-ftp';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CPANEL_USER = process.env.CPANEL_USER;
const CPANEL_HOST = process.env.CPANEL_HOST;
const FTP_PASSWORD = process.env.FTP_PASSWORD;

if (!CPANEL_USER || !CPANEL_HOST || !FTP_PASSWORD) {
  console.error('❌ Missing FTP credentials in .env file');
  process.exit(1);
}

const distDir = path.join(__dirname, 'dist');

async function deployToFTP() {
  const client = new Client();
  
  try {
    console.log('🚀 Starting FTP deployment...');
    console.log(`📍 Connecting to: ${CPANEL_HOST}`);
    
    // Connect to FTP
    await client.access({
      host: CPANEL_HOST,
      user: CPANEL_USER,
      password: FTP_PASSWORD,
      secure: false
    });

    console.log('✅ Connected to FTP server');

    // Check dist folder exists
    if (!fs.existsSync(distDir)) {
      throw new Error('dist/ folder not found. Run "npm run build" first');
    }

    // Upload files
    await uploadDirRecursive(client, distDir, '/public_html');
    
    console.log('\n✨ Deployment complete!');
    console.log('🌐 Your site should update at: https://newsmatrix.org');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

async function uploadDirRecursive(client, localDir, remoteDir) {
  const files = fs.readdirSync(localDir);
  
  for (const file of files) {
    const localPath = path.join(localDir, file);
    const remotePath = remoteDir + '/' + file;
    const stat = fs.statSync(localPath);
    
    if (stat.isDirectory()) {
      // Create remote directory
      try {
        await client.ensureDir(remotePath);
      } catch (e) {
        // Directory might already exist
      }
      // Recursively upload subdirectory
      await uploadDirRecursive(client, localPath, remotePath);
    } else {
      // Upload file
      console.log(`📤 ${file}`);
      await client.uploadFrom(fs.createReadStream(localPath), remotePath);
    }
  }
}

deployToFTP();
