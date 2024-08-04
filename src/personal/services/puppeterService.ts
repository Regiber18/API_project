import puppeteer from 'puppeteer';

export async function generateScreenshot(url: string, outputPath: string): Promise<void> {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url);

    await page.screenshot({ path: outputPath });

    await browser.close();
  } catch (error) {
    console.error('Error generating screenshot with Puppeteer:', error);
    throw error;
  }
}
