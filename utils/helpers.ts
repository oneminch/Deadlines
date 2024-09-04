const circularAccess = <T>(arr: Array<T>, index: number) =>
  arr[((index % arr.length) + arr.length) % arr.length];

export { circularAccess };
