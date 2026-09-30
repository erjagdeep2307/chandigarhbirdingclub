import imageCompression from 'browser-image-compression';

const CLOUD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUD_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;
export interface CloudinaryUploadResp {
  public_id: string;
  secure_url: string;
}

export function getCloudinaryModalUrl(url: string): string {
  if (!url.includes('res.cloudinary.com/') || !url.includes('/upload/')) {
    return url;
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_1200/');
}

export async function uploadCloudinary(file: File): Promise<CloudinaryUploadResp> {
  if (!CLOUD_NAME || !CLOUD_PRESET) {
    throw new Error('Cloudinary is not configured. Add the public cloud name and upload preset.');
  }
  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  const compressedImage = await imageCompression(file, compressionOptions);
  const formData = new FormData();
  formData.append('file', compressedImage);
  formData.append('upload_preset', CLOUD_PRESET);
  if (CLOUD_FOLDER) {
    formData.append('folder', CLOUD_FOLDER);
  }
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new Error(errorData.error?.message || 'Failed to upload image.');
  }

  const data = (await response.json()) as CloudinaryUploadResp;
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
}
