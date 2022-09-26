import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import Jimp from 'jimp';

const execAsync = promisify(exec);

function getRandomFrame(maxFrame: number): number {
  let random = Math.round(Math.random() * maxFrame);
  if (random + 60 <= maxFrame) return random;
  return getRandomFrame(maxFrame);
}

async function writeWatermark(frameIndex: number, text: string, basePath: string) {
  const filePath = path.join(basePath, `${frameIndex}.png`);
  const image = await Jimp.read(filePath);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const width = image.getWidth();
  const height = image.getHeight();
  image.print(font, width / 2, height / 2, text);
  image.write(filePath);
}

(async function () {
  const input = 'input.mp4';
  const output = 'output.mp4';
  const videoEncoder = 'h264';
  const debug = false;

  const rawPath = path.join(__dirname, '..', 'temp', 'raw');
  const framesPath = path.join(rawPath, 'frames');
  const tempVideoPath = path.join(rawPath, 'videos');
  try {
    console.time('process');

    fs.rmSync(rawPath, { recursive: true, force: true });
    fs.mkdirSync(framesPath, { recursive: true });
    fs.mkdirSync(tempVideoPath, { recursive: true });

    await execAsync(`ffmpeg -y -i videos/${input} ${framesPath}/%d.png`);

    const frames = fs.readdirSync(framesPath);
    const totalFrames = frames.length;
    const randomFrame = getRandomFrame(totalFrames);
    const framesToEdit = frames.splice(randomFrame, 60);
    const promises = framesToEdit.map((f, i) => writeWatermark(randomFrame + i, 'anti-pirata', framesPath));
    await Promise.all(promises);

    await execAsync(
      `ffmpeg -y -start_number 1 -i ${framesPath}/%d.png -vcodec ${videoEncoder} ${tempVideoPath}/no-audio.mp4`
    );

    await execAsync(
      `ffmpeg -y -i ${tempVideoPath}/no-audio.mp4 -i videos/${input} -c copy -map 0:0 -map 1:1 videos/${output}`
    );

    fs.rmSync(rawPath, { recursive: true, force: true });
    console.timeEnd('process');
  } catch (error) {
    if (!debug) fs.rmdirSync(rawPath);
  }
})();
