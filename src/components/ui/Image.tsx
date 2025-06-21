import React, { useEffect, useState, lazy } from 'react';
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}
export const Image = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const widths = [400, 800, 1200];
    return widths.map(w => {
      const url = new URL(src);
      url.searchParams.set('w', w.toString());
      url.searchParams.set('q', '75');
      return `${url.toString()} ${w}w`;
    }).join(', ');
  };
  return <div className={`relative overflow-hidden ${className}`} style={{
    aspectRatio: width && height ? width / height : undefined
  }}>
      {isLoading && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
      <img src={src} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} srcSet={generateSrcSet()} sizes={sizes} onLoad={() => setIsLoading(false)} onError={e => setError(new Error('Failed to load image'))} className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `} {...props} />
      {error && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-sm">Failed to load image</span>
        </div>}
    </div>;
};