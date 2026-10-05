import { useCallback, useState } from 'react';

export interface UseOpenProps<Value = unknown> {
  defaultOpen?: boolean;
  stopPropagationOnClick?: boolean;
  initialValues?: Value;
}

export function useOpen<Value = unknown>(props: UseOpenProps<Value>) {
  const { defaultOpen = false, initialValues = undefined } = props;

  const [open, setOpen] = useState(defaultOpen);

  const [value, setValue] = useState<Value | undefined>(initialValues);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onOpenChangeWithValue = useCallback(
    (arg: Value) => {
      setValue(arg);
      onOpenChange(true);
    },
    [onOpenChange]
  );

  return {
    open,
    value,
    onOpenChange,
    onOpenChangeWithValue,
  };
}
