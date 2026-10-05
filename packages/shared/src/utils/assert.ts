export const assert = <T>(
  value: T,
  message = 'Value is not defined'
): asserts value is NonNullable<T> => {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
};
