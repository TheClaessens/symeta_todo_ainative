import React, { isValidElement, type ReactNode } from 'react';

export function useHasProp<T extends object, P extends keyof T = keyof T>(
  _children: NonNullable<ReactNode>,
  prop: P,
  value: T[P]
) {
  return React.useMemo(() => {
    const children = Array.isArray(_children) ? _children : [_children];
    return children.some(
      (child) => isValidElement<T>(child) && child.props[prop] === value
    );
  }, [_children, prop, value]);
}
