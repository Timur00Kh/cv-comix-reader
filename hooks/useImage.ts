import { useEffect, useState } from 'react';

export default function useImage(
  src: string
): [HTMLImageElement, string | Event] {
  const [image, setImage] = useState<HTMLImageElement>();
  const [error, setError] = useState<string | Event>();

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
    img.onerror = (e) => {
      setError(e);
    };
  }, [src]);

  return [image, error];
}
