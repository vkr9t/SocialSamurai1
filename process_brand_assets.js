import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const logoSrc = 'C:/Users/Manish Reddy/.gemini/antigravity-ide/brain/72db9978-72e8-4e7e-ab54-15a26ed795ce/.user_uploaded/media_1787202402354.png';
const avatarsSrc = 'C:/Users/Manish Reddy/.gemini/antigravity-ide/brain/72db9978-72e8-4e7e-ab54-15a26ed795ce/.user_uploaded/media_1787202636104.png';

async function processImages() {
  const publicDir = path.resolve('public');
  const avatarsDir = path.resolve('public/avatars');
  if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

  // 1. Copy exact full logo banner
  await sharp(logoSrc).toFile(path.join(publicDir, 'social_samurai_logo.png'));
  console.log('Saved public/social_samurai_logo.png');

  // 2. Crop just the S mark icon from the logo
  // Logo is 1024x423. The S is on the left side
  await sharp(logoSrc)
    .extract({ left: 60, top: 40, width: 260, height: 340 })
    .toFile(path.join(publicDir, 'social_samurai_mark.png'));
  console.log('Saved public/social_samurai_mark.png');

  // 3. Crop 6 avatars from avatarsSrc (1024x341)
  const avatarNames = ['hunter', 'strategist', 'creator', 'warrior', 'sensei', 'ronin'];
  
  // Total width: 1024. Let's get precise regions for each card:
  // Card 0: left 15, width 155
  // Card 1: left 175, width 155
  // Card 2: left 335, width 155
  // Card 3: left 495, width 155
  // Card 4: left 655, width 155
  // Card 5: left 815, width 155

  for (let i = 0; i < 6; i++) {
    const left = Math.round(10 + i * 168);
    const width = 160;
    const name = avatarNames[i];

    // Extract full card
    await sharp(avatarsSrc)
      .extract({ left: Math.min(1024 - width, left), top: 50, width, height: 240 })
      .toFile(path.join(avatarsDir, `${name}_card.png`));

    // Extract square portrait avatar
    await sharp(avatarsSrc)
      .extract({ left: Math.min(1024 - width, left), top: 60, width, height: 160 })
      .resize(300, 300, { fit: 'cover' })
      .toFile(path.join(avatarsDir, `${name}.png`));

    console.log(`Saved avatar for ${name}`);
  }
}

processImages().catch(console.error);
