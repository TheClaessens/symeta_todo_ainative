export const partition = <T>(
  array: Array<T>,
  predicate: (item: T) => boolean
): [Array<T>, Array<T>] =>
  array.reduce(
    ([pass, fail], item) =>
      predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]],
    [[], []] as [Array<T>, Array<T>]
  );
