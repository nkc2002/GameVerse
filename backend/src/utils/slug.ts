import slugify from 'slugify';
import { Post } from '../models';

export const generateUniqueSlug = async (title: string): Promise<string> => {
  let slug = slugify(title, { lower: true, strict: true });
  
  const existingPost = await Post.findOne({ slug });
  
  if (existingPost) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    slug = `${slug}-${randomSuffix}`;
  }
  
  return slug;
};


