const puppeteer = require('puppeteer');
const path = require('path');

async function capturePage() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for full page capture
    await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2 // Retina quality
    });
    
    // Load the page
    const filePath = path.join(__dirname, 'index.html');
    await page.goto(`file://${filePath}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Trigger all animations by scrolling through the page
    const sections = ['hero', 'section-video', 'section-workflow', 'section-gdpr', 'section-skills', 'section-ai', 'section-cta'];
    
    for (const section of sections) {
        await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'instant' });
        }, section);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate full-page PDF
    console.log('Generating PDF...');
    await page.pdf({
        path: 'starquest-onepager.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log('PDF saved: starquest-onepager.pdf');
    
    // Capture individual section screenshots for email
    console.log('Capturing section screenshots...');
    
    const screenshotSections = [
        { id: 'hero', name: 'hero' },
        { id: 'section-video', name: 'video' },
        { id: 'section-workflow', name: 'workflow' },
        { id: 'section-gdpr', name: 'gdpr' },
        { id: 'section-skills', name: 'skills' },
        { id: 'section-ai', name: 'ai' },
        { id: 'section-cta', name: 'cta' }
    ];
    
    for (const section of screenshotSections) {
        await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'instant' });
        }, section.id);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const element = await page.$(`#${section.id}`);
        if (element) {
            await element.screenshot({
                path: `email-images/section-${section.name}.png`,
                type: 'png'
            });
            console.log(`Captured: section-${section.name}.png`);
        }
    }
    
    // Also capture full page as single long image
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.screenshot({
        path: 'starquest-fullpage.png',
        fullPage: true,
        type: 'png'
    });
    console.log('Full page screenshot saved: starquest-fullpage.png');
    
    await browser.close();
    console.log('Done!');
}

capturePage().catch(console.error);
