import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcImg = 'C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\64818276-befd-4529-b05d-389e8cb3b7e7\\cyber_samurai_purple_hero_1787195839623.jpg';
const outDir = path.resolve('public/mascot');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generateMascotAssets() {
  const meta = await sharp(srcImg).metadata();
  console.log('Image dimensions:', meta.width, 'x', meta.height);

  // Full body resize
  const fullBody = await sharp(srcImg)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toBuffer();

  // Head close up
  const headCrop = await sharp(srcImg)
    .extract({
      left: Math.round(meta.width * 0.28),
      top: Math.round(meta.height * 0.14),
      width: Math.round(meta.width * 0.44),
      height: Math.round(meta.height * 0.44),
    })
    .resize(512, 512, { fit: 'contain', background: { r: 8, g: 8, b: 12, alpha: 1 } })
    .png()
    .toBuffer();

  const fullStates = ['ready', 'working', 'scanning', 'celebration', 'guard', 'idea'];
  for (const s of fullStates) {
    fs.writeFileSync(path.join(outDir, `${s}.png`), fullBody);
  }

  const headStates = ['avatar', 'focused', 'happy', 'thinking', 'excited'];
  for (const s of headStates) {
    fs.writeFileSync(path.join(outDir, `${s}.png`), headCrop);
  }

  // Also save mascot_avatar.jpg and hero_samurai.jpg in public
  fs.writeFileSync(path.resolve('public/hero_samurai.jpg'), fs.readFileSync(srcImg));
  fs.writeFileSync(path.resolve('public/mascot_avatar.jpg'), fs.readFileSync(srcImg));
  console.log('Generated all purple mascot assets successfully!');
}

generateMascotAssets().catch(console.error);
