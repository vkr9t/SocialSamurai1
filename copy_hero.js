import fs from 'fs';
import path from 'path';

const srcImg = 'C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\64818276-befd-4529-b05d-389e8cb3b7e7\\cyber_samurai_purple_hero_1787195839623.jpg';
const destImg = path.resolve('public/hero_samurai.jpg');

try {
  fs.copyFileSync(srcImg, destImg);
  console.log('Successfully copied hero image to public/hero_samurai.jpg');
} catch (e) {
  console.error('Error copying:', e);
}
