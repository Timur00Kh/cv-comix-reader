declare global {
  interface Window {
    openCvLoaded: boolean;
  }
}

export default async function openCvReady(wait = 10000): Promise<boolean> {
  window.openCvLoaded = window.openCvLoaded || false;
  let waited = 0;
  return new Promise((resolve, reject) => {
    if (window.openCvLoaded) resolve(true);

    const timeInterval = 100;
    const i = setInterval(() => {
      if (window.openCvLoaded) {
        resolve(true);
        clearInterval(i);
      } else if (waited > wait) {
        reject(new Error('Слишком долго'));
        clearInterval(i);
      }
      waited += timeInterval;
    }, timeInterval);
  });
}
