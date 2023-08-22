const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const processRequest = require("./app/process-request.js");

const app = express();
app.use(cors());
let browser; // Variable para almacenar el navegador


app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  const selector = req.query.selector;
  const loadImages = req.query.loadImages !== 'false'; // El parámetro para decidir si cargar imágenes o no

  if (!url) {
    return res.status(400).send('Falta el parámetro url');
  }

  try {
    if (!browser) {
      // Si el navegador no está abierto, abrirlo
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1366, height: 768 },
      });
    }

    const page = await browser.newPage();

    // Si la página ha estado abierta durante más de 3 minutos, cerrarla
    const timeout = setTimeout(async () => {
      await page.close();
    }, 1 * 60 * 1000);

    // Activar la interceptación de solicitudes
    await page.setRequestInterception(true);

    // Si la solicitud es para un archivo CSS, abortar
    page.on('request', (request) => {
      if (request.resourceType() === 'stylesheet' || (!loadImages && request.resourceType() === 'image')) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Si se proporcionó un selector, espera a que aparezca en la página
    if (selector) {
      await page.waitForSelector(selector);
    }

    // Obtener el contenido del body principal de la página
    const html = await page.evaluate(() => document.body.innerHTML);

    // Cerrar la página actual
    await page.close();

    // Cancelar el temporizador, ya que la página ya se ha cerrado
    clearTimeout(timeout);

    // Enviar la respuesta como JSON
    res.json({ succeeded: true, messages: '', data: html });
  } catch (error) {
    res.json({ succeeded: false, messages: error.message, data: '' });
  }
});


app.get("/img", processRequest);

app.listen(3000, () => {
  console.log('http://localhost:3000');
});


