export function range(start, end) {
  let result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}
