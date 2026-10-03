const DEFAULT_CLOUD_NAME = 'dczg8gaw';
const DEFAULT_UPLOAD_PRESET = 'bilar_media';

const cloudName = String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME).trim();
const uploadPreset = String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || DEFAULT_UPLOAD_PRESET).trim();

export const cloudinaryConfigured = Boolean(cloudName && uploadPreset);

const optimizeImage = async (file: File): Promise<File> => {
  if (file.type === 'image/svg+xml') return file;

  const bitmap = await createImageBitmap(file);
  const max = 1800;
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, max / longest);
  const needsResize = scale < 1;
  const alreadyEfficient = file.type === 'image/webp' && !needsResize && file.size < 300 * 1024;
  if (alreadyEfficient) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) { bitmap.close(); return file; }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.80));
  if (!blob) return file;
  const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], name, { type: 'image/webp', lastModified: Date.now() });
};

export const uploadOptimizedImage = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  if (!cloudinaryConfigured) {
    throw new Error('cloudinary-not-configured');
  }

  const optimized = await optimizeImage(file);
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;
  const form = new FormData();
  form.append('file', optimized);
  form.append('upload_preset', uploadPreset);
  form.append('folder', 'bilar');

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let finished = false;
    const timeout = window.setTimeout(() => {
      if (!finished) {
        finished = true;
        xhr.abort();
        reject(new Error('upload-timeout'));
      }
    }, 20000);

    xhr.open('POST', endpoint);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      reject(new Error('upload-network'));
    };
    xhr.ontimeout = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      reject(new Error('upload-timeout'));
    };
    xhr.onload = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (!data?.secure_url) throw new Error('missing-url');
          onProgress?.(100);
          resolve(data.secure_url as string);
        } catch {
          reject(new Error('upload-invalid-response'));
        }
      } else {
        let message = 'Falha no upload.';
        try { message = JSON.parse(xhr.responseText)?.error?.message || message; } catch {}
        reject(new Error(message));
      }
    };
    xhr.send(form);
  });
};
