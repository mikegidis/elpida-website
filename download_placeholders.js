const fs = require('fs');
const path = require('path');
const https = require('https');

const brands = [
    'dove',
    'vaseline',
    'nivea',
    'loreal',
    'garnier',
    'pantene',
    'tresemme',
    'head-and-shoulders',
    'gillette',
    'old-spice'
];

const dir = path.join(__dirname, 'Frontend', 'src', 'assets', 'brands');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

brands.forEach(brand => {
    const text = brand.replace(/-/g, '+');
    const url = `https://placehold.co/300x100/F7F3EE/2D1424/png?text=${text}`;
    const filePath = path.join(dir, `${brand}.png`);
    
    https.get(url, (res) => {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded ${brand}.png`);
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${brand}:`, err.message);
    });
});
