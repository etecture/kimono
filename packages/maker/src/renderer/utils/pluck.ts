function uniq<T>(arr: T[]) {
  return arr.reduce((result: T[], value) => {
    if (!result.includes(value)) {
      result.push(value);
    }
    return result;
  }, []);
}
export type PluckResult = [Record<string, unknown>, Record<string, unknown>];

export function pluck(obj: Record<string, unknown>, keys: string[]): PluckResult {
  const allKeys = uniq<string>([...Object.keys(obj), ...keys]);
  return allKeys.reduce(
    (result: PluckResult, key: string) => {
      if (keys.includes(key)) {
        Object.assign(result[0], { [key]: obj[key] });
      } else {
        Object.assign(result[1], { [key]: obj[key] });
      }
      return result;
    },
    [{}, {}]
  );
}
