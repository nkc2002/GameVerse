import { cloudinary } from '../config/cloudinary';
import { config } from '../config';
import fs from 'fs';

export interface UploadResult {
  url: string;
  publicId?: string;
}

export const uploadFile = async (filePath: string, folder = 'gameverse'): Promise<UploadResult> => {
  if (config.useCloudinary) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    
    fs.unlinkSync(filePath);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
  
  const fileName = filePath.split(/[\\/]/).pop();
  const url = `/uploads/${fileName}`;
  
  return { url };
};

export const deleteFile = async (publicId: string): Promise<void> => {
  if (config.useCloudinary && publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};


