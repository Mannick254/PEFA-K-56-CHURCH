const fs = require('fs');
const path = require('path');
const https = require('https');

async function submitToIndexNow() {
  const host = 'pefa-k-56-church.vercel.app';
  const key = 'indexnowkey'; // The same key as in your .txt file
  const keyLocation = `https://${host}/indexnowkey.txt`;
  const sitemapPath = path.resolve(__dirname, './public/sitemap.xml');

  try {
    const sitemap = await fs.promises.readFile(sitemapPath, 'utf8');

    const urlRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    const urlList = [];
    while ((match = urlRegex.exec(sitemap)) !== null) {
      urlList.push(match[1]);
    }

    if (urlList.length === 0) {
      console.log('No URLs found in sitemap. Skipping IndexNow submission.');
      return;
    }

    const payload = JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    });

    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      console.log(`IndexNow submission status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('IndexNow submission successful!');
      } else {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => console.error(`IndexNow submission failed: ${data}`));
      }
    });

    req.on('error', (error) => {
      console.error('Error submitting to IndexNow:', error);
    });

    req.write(payload);
    req.end();

  } catch (error) {
    console.error('Failed to read sitemap or submit to IndexNow:', error);
  }
}

submitToIndexNow();
