//GNU nano 6.4                                                                                                                       scraper.js
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    const selector = req.query.selector;

    if (!url) {
        return res.status(400).send('Falta el parámetro url');
    }
        try{
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    // Activar la interceptación de solicitudes
    await page.setRequestInterception(true);

    // Si la solicitud es para un archivo CSS, abortar
    page.on('request', (request) => {
        if (request.resourceType() === 'stylesheet') {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.goto(url);

    // Si se proporcionó un selector, espera a que aparezca en la página
    if (selector) {
        await page.waitForSelector(selector);
    }

    // Obtener el contenido del body principal de la página
    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();

    await browser.close();

    // Enviar la respuesta como JSON
    res.json({succeeded:true, messages:'', data: html});
        } catch (error) {
        res.json({succeeded:false, messages:error, data: ''});
    }
});

app.listen(3000, () => {
    console.log('Aplicación escuchando en el puerto 3000!');
});

