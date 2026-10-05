import type { FC, ReactNode } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { isAxiosError } from 'axios';

import { useAuth } from '@/providers/auth-provider';

const isUnauthorized = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.status === 401;
  }
  return false;
};

interface TanstackProviderProps {
  children: ReactNode;
}
export const TanstackProvider: FC<TanstackProviderProps> = ({ children }) => {
  const { logout } = useAuth();
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorized(error)) {
          logout();
          throw redirect({ to: '/auth/login' });
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
