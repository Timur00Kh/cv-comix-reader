declare let openCvLoaded;

export default async function openCvReady(wait = 10000): Promise<boolean> {
  let waited = 0;
  return new Promise((resolve, reject) => {
    if (openCvLoaded) resolve(true);

    const timeInterval = 100;
    const i = setInterval(() => {
      if (openCvLoaded) {
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
