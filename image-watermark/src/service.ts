import path from 'path';
import Jimp from 'jimp';
import { Timer } from 'timer-node';
import logger from './logger';

const IMAGE_FOLDER_PATH = path.join(__dirname, '..', 'images');

export default class ImageService {
  writeWatermark = async (imageOrPath: string | Jimp, text?: string) => {
    const timer = new Timer({ label: 'watermark process' });
    timer.start();
    const { image, height, width } = await this.read(imageOrPath);
    if (text) {
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
      image.print(font, width / 2, height / 2, text);
    } else {
      const { image: watermarkImage } = await this.read(path.join(IMAGE_FOLDER_PATH, '..', 'images/watermark.png'));
      image.composite(watermarkImage, width / 2, height / 2);
    }
    const resultImagePath = path.join(IMAGE_FOLDER_PATH, `aurora-watermarked${text ? '-text' : '-image'}.jpg`);
    image.write(resultImagePath);
    logger.info(timer.format('%label [%s] seconds [%ms] ms'));
  };

  blurImage = async (imageOrPath: string | Jimp, size: number) => {
    const timer = new Timer({ label: 'blur process' });
    timer.start();
    const { image } = await this.read(imageOrPath);

    image.blur(size);
    const resultImagePath = path.join(IMAGE_FOLDER_PATH, 'aurora-blurred.jpg');
    image.write(resultImagePath);
    logger.info(timer.format('%label [%s] seconds [%ms] ms'));
  };

  pixelateImage = async (imageOrPath: string | Jimp, size: number) => {
    const timer = new Timer({ label: 'pixelate process' });
    timer.start();

    const { image } = await this.read(imageOrPath);
    image.pixelate(size);
    const resultImagePath = path.join(IMAGE_FOLDER_PATH, 'aurora-pixelated.jpg');
    image.write(resultImagePath);
    logger.info(timer.format('%label [%s] seconds [%ms] ms'));
  };

  resize = async ({ imageOrPath, height, width }: { imageOrPath: string | Jimp; height?: number; width?: number }) => {
    const timer = new Timer({ label: 'resize process' });
    timer.start();
    const { image } = await this.read(imageOrPath);
    if (height && width) image.resize(width, height);
    if (height) image.resize(Jimp.AUTO, height);
    if (width) image.resize(width, Jimp.AUTO);
    const resultImagePath = path.join(IMAGE_FOLDER_PATH, 'aurora-resized.jpg');
    image.write(resultImagePath);
    logger.info(timer.format('%label [%s] seconds [%ms] ms'));
  };

  private read = async (imageOrPath: string | Jimp) => {
    const image = typeof imageOrPath === 'string' ? await Jimp.read(imageOrPath) : imageOrPath;
    const height = image.getHeight();
    const width = image.getWidth();
    return { image, height, width };
  };
}
