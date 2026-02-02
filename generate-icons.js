const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const icons = [
    { name: 'video', color: '#6366f1', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>' },
    { name: 'workflow', color: '#22c55e', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>' },
    { name: 'sparkles', color: '#f59e0b', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>' },
    { name: 'shield-check', color: '#10b981', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>' }
];

async function generateIcons() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    for (const icon of icons) {
        // Create HTML with colored SVG
        const coloredSvg = icon.svg.replace('currentColor', icon.color);
        const html = `
            <!DOCTYPE html>
            <html>
            <head><style>body{margin:0;padding:0;background:transparent;}</style></head>
            <body>${coloredSvg}</body>
            </html>
        `;
        
        await page.setContent(html);
        await page.setViewport({ width: 24, height: 24, deviceScaleFactor: 4 }); // 4x for crisp icons
        
        await page.screenshot({
            path: path.join(__dirname, 'icons', `${icon.name}.png`),
            type: 'png',
            omitBackground: true
        });
        
        console.log(`Generated: ${icon.name}.png`);
    }
    
    await browser.close();
    console.log('Done!');
}

generateIcons().catch(console.error);
