'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface GalleryProps {
  title?: string;
  subtitle?: string;
  images?: GalleryImage[];
  columns?: 2 | 3 | 4;
}

export default function Gallery({
  title = 'Gallery',
  subtitle = 'Check out our latest work',
  images = [
    { src: 'https://picsum.photos/800/600?random=1', alt: 'Gallery image 1' },
    { src: 'https://picsum.photos/800/600?random=2', alt: 'Gallery image 2' },
    { src: 'https://picsum.photos/800/600?random=3', alt: 'Gallery image 3' },
    { src: 'https://picsum.photos/800/600?random=4', alt: 'Gallery image 4' },
    { src: 'https://picsum.photos/800/600?random=5', alt: 'Gallery image 5' },
    { src: 'https://picsum.photos/800/600?random=6', alt: 'Gallery image 6' },
  ],
  columns = 3,
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-4 ${columnClasses[columns]}`}>
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.caption && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || 'Gallery image'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
}
