'use client';

import { File as FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';

const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(url);

const MedicineFilesCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const files = medicine.files ?? [];
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState<string>('');

  const openPreview = (src: string, alt: string) => {
    setPreviewSrc(src);
    setPreviewAlt(alt);
  };

  const closePreview = () => {
    setPreviewSrc(null);
    setPreviewAlt('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>
          Medicine Images
        </CardTitle>
      </CardHeader>

      <CardContent>
        {files.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No files uploaded.</p>
        ) : (
          <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
            {files.map((file) =>
              isImage(file.file) ? (
                <button
                  key={file.uid}
                  type='button'
                  onClick={() =>
                    openPreview(file.file, file.name ?? medicine.name)
                  }
                  className='border-border relative aspect-square cursor-zoom-in overflow-hidden rounded-md border'
                >
                  <Image
                    src={file.file}
                    alt={file.name ?? medicine.name}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                </button>
              ) : (
                <button
                  key={file.uid}
                  type='button'
                  onClick={() =>
                    window.open(file.file, '_blank', 'noopener,noreferrer')
                  }
                  className='border-border hover:bg-muted/50 flex aspect-square flex-col items-center justify-center gap-1 rounded-md border p-2 text-center'
                >
                  <FileIcon className='text-muted-foreground h-5 w-5' />
                  <span className='text-muted-foreground line-clamp-2 text-xs'>
                    {file.name ?? 'File'}
                  </span>
                </button>
              ),
            )}
          </div>
        )}
      </CardContent>

      {previewSrc && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
          onClick={closePreview}
        >
          <button
            type='button'
            onClick={closePreview}
            className='absolute top-4 right-4 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20'
            aria-label='Close preview'
          >
            <X className='text-danger h-6 w-6' />
          </button>

          <div
            className='relative h-full max-h-[90vh] w-full max-w-5xl'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewSrc}
              alt={previewAlt}
              fill
              sizes='100vw'
              className='object-contain'
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default MedicineFilesCard;
