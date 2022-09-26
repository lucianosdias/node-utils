import path from 'path';
import Jimp from 'jimp';
import { Timer } from 'timer-node';
import logger from './logger';
import ImageService from './service';

const IMAGE_FOLDER_PATH = path.join(__dirname, '..', 'images');

(async function () {
  const service = new ImageService();
  const imagePath = path.join(IMAGE_FOLDER_PATH, 'aurora.jpg');
  const timer = new Timer({ label: 'all process' });
  timer.start();

  // Image Path

  // await Promise.all([
  //   service.writeWatermark(imagePath, 'algumemail@email.com'),
  //   service.blurImage(imagePath, 50),
  //   service.pixelateImage(imagePath, 50),
  //   service.resize({ imagePath, height: 250 }),
  // ]);

  // await service.writeWatermark(imagePath);
  // await service.writeWatermark(imagePath, 'algumemail@email.com');
  // await service.blurImage(imagePath, 50);
  // await service.pixelateImage(imagePath, 50);
  // await service.resize({ imageOrPath: imagePath, height: 250 });

  // Image Clone
  const image = await Jimp.read(imagePath);
  // await Promise.all([
  //   service.writeWatermark(image.clone()),
  //   service.writeWatermark(image.clone(), 'algumemail@email.com'),
  //   service.blurImage(image.clone(), 50),
  //   service.pixelateImage(image.clone(), 50),
  //   service.resize({ imageOrPath: image.clone(), height: 250 }),
  // ]);
  await service.writeWatermark(image.clone());
  await service.writeWatermark(image.clone(), 'algumemail@email.com');
  await service.blurImage(image.clone(), 50);
  await service.pixelateImage(image.clone(), 50);
  await service.resize({ imageOrPath: image.clone(), height: 250 });

  logger.info(timer.format('%label [%s] seconds [%ms] ms'));
})();
