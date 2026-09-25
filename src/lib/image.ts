/** Image helpers that run in the browser. No React, no Firebase. */

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

interface SquareImageOptions {
  /** Width and height of the result, in pixels. */
  size: number;
  /** JPEG quality, 0-1. */
  quality: number;
  /** Files bigger than this are rejected before decoding, in bytes. */
  maxInputBytes: number;
}

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageProcessingError("That file couldn't be opened as an image. Try a JPG, PNG or WebP."));
    };
    image.src = url;
  });

/**
 * Center-crops an image file to a square and shrinks it to `size` pixels, returned as a JPEG data URL.
 * Small enough to store directly in a Firestore document (roughly 10-40 KB at 256px).
 */
export const cropImageToSquareDataUrl = async (file: File, { size, quality, maxInputBytes }: SquareImageOptions) => {
  if (!file.type.startsWith("image/")) {
    throw new ImageProcessingError("Choose an image file (JPG, PNG or WebP).");
  }
  if (file.size > maxInputBytes) {
    throw new ImageProcessingError(`Choose an image under ${Math.round(maxInputBytes / (1024 * 1024))} MB.`);
  }

  const image = await loadImage(file);
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  if (!side) throw new ImageProcessingError("That image is empty. Try another one.");

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageProcessingError("Your browser couldn't process the image. Try another browser.");

  // JPEG has no transparency: paint a dark background so transparent PNGs don't turn black-on-black unpredictably.
  context.fillStyle = "#12151c";
  context.fillRect(0, 0, size, size);
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    (image.naturalWidth - side) / 2,
    (image.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  return canvas.toDataURL("image/jpeg", quality);
};
