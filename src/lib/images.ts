// Serves Cloudinary images resized and in a modern format (f_auto picks WebP/AVIF per browser).
// Other URLs are returned unchanged.
export function optimizedImageUrl(url: string, width: number): string {
  const marker = '/image/upload/';
  if (!url.includes('res.cloudinary.com') || !url.includes(marker)) return url;
  return url.replace(marker, `${marker}f_auto,q_auto,w_${width},c_limit/`);
}
