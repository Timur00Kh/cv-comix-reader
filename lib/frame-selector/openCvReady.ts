let openCvLoaded = false;

export default async function openCvReady(wait = 10000): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (openCvLoaded) resolve(true);
    const t = setTimeout(() => {
      reject(new Error('Слишком долго'));
    }, wait);
    cv.onRuntimeInitialized = () => {
      openCvLoaded = true;
      clearTimeout(t);
      resolve(true);
    };
  });
}
