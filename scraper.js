const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('http://example.com');

    const html = await page.content();

    console.log(html);

    await browser.close();
}

run().catch(console.error);
