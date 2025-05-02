import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import imageCompression from 'browser-image-compression';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeLink(link?: string) {
  if(!link) return '';

  return link
  .replace(/\s/g, '')
  .replace(/[!@#$%^&*()_+\-=\[\]{};':"\\,^.<>\/?]+/, '')
  .toLocaleLowerCase();
}

export async function compressFiles(files: File[]) { 
  const compressPromises = files.map(async (file) => {
    try {
      return await compressImage(file);
    } catch (error) {
      console.error("Error compressing file:", error);
      return null;
    }
  });

  return (await Promise.all(compressPromises)).filter((file) => file !== null) as File[];
}

export const compressImage = (file: File) => {
  return new Promise((resolve, reject) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 900,
      useWebWorker: true,
      fileType: "image/png",
    };

    imageCompression(file, options)
      .then((compressedFile) => {
        resolve(compressedFile);
      })
      .catch((error) => {
        console.error("Error compressing image:", error);
        reject(error);
      });
  });
}