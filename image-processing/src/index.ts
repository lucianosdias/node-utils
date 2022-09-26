import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

(async function () {
  console.time('process');

  await imagemin(['images/*.{jpg,png}'], {
    destination: 'optmized',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  console.timeEnd('process');
})();
