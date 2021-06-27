export default function sleep(wait = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), wait);
  });
}
