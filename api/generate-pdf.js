import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  try {
    // receber HTML via POST ou gerar a partir de dados
    const html = req.method === 'POST' && req.body && req.body.html
      ? req.body.html
      : '<html><body><h1>Resultado</h1><p>Sem HTML enviado.</p></body></html>';

    const executablePath = await chromium.executablePath();
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '10mm', bottom: '10mm' } });

    await browser.close();

    const filename = 'resultado-mindset-' + new Date().toISOString().slice(0,10) + '.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error('pdf error', err);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
}
