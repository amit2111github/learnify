'use client';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';

import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export default function FileUpload({ onChange, endpoint }: FileUploadProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => {
        toast.error(
          error.message || 'An error occurred while uploading the file'
        );
      }}
      className='ut-button:bg-indigo-700 ut-label:text-indigo-600'
    />
  );
}
