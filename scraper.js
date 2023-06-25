const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://example.com');

    const html = await page.content();

    console.log(html);

    await browser.close();
}

run().catch(console.error);
