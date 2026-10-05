import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react';

type TypeWithDisplayName = ReactElement & {
  type: { displayName: string };
};

const isElementWithDisplayName = (
  element: Exclude<ReactNode, boolean | null | undefined>
): element is TypeWithDisplayName =>
  isValidElement(element) &&
  'props' in element &&
  typeof element.type !== 'string' &&
  'displayName' in element.type &&
  typeof element.type.displayName === 'string';

/**
 * A hook to extract children of a specific type from a composition.
 * @example
 * const result = useComposition(
 *   _children,
 *   ChatAvatar.displayName,
 *   ChatMessageTimestamp.displayName
 * );
 * const [children, avatars, timestamps] = result;
 * @param children - The children passed to the component.
 * @param displayNames - The display names of the components to extract.
 * @returns An array of arrays of children of the specified types
 */
export function useComposition<T extends string | undefined>(
  children: ReactNode,
  ...displayNames: Array<T>
): [Array<ReactNode>, ...Array<Array<ReactNode>>] {
  const composition = useMemo(() => {
    const result: Array<Array<ReactNode>> = [];
    const elements: Array<{ displayName: string; element: ReactNode }> = [];
    const invalidChildren: Array<ReactNode> = [];

    for (const child of Children.toArray(children)) {
      if (
        isElementWithDisplayName(child) &&
        displayNames.some((name) => child.type.displayName === name)
      ) {
        elements.push({ displayName: child.type.displayName, element: child });
      } else {
        invalidChildren.push(child);
      }
    }

    for (const displayName of displayNames) {
      result.push(
        elements
          .filter((el) => el.displayName === displayName)
          // is never async...
          // eslint-disable-next-line @typescript-eslint/promise-function-async
          .map((el) => el.element)
      );
    }
    result.splice(0, 0, invalidChildren);
    return result as [Array<ReactNode>, ...Array<Array<ReactNode>>];
  }, [children, displayNames]);

  return composition;
}
