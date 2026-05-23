const BasicFtp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployProxy() {
  const client = new BasicFtp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: process.env.CPANEL_HOST,
      user: process.env.CPANEL_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    
    console.log('✅ Connected to FTP server');
    
    // Navigate to api-proxy directory
    await client.cd('api-proxy');
    console.log('✅ Changed to api-proxy');
    
    // Delete old file if it exists
    try {
      await client.remove('proxy-server.js');
      console.log('✅ Deleted old proxy-server.js');
    } catch (e) {
      console.log('No existing file to delete');
    }
    
    // Upload new CommonJS version
    await client.uploadFrom('proxy-server.js', 'proxy-server.js');
    console.log('✅ Uploaded new proxy-server.js (CommonJS syntax)');
    
  } catch (err) {
    console.error('FTP Error:', err);
  } finally {
    client.close();
  }
}

deployProxy();
