import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../api';

export const useUploadSingle = () => {
  return useMutation({
    mutationFn: (file: File) => uploadApi.single(file),
  });
};

export const useUploadMultiple = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadApi.multiple(files),
  });
};


