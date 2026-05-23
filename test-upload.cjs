const BasicFtp = require('basic-ftp');
require('dotenv').config();

async function test() {
  const client = new BasicFtp.Client();
  
  try {
    await client.access({
      host: process.env.CPANEL_HOST,
      user: process.env.CPANEL_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    
    console.log('Connected');
    await client.cd('api-proxy');
    const list = await client.list();
    console.log('Files in api-proxy:');
    list.forEach(f => console.log(`  ${f.name} (${f.size} bytes, modified: ${f.modifiedAt})`));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}

test();
