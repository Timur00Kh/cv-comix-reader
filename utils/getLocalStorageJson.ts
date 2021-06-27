export function getLocalStorageJson(name: string): any {
  let json;
  try {
    const item = localStorage.getItem(name);
    if (item) {
      json = JSON.parse(item);
    }
  } catch (e) {
    json = null;
  }
  return json;
}
